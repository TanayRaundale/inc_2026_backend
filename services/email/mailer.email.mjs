import nodemailer from 'nodemailer';
import { officialEmails } from '../../static/adminData.mjs';
import { getJudgingSlots } from '../../static/eventsData.mjs';
import emailTemplates from './htmlGenerators.email.mjs';
import { writeFileSync } from 'fs';

const env = process.env

function emailService() {
	const eventEmailTransporter = nodemailer.createTransport({
		pool: true,
		service: 'gmail',
		secure:true, //changes made here 
		port: 465,
		auth: {
			user: officialEmails.get('info'),
			pass: env.INFO_EMAIL_PASSWORD
		},
		tls: {
			rejectUnauthorized: false
		}
	})

	const bulkEmailTransporter = nodemailer.createTransport({
		service: 'gmail',
		port: 465,
		pool: true,
		maxMessages: Infinity,
		maxConnections: 5,
		auth: {
			user: officialEmails.get('info'),
			pass: env.INFO_EMAIL_PASSWORD
		},
		tls: {
			rejectUnauthorized: false
		}
	});

	const judgingEmailTransporter = nodemailer.createTransport({
		pool: true,
		service: 'gmail',
		port: 465,
		auth: {
			user: officialEmails.get('judging'),
			pass: env.JUDGE_EMAIL_PASSWORD
		},
		tls: {
			rejectUnauthorized: false
		}
	})

	async function eventRegistrationEmail(event_name, data) {
		try {
			const dynamicData = {
				event_name,
				team_id: data.pid,
				tentative_dates: "21st - 23rd March",
				whatsapp_url: data.whatsapp_url,
			}
			const mailOptions = {
				from: `InC 2025 <${officialEmails.get('info')}>`,
				to: data.email,
				bcc: `${officialEmails.get('queries')},${officialEmails.get(event_name.toLowerCase())}`,
				replyTo: officialEmails.get('queries'),
				subject: `Registered for PICT InC 2025 - ${event_name}`,
				priority: 'high',
				text: 'Email content',
				html: await emailTemplates.eventRegistrationEmail(dynamicData),
			};
			eventEmailTransporter.sendMail(mailOptions).then(() => {}).catch((e) => { console.log(e) });
			return "Emails sent successfully";
		} catch (err) {
			throw err;
		}
	}

	async function judgeRegistrationEmail(judge) {
		try {
			const slotsData = getJudgingSlots(judge?.events.toLowerCase());
			judge.slots = judge.slots
				.map(slot => parseInt(slot))
				.sort((a, b) => a - b)
				.map(slot => slotsData[slot])
				.join(", ");
			const mailOptions = {
				from: `InC 2025 Judging <${officialEmails.get('info')}>`,
				to: `${judge.name} <${judge.email}>`,
				// bcc: officialEmails.get('queries'),
				cc: officialEmails.get('judging'),
				replyTo: officialEmails.get('queries'),
				subject: 'Registered for PICT InC 2025 Judging',
				priority: 'high',
				text: 'Email content',
				html: await emailTemplates.judgeRegistrationEmail(judge)
			}
			eventEmailTransporter.sendMail(mailOptions).then(() => {}).catch((e) => { console.log(e) });
			return "judging mail sent successfully"
		} catch (err) { throw err }
	}

	async function sendBulkEmail(data) {
		try {

			const BATCH_SIZE = 50;

			const executeSendMail = async (emailArray) => {
				const allEmailPromises = emailArray.map(async (item) => {
					const mailOptions = {
						from: `InC 2025 <${officialEmails.get('info')}>`,
						to: `${item.email}`,
						cc: `InC Judging <${officialEmails.get('judging')}>`,
						replyTo: `InC Queries <${officialEmails.get('queries')}>`,
						subject: "Urgent - InC 2025: Bank Details of Winners (submit before March 23, 10pm)",
						priority: 'high',
						text: "Email content",
						// html: await emailTemplates.sendAllocationEmail(item),
						html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>InC 2025 - Prize Winner Bank Details Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear Winners,</p>
    <p>Greetings!</p>
    <p>You are kindly requested to share the Bank details for prize of Concepts 2025 between <strong>23 March 2025 evening</strong> (after declaration of results in the valedictory session) up to <strong>10:00 PM on 23 March 2025</strong>, in the Google Form given below.</p>

    <p><strong>InC 25 - Google Form Link:</strong> <a href="https://forms.gle/6bQUssXhmvLrNd7c7" target="_blank">Click Here to Submit Details</a></p>
    
    <p><strong>Note:</strong></p>
    <ol>
        <li>This form is to be filled by winners only and not by all participants. Only <strong>one student from the winning group</strong> should submit the bank account details. The total prize amount of the group will be credited to his/her bank account.</li>
        <li>The bank account should be in the name of the student and not parents/friends.</li>
        <li>Names of prize winners and Google Form details will be verified before submission to the accounts department.</li>
        <li>Please inform all participating students to keep their bank account details ready (details of one student from each group) so that after the announcement of results, the winner students can submit the details immediately.</li>
    </ol>
    
    <p><strong>Bank Account Details Required:</strong></p>
    <ul>
        <li>Name of Account Holder as per bank records</li>
        <li>Bank Account Number</li>
        <li>Type of Account (Saving/Current)</li>
        <li>Bank & Branch Address</li>
        <li>IFSC Code</li>
        <li>Scanned copy of the first page of passbook/cancelled cheque in PDF format</li>
    </ul>
    
    <p>For any queries, please contact:</p>
    <p><strong>Dr. A. R. Deshpande:</strong> <a href="tel:9860487525">9860487525</a> (Finance Committee)</p>
    <p><strong>Dr. S. B. Deshmukh:</strong> <a href="tel:7709602019">7709602019</a> (Concepts Faculty)</p>
    
    <p>Thanks & Regards,</p>
    <p><strong>InC Team 2025</strong></p>
</body>
</html>
`,
					};
					return bulkEmailTransporter.sendMail(mailOptions)
						.then(() => console.log(`Mail sent - ${item.email}`))
						.catch(err => console.error(`Error sending mail to ${item.email}:`, err));
				});

				await Promise.allSettled(allEmailPromises);
				console.log('Completed bulk batch');
			};

			for (let i = 0; i < data.length; i += BATCH_SIZE) {
				const emailArray = data.slice(i, i + BATCH_SIZE);
				console.log(`Sending batch - ${i / BATCH_SIZE}`);
				await new Promise(resolve => setTimeout(resolve, 5000 * (i / BATCH_SIZE))); 
				await executeSendMail(emailArray);
			}
		}
		catch (err) { throw err }
	}

	async function sendAllocationEmail(event_name, projects, judge, judgeCredentials) {
		try {
			// judge.slots = judge.slots.map(slot => slotsData[slot])
			// projects.forEach(project => {
			//     project.domain = projectDomains[project.domain]
			// })
			// event_name = event_name.charAt(0).toUpperCase() + event_name.slice(1)
			// const mailOptions = {
			//     from: `InC\'2024 Judging <${officialEmails.get('judging')}>`,
			//     to: `${judge.name} ${judge.email}`,
			//     cc: officialEmails.get('official'),
			//     replyTo: officialEmails.get('judging'),
			//     subject: `Updated Judging Schedule for PICT InC 2024 - ${event_name}`,
			//     priority: 'high',
			//     text: 'Email content',
			//     html: await emailTemplates.sendAllocationEmail(event_name, projects, judge, judgeCredentials)
			// }
			// return judgingEmailTransporter.sendMail(mailOptions, (err, info) => {
			//     if (err) {
			//         throw err
			//     }
			//     return info
			// })
		} catch (err) { throw err }
	}

	return {
		eventRegistrationEmail,
		judgeRegistrationEmail,
		sendAllocationEmail,
		sendBulkEmail,
	}
}

export default emailService;
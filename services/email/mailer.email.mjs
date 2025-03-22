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
						subject: "Invitation to Judge for PICT INC - Concepts",
						priority: 'high',
						text: "Email content",
						// html: await emailTemplates.sendAllocationEmail(item),
						html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to Judge - Concepts</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f8f8; margin: 0; padding: 0;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="background-color: #d4621c; padding: 20px; text-align: center; color: #ffffff; font-size: 24px; font-weight: bold;">
                Invitation to Judge - Concepts
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; color: #333333;">
                <p>Dear ${item.name},</p>
                <p>We are honored to invite you to be a judge at <strong>Concepts</strong>, The Premier Project Exhibition showcasing Innovation and Achievement.</p>
                <p>Your expertise and insights will be invaluable in evaluating the exceptional projects presented by talented participants.</p>
                <p><strong>Event Details:</strong></p>
                <ul>
                    <li><strong>Event:</strong> Concepts - Project Exhibition</li>
                    <li><strong>Date:</strong> March 22, 2025</li>
                    <li><strong>Location:</strong> PICT, Pune</li>
                </ul>
                <p>We would be delighted to have you as a judge and contribute to this exciting event.</p>
                <p style="text-align: center; margin: 20px 0;">
                    <a href="https://pictinc.org/register/judge/concepts?URLAccessCode=d492d21ae9cd3fa" 
                       style="background-color: #5F9DF7; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                        Register as a Judge
                    </a>
                </p>
                <p>If you have any questions, feel free to reach out. We look forward to your participation!</p>
                <p>Best regards,</p>
                <p><strong>PICT Inc Team</strong></p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #5F9DF7; padding: 10px; text-align: center; color: #ffffff; font-size: 14px;">
                &copy; 2025 PICT Inc. All Rights Reserved.
            </td>
        </tr>
    </table>
</body>
</html>
`
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
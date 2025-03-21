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
			user: officialEmails.get('queries'),
			pass: env.EVENTS_EMAIL_PASSWORD
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
						from: `InC 2025 <${officialEmails.get('queries')}>`,
						to: `${item.email}`,
						cc: `InC Info <${officialEmails.get('info')}>`,
						// replyTo: `InC Queries <${officialEmails.get('queries')}>`,
						subject: "Pradnya First Round Link",
						priority: 'high',
						// text: "Email content",
						text: 'Dear Participant,\nHere is the link for your first round of Pradnya:\n Junior Category:https://forms.gle/8GF3mS2hun96rtCD8 \n Senior Category:https://forms.gle/Q3bb5mvrhqpnyStj8 \n',
						// html: await emailTemplates.sendAllocationEmail(item),
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
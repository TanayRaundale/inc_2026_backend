import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';
import dotenv from 'dotenv';
import { officialEmails } from './static/adminData.mjs';

dotenv.config({ path: '.env.dev' });

const getJudgingSlots = (event_name) => {
    
	const judgingSlotsImpetus = {
        "1": "Friday, 27th March (11:00 AM - 2:00 PM)",
        "2": "Friday, 27th March (2:00 PM - 5:00 PM)",
        "3": "Friday, 27th March (5:00 PM - 7:00 PM)",
        "4": "Saturday, 28th March (9:00 AM - 12:00 PM)",
        "5": "Saturday, 28th March (1:00 PM - 3:00 PM)",
        "6": "Saturday, 28th March (4:00 PM - 6:00 PM)"
    };
    
    const judgingSlotsConcepts = {
        "1": "Friday, 27th March (11:00 AM - 2:00 PM)",
        "2": "Friday, 27th March (2:00 PM - 4:00 PM)",
        "3": "Friday, 27th March (4:00 PM - 7:00 PM)",
        "4": "Saturday, 28th March (10:00 AM - 1:00 PM)",
        "5": "Saturday, 28th March (1:00 PM - 4:00 PM)",
        "6": "Saturday, 28th March (4:00 PM - 7:00 PM)"
    };

	if(event_name === 'impetus'){
		return judgingSlotsImpetus;
	}
	else if(event_name === 'concepts'){
		return judgingSlotsConcepts;
	}
}

async function main() {
  try {

    /* ---------------- DATABASE ---------------- */
    const db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    console.log("✅ Database connected");

    /* ---------------- FETCH ALL JUDGE REGISTRATIONS ---------------- */
    const [rows] = await db.query(`
      SELECT 
        a.username AS email,
        a.password,
        j.events,
        j.slots,
        j.jid
      FROM admin a
      JOIN judges j 
        ON a.username = j.email
      WHERE JSON_CONTAINS(a.roles, '"JUDGE"')
    `);

    if (rows.length === 0) {
      console.log("❌ No judges found in database");
      await db.end();
      return;
    }

    console.log(`📊 Found ${rows.length} registration(s)`);

    /* ---------------- EMAIL TRANSPORT ---------------- */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: officialEmails.get('info'),
        pass: process.env.INFO_EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    /* ---------------- LOAD EMAIL TEMPLATE ---------------- */
    const template = fs.readFileSync(
      "D:/INC2026/Backend/inc_2026_backend/views/emails/judgeRegistration.email.ejs",
      "utf8"
    );

    /* ---------------- SEND EMAILS ---------------- */
    for (const judge of rows) {

  // Convert events
  if (typeof judge.events === "string") {
    judge.events = JSON.parse(judge.events)[0];
  } else if (Array.isArray(judge.events)) {
    judge.events = judge.events[0];
  }

  // Capitalize event
  judge.events = judge.events.charAt(0).toUpperCase() + judge.events.slice(1);

  // Convert slots JSON
  if (typeof judge.slots === "string") {
    judge.slots = JSON.parse(judge.slots);
  }

  const slotMap = getJudgingSlots(judge.events.toLowerCase());

  judge.slots = judge.slots
    .map(slot => slotMap[slot])
    .join(", ");

  console.log("📧 Preparing email for event:", judge.events);

  const html = ejs.render(template, { judge });

  await transporter.sendMail({
    from: `"PICT INC" <${officialEmails.get('info')}>`,
    to: judge.email,
    subject: `Registered for PICT InC 2026 Judging - ${judge.events}`,
    html
  });

  console.log(`✅ Email sent to: ${judge.email} for event: ${judge.events}`);

  fs.appendFileSync(
  "sent_emails.txt",
  `${judge.email} | ${judge.events} | ${new Date().toISOString()}\n`
);

// await new Promise(resolve => setTimeout(resolve, 1500));

}
    await db.end();
    console.log("🎉 All emails sent successfully");

  } catch (err) {
    console.error("❌ Error:", err.message || err);
  }
}

main();
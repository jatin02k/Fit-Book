// lib/mail.ts
import nodemailer from "nodemailer";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string; // Add replyTo
  cc?: string;      // Add cc just in case
}

export async function sendEmail({ to, subject, html, replyTo, cc }: SendEmailParams) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const mailOptions = {
    from: `"Appointor System" <${process.env.GMAIL_USER}>`, // System keeps sending, but reply-to handles the flow
    to: to,
    cc: cc,
    replyTo: replyTo, // <--- Key change
    subject: subject,
    html: html,
  };
  return await transporter.sendMail(mailOptions);
}
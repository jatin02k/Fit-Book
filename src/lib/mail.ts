// lib/mail.ts
import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const mailOptions = {
  from: `"FitBook" <${process.env.GMAIL_USER}>`,
  to: to,
  subject: subject,
  html: html, // Ensure no JSON.stringify(html) or similar here
};
  return await transporter.sendMail(mailOptions);
}
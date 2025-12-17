import nodemailer from 'nodemailer';

// Create the transporter using Gmail's SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailPayload) => {
  try {
    const mailOptions = {
      from: `"FitBook Admin" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Nodemailer Error:", error);
    throw new Error("Failed to send email");
  }
};
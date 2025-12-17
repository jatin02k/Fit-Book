// @/lib/mail/templates/adminConfirmed.ts
import { baseLayout } from "./baseLayout";

type Props = {
  customer: string;
  email: string;
  service: string;
  date: string;
  time: string;
};

export function adminConfirmedTemplate(props: Props) {
  return baseLayout({
    title: "Booking Confirmed ✅",
    content: `
      <p>The following booking has been successfully verified and confirmed:</p>
      
      <div style="background:#ecfdf5; padding:16px; border-radius:8px; margin-top:12px; border: 1px solid #10b981;">
        <p><strong>Customer:</strong> ${props.customer}</p>
        <p><strong>Service:</strong> ${props.service}</p>
        <p><strong>Date:</strong> ${props.date}</p>
        <p><strong>Time:</strong> ${props.time}</p>
      </div>

      <p style="margin-top:16px;">
        The schedule has been updated, and the customer has been notified via email.
      </p>
    `,
  });
}
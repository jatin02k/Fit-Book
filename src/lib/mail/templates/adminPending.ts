import { baseLayout } from "./baseLayout";

type Props = {
  customer: string;
  email: string;
  phone?: string;
  service: string;
  date: string;
  time: string;
  paymentUrl: string;
};

export function adminPendingTemplate(props: Props) {
  return baseLayout({
    title: "New Pending Booking 🔴",
    content: `
      <p><strong>Customer:</strong> ${props.customer}</p>
      <p><strong>Email:</strong> ${props.email}</p>
      <p><strong>Phone:</strong> ${props.phone ?? "N/A"}</p>

      <div style="background:#f3f4f6; padding:16px; border-radius:8px; margin-top:12px;">
        <p><strong>🛎 Service:</strong> ${props.service}</p>
        <p><strong>📅 Date:</strong> ${props.date}</p>
        <p><strong>⏰ Time:</strong> ${props.time}</p>
      </div>

      <p style="margin-top:16px;">
        <a href="${props.paymentUrl}" target="_blank">💳 View Payment Screenshot</a>
      </p>
    `,
  });
}

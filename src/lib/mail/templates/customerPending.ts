import { baseLayout } from "./baseLayout";

type Props = {
  name: string;
  service: string;
  date: string;
  time: string;
};

export function customerPendingTemplate({
  name,
  service,
  date,
  time,
}: Props) {
  return baseLayout({
    title: "Appointment Request Received ⏳",
    content: `
      <p>Hi <strong>${name}</strong>,</p>

      <p>Your appointment request has been received and is pending verification.</p>

      <div style="background:#f3f4f6; padding:16px; border-radius:8px;">
        <p><strong>🛎 Service:</strong> ${service}</p>
        <p><strong>📅 Date:</strong> ${date}</p>
        <p><strong>⏰ Time:</strong> ${time}</p>
      </div>

      <p style="margin-top:16px;">
        We’ll notify you once it’s confirmed.
      </p>
    `,
  });
}

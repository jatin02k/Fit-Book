import { baseLayout } from "./baseLayout";

type Props = {
  name: string;
  service: string;
  date: string;
  time: string;
};

export function customerConfirmedTemplate({
  name,
  service,
  date,
  time,
}: Props) {
  return baseLayout({
    title: "Appointment Confirmed ✅",
    content: `
      <p>Hi <strong>${name}</strong>,</p>

      <p>Your booking is <strong>confirmed</strong>. We’re excited to see you!</p>

      <div style="background:#ecfeff; padding:16px; border-radius:8px;">
        <p><strong>🛎 Service:</strong> ${service}</p>
        <p><strong>📅 Date:</strong> ${date}</p>
        <p><strong>⏰ Time:</strong> ${time}</p>
      </div>

      <ul style="margin-top:16px;">
        <li>Please arrive 5–10 minutes early</li>
        <li>Bring any required items</li>
      </ul>

      <p>See you soon! 👋</p>
    `,
  });
}

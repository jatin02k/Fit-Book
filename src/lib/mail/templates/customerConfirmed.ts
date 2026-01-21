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
  cancellationLink,
}: Props & { cancellationLink: string }) {
  return baseLayout({
    title: "Appointment Confirmed",
    themeColor: "#10b981", // Emerald-500
    infoBoxColor: "#ecfdf5", // Emerald-50
    infoBoxBorderColor: "#6ee7b7", // Emerald-300
    content: `
      <p class="subtitle">Hi ${name},<br>Your appointment has been successfully confirmed. We look forward to seeing you.</p>

      <div class="info-box">
        <div class="info-row">
          <span class="label">Service:</span> <span class="value">${service}</span>
        </div>
        <div class="info-row">
          <span class="label">Date:</span> <span class="value">${date}</span>
        </div>
        <div class="info-row">
          <span class="label">Time:</span> <span class="value">${time}</span>
        </div>
      </div>

      <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 24px;">
        Please arrive 5 to 10 minutes early.
      </p>

      <div class="btn-container">
        <a href="${cancellationLink}" style="color: #ef4444; font-size: 14px;">Cancel Appointment</a>
      </div>
    `,
  });
}

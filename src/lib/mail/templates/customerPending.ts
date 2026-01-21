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
    title: "Appointment Pending",
    themeColor: "#f59e0b", // Amber-500
    infoBoxColor: "#fffbeb", // Amber-50
    infoBoxBorderColor: "#fcd34d", // Amber-300
    content: `
      <p class="subtitle">Hi ${name},<br>Your appointment status is currently pending. We will notify you once verified.</p>

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
    `,
  });
}

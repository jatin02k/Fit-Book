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
    title: "New Booking Confirmed",
    themeColor: "#3b82f6", // Blue-500
    infoBoxColor: "#eff6ff", // Blue-50
    infoBoxBorderColor: "#93c5fd", // Blue-300
    content: `
      <p class="subtitle">A new appointment has been confirmed and added to your schedule.</p>
      
      <div class="info-box">
        <div class="info-row">
          <span class="label">Customer:</span> <span class="value">${props.customer}</span>
        </div>
        <div class="info-row">
          <span class="label">Service:</span> <span class="value">${props.service}</span>
        </div>
        <div class="info-row">
          <span class="label">Date:</span> <span class="value">${props.date}</span>
        </div>
        <div class="info-row">
          <span class="label">Time:</span> <span class="value">${props.time}</span>
        </div>
        <div class="info-row">
            <span class="label">Email:</span> <span class="value">${props.email}</span>
        </div>
      </div>
    `,
  });
}
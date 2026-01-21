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
    title: "New Pending Request",
    themeColor: "#f97316", // Orange-500
    infoBoxColor: "#fff7ed", // Orange-50
    infoBoxBorderColor: "#fdba74", // Orange-300
    content: `
      <p class="subtitle">You have a new appointment request pending approval.</p>

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
          <span class="label">Phone:</span> <span class="value">${props.phone ?? "N/A"}</span>
        </div>
      </div>
      
       ${props.paymentUrl ? `
        <div class="btn-container">
            <a href="${props.paymentUrl}" class="button" target="_blank">View Payment Screenshot</a>
        </div>
       ` : ''}
    `,
  });
}

export const dynamic = "force-dynamic";

import { CalendarComponent } from "@/app/components/calendarComponent";

export interface Appointment {
  id: string;
  start: string;
  end: string;
  customerName: string;
  serviceName: string;
  serviceDuration: number;
  cancellationLink: string;
  status: "pending" | "confirmed" | "upcoming";
}

export default async function AdminDashboardPage() {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` // Vercel's dynamic URL
    : 'http://localhost:3000'; // Fallback for local dev

  const apiUrl = `${baseUrl}/api/admin/bookings`;

  let appointments: Appointment[] = [];
  try {
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(
        data.error || "Failed to fetch appointments. Check API or Auth status."
      );
    }

    appointments = await res.json();
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "An unknown error occurred";
    throw new Error(`API Fetch Error: ${errorMessage}`);
  }
  return <CalendarComponent appointments={appointments} />;
}

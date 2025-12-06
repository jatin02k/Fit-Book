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
  const isLocal = process.env.NODE_ENV === 'development';
  const baseUrl = isLocal ? 'http://localhost:3000' : '';
  
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
    if (!Array.isArray(appointments)) {
    throw new Error("API returned invalid data format. Expected an array.");
}
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "An unknown error occurred";
    console.log(`API Fetch Error: ${errorMessage}`);
  }
  return <CalendarComponent appointments={appointments} />;
}

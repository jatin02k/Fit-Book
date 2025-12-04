import { CalendarComponent } from "@/app/(public)/components/calendarComponent";

export interface Appointment {
  id: string;
  start: string;
  end: string;
  customerName: string;
  serviceName: string;
  serviceDuration: number;
  cancellationLink: string;
  status: 'pending' | 'confirmed' | 'upcoming';
}

export default async function AdminDashboardPage() {

  // const apiUrl = `${
  //   process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000"
  // }/api/admin/bookings`;

  let appointments: Appointment[] = [];
  let error: string | null = null;

  try {
    const res = await fetch("http://localhost:3000/api/admin/bookings", { cache: "no-store" });

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
    error = errorMessage;
  }
  return (
    <CalendarComponent appointments={appointments} />
  );
}

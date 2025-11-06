import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  try {
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select(`*,services (name, duration_minutes, price)`)
      .gte("start_time", format(new Date(), "yyyy-MM-dd"))
      .order("start_time", { ascending: true });

    if (error) {
      console.error("data Eetch error for Admin Booking.", error);
      return NextResponse.json(
        { error: "Failed to retrieve appointments from database." },
        { status: 500 }
      );
    }
    const formattedAppointments = appointments.map((appt) => ({
      id: appt.id,
      start: appt.start_time,
      end: appt.end_time,
      customerName: appt.customer_name,
      serviceName: appt.services?.name || "Unknown Service",
      serviceDuration: appt.services?.duration_minutes,
      cancellationLink: `/admin/cancel/${appt.cancellation_link_uuid}`,
      
    }));
    return NextResponse.json(formattedAppointments, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error in Admin Bookings API:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

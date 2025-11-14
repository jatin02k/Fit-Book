import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(`*, services (name, duration_minutes, price)`)
    .order("start_time", { ascending: true });

  console.log('appointments here:',appointments)
  if (error) {
    console.error("SUPABASE FETCH ERROR:", error);
    return NextResponse.json({ error: "Failed to retrieve appointments." }, { status: 500 });
  }

  const formatted = appointments.map((appt) => ({
    id: appt.id,
    start: appt.start_time,
    end: appt.end_time,
    customerName: appt.customer_name,
    serviceName: appt.services?.name ?? "Unknown Service",
    serviceDuration: appt.services?.duration_minutes,
    status: appt.status, 
    cancellationLink: `/admin/cancel/${appt.cancellation_link_uuid}`,
  }));

  return NextResponse.json(formatted);
}

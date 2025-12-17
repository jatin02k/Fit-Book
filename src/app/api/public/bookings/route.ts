import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import * as crypto from "crypto";
import { bookingSchema } from "@/lib/validation/bookingSchema";
import { sendEmail } from "@/lib/mail";

const BUFFER_MINUTES = 15;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    // 1. Get Service Duration
    const { data: service } = await supabase
      .from("services")
      .select("duration_minutes")
      .eq("id", validatedData.serviceId)
      .single();

    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    // 2. Calculate Times
    const start = new Date(validatedData.startTime);
    const end = new Date(start.getTime() + (service.duration_minutes + BUFFER_MINUTES) * 60000);

    // 3. Simple Conflict Check
    const { data: conflicts } = await supabase
      .from("appointments")
      .select("id")
      .filter("start_time", "lt", end.toISOString())
      .filter("end_time", "gt", start.toISOString());

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: "Slot already taken" }, { status: 409 });
    }

    // 4. Insert Appointment
    const cancellationUuid = crypto.randomUUID();
    const { data: booking, error: insertError } = await supabase
      .from("appointments")
      .insert([{
        service_id: validatedData.serviceId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        customer_name: validatedData.name,
        email: validatedData.email,
        phone_number: validatedData.phoneNo,
        payment_url: validatedData.paymentProofUrl,
        cancellation_link_uuid: cancellationUuid,
        status: "pending"
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    // 5. Async Email (Don't await if you want max speed, or await for reliability)
    await sendEmail({
        to: validatedData.email,
        subject: "Booking Received",
        html: `<p>We are reviewing your payment.</p>`
    });

    return NextResponse.json({ cancellationLinkUuid: cancellationUuid }, { status: 201 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}

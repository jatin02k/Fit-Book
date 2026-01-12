import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import * as crypto from "crypto";
import { bookingSchema } from "@/lib/validation/bookingSchema";
import { sendEmail } from "@/lib/mail";
import { customerPendingTemplate } from "@/lib/mail/templates/customerPending";
import { adminPendingTemplate } from "@/lib/mail/templates/adminPending";

const BUFFER_MINUTES = 15;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    // 1. Get Service Duration & Organization ID
    const { data: service } = await supabase
      .from("services")
      .select("*, organizations(id, name, email)") // Fetch nested Organization
      .eq("id", validatedData.serviceId)
      .single();

    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    // 2. Calculate Times
    const start = new Date(validatedData.startTime);
    const end = new Date(start.getTime() + (service.duration_minutes + BUFFER_MINUTES) * 60000);
    const dateStr = start.toLocaleDateString('en-IN');
    const timeStr = start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // 3. Simple Conflict Check (Scoped to Organization)
    const { data: conflicts } = await supabase
      .from("appointments")
      .select("id")
      .eq("organization_id", service.organizations.id) 
      .filter("start_time", "lt", end.toISOString())
      .filter("end_time", "gt", start.toISOString());

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: "Slot already taken" }, { status: 409 });
    }

    // 4. Insert Appointment
    const cancellationUuid = crypto.randomUUID();
    const { error: insertError } = await supabase
      .from("appointments")
      .insert([{
        service_id: validatedData.serviceId,
        organization_id: service.organizations.id, // <--- UPDATED: Accessing from joined table
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        customer_name: validatedData.name,
        email: validatedData.email,
        phone_number: validatedData.phoneNo,
        payment_url: validatedData.paymentProofUrl,
        cancellation_link_uuid: cancellationUuid,
        status: "pending",
        reminder_sent: false,
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    // e. SEND BOTH EMAILS SIMULTANEOUSLY
try {
  const customerHtml = customerPendingTemplate({
          name: validatedData.name,
          service: service.name,
          date: dateStr,
          time: timeStr,
        })


      // Render Admin HTML
      const adminHtml = adminPendingTemplate({
          customer: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phoneNo || "Not provided",
          service: service.name,
          date: dateStr,
          time: timeStr,
          paymentUrl: validatedData.paymentProofUrl, // The public URL from Supabase storage
        })

  const emailPromises = [];

  // 1. Send to Customer
  emailPromises.push(sendEmail({
    to: validatedData.email,
    subject: `⏳ Appointment Request Received — ${service.organizations.name}`,
    html: customerHtml,
    replyTo: service.organizations.email || undefined,
  }));

  // 2. Send to Admin (if email exists)
  if (service.organizations.email) {
    emailPromises.push(sendEmail({
      to: service.organizations.email,
      subject: `🔴 New Booking: ${validatedData.name} — ${service.name}`,
      html: adminHtml,
      replyTo: validatedData.email,
    }));
  } else {
    console.warn(`Organization ${service.organizations.id} has no email, skipping admin notification.`);
  }

  await Promise.all(emailPromises);
} catch (emailError) {
  console.error("Email sending failed:", emailError);
}

    return NextResponse.json({ cancellationLinkUuid: cancellationUuid }, { status: 201 });

  } catch (error:unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Internal Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

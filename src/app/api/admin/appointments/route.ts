import { fetchAdminBookings } from "@/lib/fetchAdminBookings";
import { sendEmail } from "@/lib/mail";
import { adminConfirmedTemplate } from "@/lib/mail/templates/adminConfirmed";
import { customerConfirmedTemplate } from "@/lib/mail/templates/customerConfirmed";
import { createClient } from "@/lib/supabase/server";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const appointments = await fetchAdminBookings();
        
        // Return the data with a 200 OK status
        return NextResponse.json(appointments, { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        // Return an error response
        return NextResponse.json(
            { message: "Failed to fetch appointments.", error: error instanceof Error ? error.message : "An unknown error occurred." }, 
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    const supabase = await createClient();
  const { id, status } = await request.json();

  const { data: appointment, error: updateError } = await supabase
      .from("appointments")
      .update({ status, payment_url: "",reminder_sent:false })
      .eq("id", id)
      .select("*, services(name)") // Join with services to get the name for the email
      .single();

    if (updateError || !appointment) {
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
    if (status === "confirmed") {
    try {
      const start = new Date(appointment.start_time);
      const dateStr = start.toLocaleDateString('en-IN');
      const timeStr = start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      // 1. Render both templates to HTML strings
      const customerHtml =customerConfirmedTemplate({
          name: appointment.customer_name,
          service: appointment.services.name,
          date: dateStr,
          time: timeStr,
        })

      const adminHtml = adminConfirmedTemplate({
          customer: appointment.customer_name,
          email: appointment.email,
          service: appointment.services.name,
          date: dateStr,
          time: timeStr,
        })


      // 2. Send both emails simultaneously
  await Promise.all([
    sendEmail({
      to: appointment.email,
      subject: "✅ Appointment Confirmed - Appointor",
      html: customerHtml,
    }),
    sendEmail({
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL!,
      subject: `✅ BOOKING CONFIRMED: ${appointment.customer_name}`,
      html: adminHtml,
    })
  ]);

    } catch (emailError) {
      console.error("Confirmation emails failed:", emailError);
    }
  }
    return NextResponse.json({ message: "Status updated successfully" });
}

export async function DELETE(request:Request) {
    const supabase = await createClient();
    const { id } = await request.json()
    const { error: apptError } = await supabase
        .from('appointments')
        .delete()
        .eq('id',id );

    if (apptError) {
        console.error('Error deleting related appointments:', apptError);
        return NextResponse.json({ error: `Failed to clear appointments: ${apptError.message}` }, { status: 500 });
    }
    return new Response(null,{status:204});
}
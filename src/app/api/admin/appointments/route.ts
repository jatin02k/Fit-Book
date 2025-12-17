

import { fetchAdminBookings } from "@/lib/fetchAdminBookings";
import { sendEmail } from "@/lib/mail";
import { createClient } from "@/lib/supabase/server";
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
      .update({ status })
      .eq("id", id)
      .select("*, services(name)") // Join with services to get the name for the email
      .single();

    if (updateError || !appointment) {
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
    if (status === "confirmed") {
      try {
  const customerEmailPromise = sendEmail({
    to: appointment.email, // Customer email
    subject: "✅ Appointment Confirmed - FitBook",
    html: `
            <h1>Your Booking is Confirmed!</h1>
            <p>Hi ${appointment.customer_name},</p>
            <p>Your session for <strong>${appointment.services.name}</strong> is now confirmed.</p>
            <p><strong>Time:</strong> ${new Date(appointment.start_time).toLocaleString()}</p>
            <br/>
            <p>See you there!</p>
          `,
  });

  const adminEmailPromise = sendEmail({
    to: process.env.NEXT_PUBLIC_ADMIN_EMAIL!, // Your admin email
    subject: `✅ NEW BOOKING CONFIRMED: ${appointment.customer_name}`,
    html: `<p>A new booking came in from ${appointment.customer_name} has been confirmed.</p>`,
    // Add your payment screenshot attachment here if needed
  });

  // Await both emails to ensure they are both sent
  await Promise.all([customerEmailPromise, adminEmailPromise]);

} catch (emailError) {
  console.error("One or more emails failed to send:", emailError);
}
      try {
        await sendEmail({
          to: appointment.email,
          subject: "✅ Appointment Confirmed - FitBook",
          html: `
            <h1>Your Booking is Confirmed!</h1>
            <p>Hi ${appointment.customer_name},</p>
            <p>Your session for <strong>${appointment.services.name}</strong> is now confirmed.</p>
            <p><strong>Time:</strong> ${new Date(appointment.start_time).toLocaleString()}</p>
            <br/>
            <p>See you there!</p>
          `,
        });
      } catch (mailError) {
        console.error("Mail Delivery Failed:", mailError);
        // We don't return error here because the DB update was successful
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
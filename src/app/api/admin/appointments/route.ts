

import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export interface RawBookingData {
    id: string;
    start_time: string;
    end_time: string;
    customer_name: string;
    email:string;
    phone_number:string;
    service_id: string;
    cancellation_link_uuid: string;
    status: string;
    services: {
        name: string;
        duration_minutes: number;
    } | null;
}

export interface AppointmentList{
  id: string;
  start_time: string;
  end_time: string;
  customerName: string;
  email:string;
  phone_number:string;
  service_id: string;
  cancellation_link_uuid: string;
  status: 'pending' | 'confirmed' | 'upcoming' | 'canceled' | 'completed';
  serviceName:string,
  serviceDuration:string
}
export async function fetchAdminBookings():Promise<AppointmentList[]>{
    const supabase = await createClient();
    const today = new Date();
    const nextSevenDays = new Date();
    nextSevenDays.setDate(today.getDate() + 7);

    // Using 'Z' for explicit UTC interpretation to match timestamptz
    const dateStart = format(today, "yyyy-MM-dd'T'00:00:00.000");
    const dateEnd = format(nextSevenDays, "yyyy-MM-dd'T'23:59:59.000");

    const { data: bookings, error } = await supabase
        .from('appointments')
        .select(`
           *,
           services(name, duration_minutes)
        `)
        // .gte('start_time', dateStart)
        // .lte('start_time', dateEnd)
        .order('start_time', { ascending: true });
        
    if (error) {
        console.error('Error fetching bookings:', error);
        // In a real application, you might throw an error or handle it more gracefully
        return []; 
    }
    const appointmentsList: AppointmentList[] = bookings.map((booking: RawBookingData) => ({
        id: booking.id,
        start_time: booking.start_time,
        end_time: booking.end_time,
        customerName: booking.customer_name,
        email: booking.email,
        phone_number: booking.phone_number,
        service_id: booking.service_id,
        cancellation_link_uuid: booking.cancellation_link_uuid,
        status: (booking.status as AppointmentList['status']) || 'pending',
        serviceName: booking.services?.name || 'Unknown Service',
        serviceDuration: String(booking.services?.duration_minutes || 0),
    }));

    return appointmentsList;
}
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
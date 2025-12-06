import { createClient } from "./supabase/server";

export async function fetchBookedSlots(serviceId: string, dateStr: string) {
    "use server";
    const supabase = await createClient();

    const dateStart = `${dateStr}T00:00:00.000`;
    const dateEnd = `${dateStr}T23:59:59.000`;
    
    const { data: appointments, error } = await supabase
        .from('appointments')
        .select('start_time, end_time') 
        .eq('service_id', serviceId)
        .gte('start_time', dateStart) 
        .lte('start_time', dateEnd);  

    if (error) {
        console.error("Database error fetching booked slots:", error);
        throw new Error("Failed to retrieve booked times.");
    }
    
    return appointments.map(apt => ({
        startTime: apt.start_time,
        endTime: apt.end_time,
    }));
}
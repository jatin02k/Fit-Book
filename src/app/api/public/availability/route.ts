import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface TimeSlot {
    time: string;
    isAvailable: boolean;
}

const BUFFER_MINUTES = 15;

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const serviceId = searchParams.get("serviceId");
  const dateString = searchParams.get("date");

  if (!serviceId || !dateString) {
    return NextResponse.json({ error: "Missing params." }, { status: 400 });
  }

  const targetDate = new Date(dateString);
  if (isNaN(targetDate.getTime())) {
    return NextResponse.json({ error: "Invalid Date." }, { status: 400 });
  }
  const dayOfWeek = targetDate.getDay();

  try {
    // 1. Fetch Service AND its Organization ID
    // CRITICAL FIX: We need organization_id to know WHICH gym's hours to check
    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .select("duration_minutes, organization_id")
      .eq("id", serviceId)
      .single(); 

    if (!serviceData || serviceError) {
      return NextResponse.json({ error: "Service Not Found." }, { status: 404 });
    }

    const { duration_minutes, organization_id } = serviceData;
    const slotDuration = duration_minutes + BUFFER_MINUTES; 
    const slotDurationMs = slotDuration * 60 * 1000;


    // 2. Fetch Business Hours for THIS Organization
    // CRITICAL FIX: Added .eq('organization_id', organization_id)
    const { data: hoursData, error: hoursError } = await supabase
      .from("business_hours")
      .select("open_time, close_time")
      .eq("day_of_week", dayOfWeek)
      .eq("organization_id", organization_id) 
      .single();

    if (!hoursData || hoursError) {
      // Gym is closed today
      return NextResponse.json({ fullTimeBlock: [] }, { status: 200 });
    }

    // 3. Fetch Appointments for the SAME Organization (Safe side)
    const startOfDayObject = new Date(dateString);
    startOfDayObject.setHours(0, 0, 0, 0);
    const startOfDay = startOfDayObject.toISOString();

    const endOfDayObject = new Date(dateString);
    endOfDayObject.setHours(23, 59, 59, 999);
    const endOfDay = endOfDayObject.toISOString();

    // CRITICAL FIX: Added .eq('organization_id', organization_id)
    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select("start_time, end_time")
      .eq("organization_id", organization_id) 
      .or(`and(start_time.lt.${endOfDay},end_time.gt.${startOfDay})`);

    if (appointmentsError) {
      return NextResponse.json({ error: "Database Error." }, { status: 500 });
    }

    // --- Time Calculation Logic (Same as before) ---
    const createDateTime = (timeString: string): Date => {
      return new Date(`${dateString}T${timeString}`);
    };
    
    const businessOpen = createDateTime(hoursData.open_time);
    const businessClose = createDateTime(hoursData.close_time);

    const bookedSlots = appointments.map((appt) => ({
        start: new Date(appt.start_time),
        end: new Date(appt.end_time),
    }));

    const fullTimeBlock: TimeSlot[] = [];
    let currentTime = businessOpen;
    const now = new Date(); 

    while (currentTime.getTime() + slotDurationMs <= businessClose.getTime()) {
      const potentialSlotStart = new Date(currentTime);
      const potentialSlotEnd = new Date(potentialSlotStart.getTime() + slotDurationMs);
      
      let isConflict = false;
      
      if (potentialSlotStart.getTime() < now.getTime()) {
          isConflict = true; 
      }
      
      if (!isConflict) {
        for (const booked of bookedSlots) {
          if (
            potentialSlotStart.getTime() < booked.end.getTime() &&
            potentialSlotEnd.getTime() > booked.start.getTime()
          ) {
            isConflict = true;
            break;
          }
        }
      }
      
      fullTimeBlock.push({
          time: potentialSlotStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          isAvailable: !isConflict,
      });

      currentTime = potentialSlotEnd; 
    }
    
    return NextResponse.json({ fullTimeBlock }, { status: 200 });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server Error." }, { status: 500 });
  }
}
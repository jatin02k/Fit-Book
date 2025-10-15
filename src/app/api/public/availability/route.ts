import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Define the type for the new API response structure
interface TimeSlot {
    time: string; // e.g., "09:00 AM"
    isAvailable: boolean;
}

const BUFFER_MINUTES = 15;

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const serviceId = searchParams.get("serviceId");
  const dateString = searchParams.get("date");

  if (!serviceId || !dateString) {
    return NextResponse.json(
      { error: "Missing req paramets. serviceId and date" },
      { status: 400 }
    );
  }

  // Convert inputs from string to object and get dayOfWeek
  const targetDate = new Date(dateString);
  if (isNaN(targetDate.getTime())) {
    return NextResponse.json(
      { error: "Invalid Date format. Use: YYYY-MM-DD" },
      { status: 400 }
    );
  }
  const dayOfWeek = targetDate.getDay();

  // --- Fetching Data ---
  try {
    // a. fetch service duration from service table
    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .select("duration_minutes")
      .eq("id", serviceId)
      .single(); 

    if (!serviceData || serviceError) {
      // Return 404 if service ID is invalid
      return NextResponse.json(
        { error: "Service Not Found or Database Error." },
        { status: 404 }
      );
    }

    const serviceDuration = serviceData.duration_minutes;
    // The total time block consumed by a single service booking
    const slotDuration = serviceDuration + BUFFER_MINUTES; 
    const slotDurationMs = slotDuration * 60 * 1000;


    // b. fetch business Hours from business_hours table
    const { data: hoursData, error: hoursError } = await supabase
      .from("business_hours")
      .select("open_time, close_time")
      .eq("day_of_week", dayOfWeek)
      .single();

    if (!hoursData || hoursError) {
      // Business closed on this day.
      return NextResponse.json({ fullTimeBlock: [] }, { status: 200 });
    }

    // c. fetch existing booking from appointments table
    const startOfDayObject = new Date(dateString);
    startOfDayObject.setHours(0, 0, 0, 0);
    const startOfDay = startOfDayObject.toISOString();

    const endOfDayObject = new Date(dateString);
    endOfDayObject.setHours(23, 59, 59, 999);
    const endOfDay = endOfDayObject.toISOString();

    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select("start_time, end_time")
      .or(`and(start_time.lt.${endOfDay},end_time.gt.${startOfDay})`);

    if (appointmentsError) {
      return NextResponse.json(
        { error: "Error checking existing appointments." },
        { status: 500 }
      );
    }

    // --- Time Calculation (CRUX LOGIC) ---
    
    const createDateTime = (timeString: string): Date => {
      return new Date(`${dateString}T${timeString}`);
    };
    
    const businessOpen = createDateTime(hoursData.open_time);
    const businessClose = createDateTime(hoursData.close_time);

    const bookedSlots: { start: Date; end: Date }[] = appointments.map(
      (appt) => ({
        start: new Date(appt.start_time),
        end: new Date(appt.end_time),
      })
    );

    // 💡 NEW OUTPUT ARRAY: Will hold all slots (available and unavailable)
    const fullTimeBlock: TimeSlot[] = [];
    
    // 💡 Logic Correction: Iterate through every potential slot at a fixed interval
    let currentTime = businessOpen;
    const now = new Date(); // Current time for "past slot" check

    while (currentTime.getTime() + slotDurationMs <= businessClose.getTime()) {
      const potentialSlotStart = new Date(currentTime); // Use a copy
      const potentialSlotEnd = new Date(
        potentialSlotStart.getTime() + slotDurationMs
      );
      
      let isConflict = false;
      
      // 1. Check if the slot is in the past
      if (potentialSlotStart.getTime() < now.getTime()) {
          isConflict = true; // Treat past slots as unavailable
      }
      
      // 2. Conflict Check against existing bookings
      if (!isConflict) {
        for (const booked of bookedSlots) {
          // Conflict if the new slot overlaps with the booked slot
          if (
            potentialSlotStart.getTime() < booked.end.getTime() &&
            potentialSlotEnd.getTime() > booked.start.getTime()
          ) {
            isConflict = true;
            break;
          }
        }
      }
      
      // 3. Store the slot status in the new array
      const timeString = potentialSlotStart.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
      });

      fullTimeBlock.push({
          time: timeString,
          isAvailable: !isConflict,
      });

      // Move to the next potential start time by the full slot duration
      currentTime = potentialSlotEnd; 
    }
    
    // 5. Return the result
    // 💡 CHANGE: Return the fullTimeBlock instead of just availableSlots
    return NextResponse.json({ fullTimeBlock }, { status: 200 });
    
  } catch (error) {
    console.log("Internal Server Error in Crux Logic:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
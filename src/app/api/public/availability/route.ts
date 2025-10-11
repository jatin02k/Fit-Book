import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const BUFFER_MINUTES = 15;

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  //get inputs ( serviceId and date )
  const serviceId = searchParams.get("serviceId");
  const dateString = searchParams.get("date");

  // validate inputs available or not
  if (!serviceId || !dateString) {
    return NextResponse.json(
      { error: "Missing req paramets. serviceId and date" },
      { status: 400 }
    );
  }

  //convert inputs from string to object and get dayOfWeek
  const targetDate = new Date(dateString);
  if (isNaN(targetDate.getTime())) {
    return NextResponse.json(
      { error: "Invalid Date format. Use: YYYY-MM-DD" },
      { status: 400 }
    );
  }
  const dayOfWeek = targetDate.getDay();

  // logic to define and fetch service duration, slots_duration , business_hours and existing Bookings.
  try {
    // a. fetch service duration from service table
    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .select("duration_minutes")
      .eq("id", serviceId)
      .single(); // Use single() because we expect one result.

    // error handling. If service not found, stop here.
    if (!serviceData || serviceError) {
      return NextResponse.json(
        { error: "Service Not Found or Database Error." },
        { status: 404 }
      );
    }

    //Incase service data is found. calculate service and slot duration.
    const serviceDuration = serviceData.duration_minutes; //original serive time only
    const slotDuration = serviceDuration + BUFFER_MINUTES; //total slot time

    // b. fetch business Hours from business_hours table
    const { data: hoursData, error: hoursError } = await supabase
      .from("business_hours")
      .select("open_time, close_time")
      .eq("day_of_week", dayOfWeek) // Match the numerical day (e.g., 1 for Monday)
      .single();

    if (!hoursData || hoursError) {
      //businees closed on this day
      return NextResponse.json({ availableSlots: [] }, { status: 404 });
    }

    // c. fetch existing booking from appointments table
    // define 24-hr window for database query
    // Corrected (Safer) Date Handling:
    const startOfDayObject = new Date(dateString); // Clone
    startOfDayObject.setHours(0, 0, 0, 0);
    const startOfDay = startOfDayObject.toISOString();

    const endOfDayObject = new Date(dateString); // Clone
    endOfDayObject.setHours(23, 59, 59, 999);
    const endOfDay = endOfDayObject.toISOString();

    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select("start_time, end_time")
      .gte("start_time", startOfDay)
      .lte("end_time", endOfDay);

    if (appointmentsError) {
      return NextResponse.json(
        { error: "Error checking existing appointments." },
        { status: 500 }
      );
    }

    //... (after fetching data) ...
    // Helper to combine date  string (YYYY-MM-DD) and time string (HH:MM:SS) into a single Date object
    const createDateTime = (timeString: string): Date => {
      return new Date(`${dateString}T${timeString}`);
    };
    const businessOpen = createDateTime(hoursData.open_time);
    const businessClose = createDateTime(hoursData.close_time);

    //convert raw booking data into objects for easier manuplation
    const bookedSlots: { start: Date; end: Date }[] = appointments.map(
      (appt) => ({
        start: new Date(appt.start_time),
        end: new Date(appt.end_time),
      })
    );

    const availableSlots: string[] = [];
    let currentTime = businessOpen;
    // The loop continues as long as a full slot fits before the business closing time.
    // slotDuration * 60 * 1000 converts minutes to milliseconds.
    const slotDurationMs = slotDuration * 60 * 1000;
    while (currentTime.getTime() + slotDurationMs <= businessClose.getTime()) {
      const potentialSlotStart = currentTime;
      const potentialSlotEnd = new Date(
        potentialSlotStart.getTime() + slotDurationMs
      );
      let isConflict = false;
      for (const booked of bookedSlots) {
        if (
          potentialSlotStart.getTime() < booked.end.getTime() &&
          potentialSlotEnd.getTime() > booked.start.getTime()
        ) {
          isConflict = true;
          // If conflict found, jump the current time past the booked slot to continue searching
          currentTime = booked.end;
          break;
        }
      }
      if (!isConflict) {
        // If no conflict, add the start time to the list (format as HH:MM)
        const hours = potentialSlotStart.getHours().toString().padStart(2, "0");
        const minutes = potentialSlotStart
          .getMinutes()
          .toString()
          .padStart(2, "0");
        availableSlots.push(`${hours}:${minutes}`);

        // Move to the start of the next potential slot (the end of the current one)
        currentTime = potentialSlotEnd;
      }
    }
    // 5. Return the result
    return NextResponse.json({ availableSlots }, { status: 200 });
  } catch (error) {
    console.log("Internal Server Error in Crux Logic:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

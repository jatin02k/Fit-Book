import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import * as crypto from "crypto";
import { ZodError } from "zod";
import { bookingSchema } from "@/lib/validation/bookingSchema";

const BUFFER_MINUTES = 15;

export async function POST(request: Request) {
  const supabase = await createClient();

  // 1. INPUT VALIDATION & PARSING (STEP 1)
  const body = await request.json();
  let validatedData;
  try {
    validatedData = bookingSchema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Zod Validation Error:", error.issues);
      // Return a 400 Bad Request with specific error details from Zod
      return NextResponse.json(
        {
          error: "Validation failed.",
          details: error.issues.map((issue) => ({
            path: issue.path[0],
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }
    console.log("Bad request in booking api:", error);
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  //database and logic operations

  try {
    // a. Fetch service duration (using the clean, validated serviceId)
    const { serviceId, startTime, name, email, phoneNo } = validatedData;
    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .select("duration_minutes")
      .eq("id", serviceId)
      .single();

    if (!serviceData || serviceError) {
      return NextResponse.json(
        { error: "Service Not Found or Database Error." },
        { status: 404 }
      );
    }
    // b. Calculate the End Time using the validated startTime (Date object math)
    const serviceDuration = serviceData.duration_minutes;
    const slotDuration = serviceDuration + BUFFER_MINUTES;
    const slotDurationMs = slotDuration * 60 * 1000;
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime.getTime() + slotDurationMs);

    //c. race condition
    const { data: conflicts } = await supabase
      .from("appointments")
      .select("id")
      .or(
        `and(start_time.lt.${endDateTime.toISOString()},end_time.gt.${startDateTime.toISOString()})`
      );

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        {
          error:
            "The selected time slot was just booked. Please select another slot.",
        },
        { status: 409 }
      );
    }
    //d. COMMIT THE BOOKING Cancellation(Database Write)
    const cancellationLinkUuid = crypto.randomUUID();
    const { error: insertError } = await supabase
      .from("appointments")
      .insert([
        {
          service_id: serviceId,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          customer_name: name,
          email,
          phone_number: phoneNo ?? "",
          cancellation_link_uuid: cancellationLinkUuid,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.log("Database Insert Error:", insertError);
      return NextResponse.json(
        { error: "Failed to finalize booking due to a database error." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Booking confirmed successfully!",
        cancellationLink: `/cancel/${cancellationLinkUuid}`, // Simulate the unique link (C-5)
      },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("Internal Server Error during Booking Transaction:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

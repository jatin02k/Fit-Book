import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_hours")
    .select("*")
    .order("day_of_week", { ascending: true });
  if (error) {
    console.log("Error fetching business hours:", error);
    return NextResponse.json(
      { error: "failed to fetch business hours for admin dashboard" },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const hoursData = await request.json();
  if (!Array.isArray(hoursData) || hoursData.length === 0) {
    return NextResponse.json(
      { error: "Invalid or empty hours data." },
      { status: 400 }
    );
  }
  const formattedData = hoursData.map((day) => {
    if (day.day_of_week === undefined || !day.open_time || !day.close_time) {
      throw new Error("Missing required field for a business day.");
    }
    const dayOfWeekInt = parseInt(day.day_of_week);
    if (dayOfWeekInt < 1 || dayOfWeekInt > 7) {
      throw new Error(`invalid day_of_week value:${day.day_of_week}`);
    }
    return {
      day_of_week: dayOfWeekInt,
      open_time: day.open_time, // TIME type, e.g., '08:00:00'
      close_time: day.close_time, // TIME type, e.g., '17:00:00'
    };
  });
  try {
    const { data, error } = await supabase.from('business_hours').upsert(formattedData, {onConflict:'day_of_week'}).select('*');
    if(error){
        console.error('error in saving business hours',error);
        return NextResponse.json({ error: 'Failed to save business hours' }, { status: 500 });
    }
    return NextResponse.json(data)
  } catch (validationError: unknown) {
    const message =
      validationError instanceof Error ? validationError.message : String(validationError);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

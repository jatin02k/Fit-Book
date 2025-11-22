import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// ... (GET function remains the same) ...

export async function POST(request: Request) {
  const supabase = await createClient();
  const hoursData = await request.json();
  if (!Array.isArray(hoursData) || hoursData.length === 0) {
    return NextResponse.json(
      { error: "Invalid or empty hours data." },
      { status: 400 }
    );
  }
  const formattedData = hoursData.map((day: any) => { // Added 'day: any' for safety during map
    
    // FIX 1: Ensure day.day_of_week is treated as a number initially, since the FE sends a number
    const dayOfWeekInt = Number(day.day_of_week); 

    // FIX 2: Validate the number directly
    if (dayOfWeekInt < 1 || dayOfWeekInt > 7) {
      throw new Error(`Invalid day_of_week value: ${day.day_of_week}`);
    }
    
    // FIX 3: Check for string presence, not just field existence
    if (day.open_time === undefined || day.open_time === null || day.open_time === '' || 
        day.close_time === undefined || day.close_time === null || day.close_time === '') {
         throw new Error("Missing required time fields for a business day.");
    }
    
    return {
      day_of_week: dayOfWeekInt,
      open_time: day.open_time, // This is now HH:MM:SS string from frontend
      close_time: day.close_time, 
    };
  });
  
  try {
    const { data, error } = await supabase.from('business_hours').upsert(formattedData, {onConflict:'day_of_week'}).select('*');
    if(error){
        console.error('Error in saving business hours:', error);
        // FIX 4: Add the specific Supabase error message for better debugging
        return NextResponse.json({ error: `Failed to save business hours: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json(data)
  } catch (validationError: unknown) {
    const message =
      validationError instanceof Error ? validationError.message : String(validationError);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// 1. Define the expected TypeScript structure for a single day's data
interface BusinessHourInput {
  day_of_week: number | string; // Expecting number or string from JSON body
  open_time: string;
  close_time: string;
}

// 2. Define the structure for the data we send to Supabase
interface FormattedBusinessHour {
  day_of_week: number;
  open_time: string;
  close_time: string;
  organization_id?: string;
}

// (The GET function remains the same)

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Cast request.json() to the expected type for type-safe access
  const hoursData: BusinessHourInput[] = await request.json(); 

  // Initial validation for array structure
  if (!Array.isArray(hoursData) || hoursData.length === 0) {
    return NextResponse.json(
      { error: "Invalid or empty hours data: Expected an array." },
      { status: 400 }
    );
  }

  const formattedData: FormattedBusinessHour[] = [];

  try {
    for (const day of hoursData) {
      // 3. Type-safe extraction and validation
      const dayOfWeekInt = Number(day.day_of_week); 

      // Input Validation
      if (isNaN(dayOfWeekInt) || dayOfWeekInt < 1 || dayOfWeekInt > 7) {
        throw new Error(`Invalid day_of_week value (${day.day_of_week}). Must be a number between 1 and 7.`);
      }

      if (!day.open_time || typeof day.open_time !== 'string' || 
          !day.close_time || typeof day.close_time !== 'string') {
           throw new Error(`Missing or invalid time fields for day ${dayOfWeekInt}.`);
      }
      
      // We could add more rigorous validation here (e.g., regex for HH:MM:SS format)
      
      formattedData.push({
        day_of_week: dayOfWeekInt,
        open_time: day.open_time,
        close_time: day.close_time, 
      });
    }

    // 4. Get User and Organization
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: org } = await supabase
        .from("organizations")
        .select("id, subscription_status")
        .eq("owner_id", user.id)
        .single();
    
    if (!org) {
        return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (org.subscription_status !== 'active') {
        return NextResponse.json({ error: "Subscription inactive. Please upgrade to update business hours." }, { status: 403 });
    }

    if (!org) {
        return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // 5. Supabase Upsert Operation
    // Add organization_id to each record
    const dataToUpsert = formattedData.map(item => ({
        ...item,
        organization_id: org.id
    }));

    // 5. Delete-then-Insert Strategy
    // Since we don't have a guaranteed unique constraint on (organization_id, day_of_week),
    // and we want to overwrite whatever is there for these days,
    // we first DELETE the existing records for these days for this org.
    
    const daysToUpdate = dataToUpsert.map(d => d.day_of_week);

    const { error: deleteError } = await supabase
        .from('business_hours')
        .delete()
        .eq('organization_id', org.id)
        .in('day_of_week', daysToUpdate);

    if (deleteError) {
        console.error('Error clearing old business hours:', deleteError);
         return NextResponse.json(
            { error: `Failed to update hours: ${deleteError.message}` }, 
            { status: 500 }
        );
    }

    // 6. Insert new records
    // Now we can safely insert without conflict
    const { data, error } = await supabase
      .from('business_hours')
      .insert(dataToUpsert)
      .select('*');

    if (error) {
        console.error('Error in saving business hours:', error);
        return NextResponse.json(
            { error: `Failed to save business hours: ${error.message}` }, 
            { status: 500 }
        );
    }
    
    return NextResponse.json(data);

  } catch (validationError: unknown) {
    // 5. Improved error handling for validation issues
    const message =
      validationError instanceof Error ? validationError.message : "An unknown validation error occurred.";
    
    console.error('Validation Error during hours processing:', validationError);
      
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
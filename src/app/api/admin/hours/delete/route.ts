// /src/app/api/admin/hours/delete/route.js

import { NextResponse } from 'next/server';
// Assuming createSupabaseAdmin is defined in your environment, 
// or you use the provided createClient from the user's context.
import { createClient } from '@/lib/supabase/server'; 

// --- POST (DELETE CLOSED DAYS) ---
// This endpoint receives an array of day_of_week IDs (1-7) to delete from the table.
export async function POST(request:Request) {
  const supabase = await createClient();
  // Expects an array of day_of_week integers: [1, 7]
  const { daysToDelete } = await request.json(); 

  // Basic validation
  if (!Array.isArray(daysToDelete) || daysToDelete.length === 0) {
    // If nothing to delete, return success
    return new NextResponse(null, { status: 200 });
  }
  
  // 1. Get User and Organization
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  // Ensure the IDs are numbers, as the DB expects integer IDs (1-7)
  const numericDaysToDelete = daysToDelete.map(Number);

  // Delete all rows where the day_of_week is in the provided array AND matches Org ID
  const { error } = await supabase
    .from('business_hours')
    .delete()
    .eq('organization_id', org.id) // <--- CRITICAL SECURITY FIX
    .in('day_of_week', numericDaysToDelete);

  if (error) {
    console.error('Error deleting closed business hours:', error);
    return NextResponse.json({ error: 'Failed to delete closed hours' }, { status: 500 });
  }

  // 200 OK or 204 No Content are appropriate for a successful deletion
  return new NextResponse(null, { status: 200 });
}
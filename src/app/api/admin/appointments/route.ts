

import { fetchAdminBookings } from "@/lib/fetchAdminBookings";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";



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

export async function PATCH(request: Request) {
    const supabase = await createClient();
  const { id, status } = await request.json();

  const { error } = await supabase
    .from('appointments')
    .update({ status: status })
    .eq('id', id);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  
  return new Response(null, { status: 204 });
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
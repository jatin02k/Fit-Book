import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

  // Explicitly filter by Organization ID
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("organization_id", org.id) // <--- CRITICAL
    .order("created_at", { ascending: false });

  if (error) {
     console.error("Error fetching services:", error);
    return NextResponse.json({ message: "Failed to fetch services" }, { status: 500 });
  }

  return NextResponse.json(services || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { name, duration_minutes, price, description, features } = await request.json();

  if (!name || !duration_minutes || price === undefined) {
    return NextResponse.json(
      { error: "Missing required service fields." },
      { status: 400 }
    );
  }

  // 1. Get Current User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Get User's Organization
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

  // 3. Insert Service with Organization ID
  const { data, error } = await supabase
    .from("services")
    .insert([
      {
        name,
        duration_minutes,
        price,
        description,
        features,
        organization_id: org.id, // <--- CRITICAL
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { id, name, duration_minutes, price, description, features } =
    await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "Missing required service ID for update." },
      { status: 400 }
    );
  }
  const { data, error } = await supabase
    .from("services")
    .update({ name, duration_minutes, price, description, features })
    .eq("id", id)
    .select('*')
    .single();

    if(error){
        console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
    }
    return NextResponse.json(data);
}

export async function DELETE(request:Request) {
    const supabase = await createClient();
    const { id } = await request.json()

    // 1. Delete all related appointments first
    const { error: apptError } = await supabase
        .from('appointments')
        .delete()
        .eq('service_id', id); // Assuming your foreign key column is named 'service_id'

    if (apptError) {
        console.error('Error deleting related appointments:', apptError);
        return NextResponse.json({ error: `Failed to clear appointments: ${apptError.message}` }, { status: 500 });
    }

    // 2. Now delete the service
    const { error: serviceError } = await supabase
        .from('services')
        .delete()
        .eq('id',id);

    if (serviceError) {
        console.error('Error deleting service:', serviceError);
        return NextResponse.json({ error: `Database Delete Failed: ${serviceError.message}` }, { status: 500 });
    }
    return new Response(null,{status:204});
}
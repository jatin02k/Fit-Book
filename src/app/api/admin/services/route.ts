import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .single();

  console.log("service data on dashboard", services);

  if (!services || error) {
    return NextResponse.json({ message: "Service not found" }, { status: 500 });
  }

  return NextResponse.json(services);
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

  const { data, error } = await supabase
    .from("services")
    .insert([
      {
        name,
        duration_minutes,
        price,
        description,
        features,
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
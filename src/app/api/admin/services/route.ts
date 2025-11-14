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
  const { name, duration, price, description, features } = await request.json();

  if (!name || !duration || price === undefined) {
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
        duration_minutes: duration,
        price: price,
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
  const { id, name, duration, price, description, features } =
    await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "Missing required service ID for update." },
      { status: 400 }
    );
  }
  const { data, error } = await supabase
    .from("services")
    .update({ name, duration_minutes: duration, price, description, features })
    .eq("id", id)
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
    if (!id) {
    return NextResponse.json(
      { error: "Missing required service ID for Deletion." },
      { status: 400 }
    );
  }
  const {error} = await supabase.from('services').delete().eq('id',id);
  if (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
  return NextResponse.json(null,{status:204});
}
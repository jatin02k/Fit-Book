import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Supabase Logout error", error);
      return NextResponse.json({ erro: "Failed to sign Out" }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Logged out successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout handler error:", error);
    return NextResponse.json(
      { error: "Internal Server error during logout." },
      { status: 500 }
    );
  }
}

import { createClient } from "@/lib/supabase/server";
// import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import z from "zod";
import bcrypt from "bcryptjs";

const loginSchema = z.object({
  email: z
    .email("Invalid email address.")
    .nonempty({ message: "Email is required." }),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validatedLogin = loginSchema.safeParse(body);

  if (!validatedLogin.success) {
    return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
  }

  const { email, password } = validatedLogin.data;

  const supabase = await createClient();
  try {
    const { data: adminUser, error: fetchError } = await supabase
      .from("admin")
      .select("hashed_password")
      .eq("email", email)
      .single();

    if (fetchError || !adminUser) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 }
      );
    }

    const hashedPassword = adminUser.hashed_password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Login successful.", token: "admin_token_placeholder" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ error: "Internal Server error during Login Process" }, { status: 500 });
  }
}

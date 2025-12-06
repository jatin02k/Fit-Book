import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import z from "zod";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";


const loginSchema = z.object({
  email: z
    .email("Invalid email address.")
    .nonempty({ message: "Email is required." }),
  password: z.string().nonempty({ message: "Password is required." }),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validatedLogin = loginSchema.safeParse(body);

  if (!validatedLogin.success) {
    // We avoid sending specific Zod errors for basic login security
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  const { email, password } = validatedLogin.data;

  // IMPORTANT: This uses the service client to read the protected admin table
  const supabase = await createClient(); 

  try {
    // 1. Check if the user exists and fetch the hashed password
    const { data: adminUser, error: fetchError } = await supabase
      .from("admin")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !adminUser) {
      // Return generic 401 Unauthorized to prevent revealing existing emails
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // 2. Compare the submitted password with the stored hash
    const hashedPassword = adminUser.hashed_password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: "admin" },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  // 4. Store token in a cookie
  const response = NextResponse.json({ message: "Login successful" });
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

    // 4. Success: Session cookie is now set. Middleware will permit access.
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  
  } catch (error) {
    console.error("Fatal Login Handler Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken"; // 💡 Import jsonwebtoken

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const path = req.nextUrl.pathname;

  const isLoginPage = path === "/admin/login";
  const isAdminRoot = path === "/admin";
  const isProtected = path.startsWith("/admin") && !isLoginPage && !isAdminRoot;

  // 1. If trying to access protected route, check token validity
  if (isProtected) {
    if (!token) {
      // No token found, redirect to login
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      // 2. VERIFY THE TOKEN
      // CRITICAL: process.env.JWT_SECRET must be available in Vercel env vars
      jwt.verify(token, process.env.JWT_SECRET!); 
      
      // Token is valid, allow access
      return NextResponse.next();

    } catch (err) {
      // 3. Verification FAILED (expired, tampered, wrong secret)
      console.error("JWT Verification failed in middleware:", err);
      // Redirect to login and delete the bad cookie (optional but helpful)
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("admin_token");
      return response;
    }
  }

  // If logged in and tries to access login page, redirect to dashboard
  if (isLoginPage && token) {
    // If they have a token, assume it's valid enough to redirect them away from login
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
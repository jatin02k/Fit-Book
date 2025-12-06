// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken"; // Ensure jsonwebtoken is installed

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const path = req.nextUrl.pathname;

  const isLoginPage = path === "/admin/login";
  const isProtected = path.startsWith("/admin") && !isLoginPage; 
  
  // 1. Check Protected Routes
  if (isProtected) {
    if (!token) {
      // No token found, redirect to login
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      // ⚠️ CRITICAL: VERIFY THE TOKEN BEFORE PROCEEDING
      // If the token is invalid, expired, or tampered with, this will throw an error.
      jwt.verify(token, process.env.JWT_SECRET!); 
      
      // Token is valid and non-expired, allow access
      return NextResponse.next();

    } catch (err) {
      // 2. Verification FAILED (token is bad or expired)
      console.error("JWT Verification failed in middleware:", err);
      // Redirect to login and clear the bad cookie
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("admin_token");
      return response;
    }
  }

  // 3. If logged in and tries to access login page, redirect to dashboard
  if (isLoginPage && token) {
    // If we reach this point, we assume the token is valid since it was just set, 
    // or verification will handle it on the next protected page access.
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
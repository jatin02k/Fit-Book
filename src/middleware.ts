import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken"; // Ensure this is installed: npm install jsonwebtoken

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const path = req.nextUrl.pathname;

  const isLoginPage = path === "/admin/login";
  const isProtected = path.startsWith("/admin") && !isLoginPage; // Simplify protection check

  if (isProtected) {
    if (!token) {
      // No token found, redirect to login
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      // ⚠️ CRITICAL: VERIFY THE TOKEN BEFORE PROCEEDING
      // This ensures the token is signed with your VERCEL-set JWT_SECRET
      jwt.verify(token, process.env.JWT_SECRET!); 
      
      // Token is valid, allow access
      return NextResponse.next();

    } catch (err) {
      // Verification FAILED (expired, tampered, or wrong secret used by Vercel)
      console.error("JWT Verification failed in middleware:", err);
      // Redirect to login and clear the bad cookie
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("admin_token");
      return response;
    }
  }
  
  // If logged in and tries to access login page, redirect to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
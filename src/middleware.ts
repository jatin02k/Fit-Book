import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const path = req.nextUrl.pathname;

  const isLoginPage = path === "/admin/login";
  const isAdminRoot = path === "/admin";
  const isProtected = path.startsWith("/admin") && !isLoginPage && !isAdminRoot;

  // If NOT logged in and trying to access a protected route
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
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

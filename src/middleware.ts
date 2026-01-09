import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Initialize Supabase
  // ... (keep existing supabase createServerClient code) ...
  let supabaseResponse = NextResponse.next({
    request,
  });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
      cookieOptions: {
        domain: process.env.NODE_ENV === 'production' ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : undefined,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    }
  );

  // 3. Subdomain Logic
  const hostname = request.headers.get('host') || '';

  // 2. Auth Check (OPTIMIZED: Only run for Protected Routes)
  let user = null;
  const isProtectedPath = request.nextUrl.pathname.startsWith('/admin');

  if (isProtectedPath) {
      const { data: authData, error } = await supabase.auth.getUser();
      user = authData.user;
      
       console.log(`[Middleware] ${request.nextUrl.pathname} | Host: ${hostname} | User: ${!!user} | Cookies: ${request.cookies.getAll().length}`);
       if (error) console.log("[Middleware] Auth Error:", error.message);
  }

  const searchParams = request.nextUrl.searchParams.toString();
  const path = `${request.nextUrl.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ''
  }`;

  // Identify if it's a subdomain (e.g. "test-gym.localhost:3000" -> "test-gym")
  // Adjust logic to handle "localhost:3000" vs "test-gym.localhost:3000"
  let currentHost;
  if (process.env.NODE_ENV === 'production') {
     // Production logic (e.g., app.fitbook.com)
     const baseDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'fitbook.app';
     currentHost = hostname.replace(`.${baseDomain}`, '');
  } else {
     // Localhost logic
     // hostname is something like "test-gym.localhost:3000"
     // We want to extract "test-gym"
     currentHost = hostname.replace(`.localhost:3000`, '');
  }
  
  // FIX: If it is an API route, let it pass through!
  // We do NOT want to rewrite /api to /site/[slug]/api
  if (request.nextUrl.pathname.startsWith('/api')) {
      return supabaseResponse;
  }

  // Check if it's the Root Domain (Landing Page or Admin)
  if (currentHost === 'app' || currentHost === 'www' || currentHost === 'localhost:3000') {
      // Normal Next.js routing applies (Admin, Public Marketing, etc.)
       // Protect Admin Routes (dashboard, bookings, etc.) but allow LOGIN
       if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login') && !user) {
          return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      // If already logged in and trying to go to Login, send to Dashboard
      // If already logged in and trying to go to Login, *let it pass* to the login page
      // The login page will handle the "already logged in" state and redirect to the correct tenant dashboard.
      // if (request.nextUrl.pathname === '/admin/login' && user) {
      //    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      // }
      return supabaseResponse;
  }

  // 4. It is a Tenant Subdomain (e.g. "gold.localhost:3000")
  
  // FIX: Allow Admin Access on Subdomains with Tenant Context!
  if (path.startsWith('/admin')) {
      // 1. Check Auth
      if (!path.startsWith('/admin/login') && !user) {
          return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      if (request.nextUrl.pathname === '/admin/login' && user) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      
      // 2. Rewrite to the Tenant-Specific Admin Route
      // If path is /admin/dashboard on host "gold", rewrite to /admin/gold/dashboard
      // Users still see "gold.localhost:3000/admin/dashboard"
      if (!path.startsWith('/admin/login')) {
         const newPath = path.replace('/admin', `/admin/${currentHost}`);
         return NextResponse.rewrite(new URL(newPath, request.url));
      }
      
      // For Login, keep it as is (Global Login Page)
      return NextResponse.rewrite(new URL(path, request.url));
  }
  // Rewrite the URL to point to the dynamic logic
  // e.g. /services -> /site/gold/services

  // Rewrite the URL to point to the dynamic logic
  // e.g. /services -> /site/gold/services

  // Rewrite to the "site" folder
  return NextResponse.rewrite(
    new URL(`/site/${currentHost}${path}`, request.url)
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
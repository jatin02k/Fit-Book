import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Initialize Supabase
  // ... (keep existing supabase createServerClient code) ...
  // Determine Cookie Domain dynamically
  const hostname = request.headers.get('host') || '';
  let cookieDomain: string | undefined = undefined;
  if (process.env.NODE_ENV === 'production') {
      const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
      if (root && hostname.endsWith(root)) {
          cookieDomain = `.${root}`;
      }
  }

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
        domain: cookieDomain,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    }
  );

  // 3. Subdomain Logic
  // hostname is already defined above

  // 2. Auth Check (OPTIMIZED: Only run for Protected Routes)
  let user = null;
  // Check for standard /admin paths OR path-based /app/.../admin paths
  const isProtectedPath = request.nextUrl.pathname.startsWith('/admin') || 
                          request.nextUrl.pathname.match(/^\/app\/[^/]+\/admin/);

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

  // PATH-BASED TENANCY LOGIC (For Single Domain / Vercel Free Tier)
  // Format: domain.com/app/[slug]/...
  
  // Regex to detect /app/[slug]
  // Matches: /app/iron-gym, /app/iron-gym/admin, /app/iron-gym/services
  const gymMatch = request.nextUrl.pathname.match(/^\/app\/([^/]+)(.*)/);

  if (gymMatch) {
      const slug = gymMatch[1]; // e.g. "iron-gym"
      const remainingPath = gymMatch[2] || ''; // e.g. "/admin/dashboard" or ""

      // 1. Handle Admin Routes inside Gym Path
      // URL: /app/iron-gym/admin/dashboard -> Internal: /admin/iron-gym/dashboard
      if (remainingPath.startsWith('/admin')) {
          // Check Auth for Admin Routes
          if (!remainingPath.startsWith('/admin/login') && !user) {
             // Redirect to global login, preserving return URL?
             // For now, just global login.
             return NextResponse.redirect(new URL('/admin/login', request.url));
          }
          
          // Rewrite to src/app/admin/[slug]/...
          // We need to strip the first "/admin" from remainingPath if standard route is /admin/[slug]/dashboard
          // Actually, let's check folder structure: src/app/admin/[slug]/dashboard
          // So we want /admin/iron-gym/dashboard
          // remainingPath is "/admin/dashboard"
          // We want: /admin/iron-gym/dashboard
          
          // Construct new path:
          // /admin/[slug] + /dashboard (from /admin/dashboard)
          const adminInternalPath = remainingPath.replace(/^\/admin/, `/admin/${slug}`);
          return NextResponse.rewrite(new URL(adminInternalPath, request.url));
      }

      // 2. Handle Public Site Routes inside Gym Path
      // URL: /app/iron-gym/services -> Internal: /site/iron-gym/services
      // URL: /app/iron-gym -> Internal: /site/iron-gym
      const searchParams = request.nextUrl.searchParams.toString();
      const queryString = searchParams.length > 0 ? `?${searchParams}` : '';
      return NextResponse.rewrite(new URL(`/site/${slug}${remainingPath}${queryString}`, request.url));
  }

  // Handle Root Domain (Landing Page, Global Login)
  // No re-writes needed, just standard routing.
  // / -> src/app/page.tsx
  // /admin/login -> src/app/admin/login/page.tsx
  
  // Protect /admin routes if accessed directly with a slug (though strictly they should be via /app/...)
  // If someone accesses /admin/iron-gym/dashboard directly, it might work if not rewritten?
  // Next.js file routing usually handles folders directly. 
  // But we want to ENFORCE /gym structure for consistency perhaps?
  // For now, let's allow standard routing to fall through.

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
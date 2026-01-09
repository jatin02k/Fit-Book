import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  let cookieDomain: string | undefined = undefined;
  
  // Dynamic Cookie Domain Logic for Vercel Previews vs Production
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    if (root && window.location.hostname.endsWith(root)) {
        // We are on the main domain or a subdomain of it
        cookieDomain = `.${root}`;
    }
    // If not matching root (e.g. vercel.app), leave undefined to use current host
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: cookieDomain,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    }
  );
}

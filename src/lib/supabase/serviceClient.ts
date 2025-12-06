// src/lib/supabase/serviceClient.ts (New file for admin use)

import { Database } from '@/types/supabase';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// CRITICAL: This requires SUPABASE_SERVICE_ROLE_KEY to be set in Vercel env vars
export const createServiceClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing environment variable SUPABASE_SERVICE_ROLE_KEY');
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // <-- USE THE SECRET KEY HERE
    {
      auth: {
        persistSession: false, // Service Role Key does not need session persistence
      },
    }
  );
};
import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk digunakan di komponen Client ("use client").
 * Membuat satu instance per panggilan — aman untuk dipakai di hooks.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

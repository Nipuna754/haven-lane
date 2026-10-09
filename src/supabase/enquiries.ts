import "server-only";
import { createClient } from "@supabase/supabase-js";

/*
  Saves an enquiry to Supabase. Runs on the server only, so the key never
  reaches the browser. It is the project's publishable (anon) key: row-level
  security lets that key add rows to "enquiries" and nothing else, so even
  if it leaked, nobody could read the enquiries with it.
*/

export type NewEnquiry = {
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  when_suits: "weekdays" | "weekends" | "any";
  home_slug: string | null;
  agent_slug: string | null;
};

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;

export async function saveEnquiry(row: NewEnquiry): Promise<{ ok: boolean }> {
  if (!url || !key) {
    // Not connected yet (e.g. running locally before setup): don't lose the
    // visitor's message silently in production, but let local testing work.
    if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
      console.error("Enquiry not saved: SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is missing.");
      return { ok: false };
    }
    console.info("[dev] Supabase not set up; enquiry would be saved:", { ...row, email: "(hidden)" });
    return { ok: true };
  }

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  // No .select() after insert: visitors may add rows but not read them back.
  const { error } = await supabase.from("enquiries").insert(row);
  if (error) {
    console.error("Enquiry not saved:", error.code, error.message);
    return { ok: false };
  }
  return { ok: true };
}

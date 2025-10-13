import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://muicmwljigivgplzptgm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aWNtd2xqaWdpdmdwbHpwdGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDYxMzQsImV4cCI6MjA3MzEyMjEzNH0.uqKn9cP3woEnTmjb_dg115G0MNOTV0lj_cdtdYl6hys";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: { schema: "sh_pinoy_ballers" },
});

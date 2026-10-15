import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

const DEFAULT_SUPABASE_URL = "https://kwwidrvawbcyoulxjyui.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3d2lkcnZhd2JjeW91bHhqeXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDU3NTksImV4cCI6MjA5NzUyMTc1OX0.EOWtpFHlsN7H32Looon43cqwBaCc5BOVkQWdjd1V60I";

export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_SUPABASE_URL;
export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

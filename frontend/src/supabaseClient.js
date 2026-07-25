import { createClient } from '@supabase/supabase-js';

// You will paste your keys here or put them in a frontend .env file
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail-safe check to catch missing keys early during development
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase environment variables! Check your frontend .env file.");
}


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
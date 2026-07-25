import { createClient } from '@supabase/supabase-js';

// You will paste your keys here or put them in a frontend .env file
const SUPABASE_URL = import.meta.env.SUPABASE_URL
"YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
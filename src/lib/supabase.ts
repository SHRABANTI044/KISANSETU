// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://jzuxbfdhpsqzrbupecnv.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6dXhiZmRocHNxenJidXBlY252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MzM0MjQsImV4cCI6MjEwNDIwOTQyNH0.XzZa_cZ2JisCryT02Eg8rDttsSfC54FZTVOXuG8_5YI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
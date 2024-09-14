import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  import.meta.env.VITE_KEY,
  import.meta.env.VITE_URL
);



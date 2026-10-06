import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://jxgupbbechqvqirjiaes.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_j2M4OCCC2WkVdrYrTHlzVA_E2jAxgoV";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const SUPABASE_URL = "https://jxgupbbechqvqirjiaes.supabase.co";
const SUPABASE_KEY = "sb_publishable_j2M4OCCC2WkVdrYrTHlzVA_E2jAxgoV";

window.supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
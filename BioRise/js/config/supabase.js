/*
  BIORISE CLOUD CONNECTION — intentionally not active in this local prototype.

  When the UI/workflow is approved, replace localStorage with Supabase:
  1. Create a Supabase project.
  2. Add the public project URL and anon key here.
  3. Move authentication to Supabase Auth / a secure worker-ID login flow.
  4. Create PostgreSQL tables based on database/schema.sql.
  5. Enable Row Level Security so workers can read only their own data.
  6. Never place an admin/service-role secret in browser JavaScript.

  This file exists now so the project structure does not need to change later.
*/
export const SUPABASE_URL = "";
export const SUPABASE_ANON_KEY = "";

const SUPABASE_URL = "https://duywxobzcyqoqzbxvrka.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eXd4b2J6Y3lxb3F6Ynh2cmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjM1NDksImV4cCI6MjA4ODYzOTU0OX0.ZFQPJsSoBuVzVCDbKI33zAd1SSzVAusr34o8GsUPrVc";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

window.supabaseClient = supabaseClient;
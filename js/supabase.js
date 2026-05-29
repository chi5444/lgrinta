const SUPABASE_URL = 'https://xkkwoktedeyatabfqnpc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra3dva3RlZGV5YXRhYmZxbnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMDM5NTUsImV4cCI6MjA5NDg3OTk1NX0.kzEzioDjV3ZPV13bsTQTA0i6QiwELolArdcpRgKwWYM';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
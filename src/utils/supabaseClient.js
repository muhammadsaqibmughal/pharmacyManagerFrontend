import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ytpaxlgwouumnvwqxtzm.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cGF4bGd3b3V1bW52d3F4dHptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODIwMjI4OCwiZXhwIjoyMDczNzc4Mjg4fQ.grcHTLDvttiOcJS2l-sRC4Q1_0HjX74LVACZND4bs5k'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

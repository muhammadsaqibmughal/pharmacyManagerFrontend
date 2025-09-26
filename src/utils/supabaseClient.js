import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tyteorafrqsefmfmccvx.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dGVvcmFmcnFzZWZtZm1jY3Z4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODg5MjI1MywiZXhwIjoyMDc0NDY4MjUzfQ.eujeCBQtmWZ1zbMkEDPsHo3DBqDw8RdeZyvS2xHyveE'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocwrzudtzjabrdobmzjb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jd3J6dWR0emphYnJkb2JtempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODkwNTMsImV4cCI6MjA2ODY2NTA1M30.gmhUB4gpHx64AiMYBKvNB159ypw6gNyutMco8Ne60K0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rsbecnvflaozcakhjcph.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzYmVjbnZmbGFvemNha2hqY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk5Nzg4MCwiZXhwIjoyMDY4NTczODgwfQ.0w4CUKzI1bnJxWfWjxKPIG8_rSfC-6l89YWQwIoMJPI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 
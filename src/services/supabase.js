import { createClient } from '@supabase/supabase-js'

// La URL la encuentras justo arriba de las llaves en tu panel de Supabase
const supabaseUrl = 'https://hgfvusirebbdxgjlrlea.supabase.co'

// Usa la "Publishable key" que sale en tu foto (la que empieza por sb_publishable)
const anonPublicKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZnZ1c2lyZWJiZHhnamxybGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MjcyODQsImV4cCI6MjA4MjEwMzI4NH0.d2cjtDdtCdBaOYAaQAfD5CckO6EjfvJ8hN7DOxiJQx0'

export const supabase = createClient(supabaseUrl, anonPublicKey)
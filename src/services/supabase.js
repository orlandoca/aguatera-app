import { createClient } from '@supabase/supabase-js'

// La URL la encuentras justo arriba de las llaves en tu panel de Supabase
// La URL la encuentras justo arriba de las llaves en tu panel de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// Usa la "Publishable key" que sale en tu foto (la que empieza por sb_publishable)
const anonPublicKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, anonPublicKey)
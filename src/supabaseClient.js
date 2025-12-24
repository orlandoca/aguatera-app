import { createClient } from '@supabase/supabase-js'

// La URL la encuentras justo arriba de las llaves en tu panel de Supabase
const supabaseUrl = 'https://hgfvusirebbdxgjlrlea.supabase.co' 

// Usa la "Publishable key" que sale en tu foto (la que empieza por sb_publishable)
const supabaseAnonKey = 'sb_publishable_KR4L2-JZCz7X8jhRIkuUmw_QL2ZUEGC'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
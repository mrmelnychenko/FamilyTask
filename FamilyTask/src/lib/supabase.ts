import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://imoctleblolieptkpumq.supabase.co'
const supabaseAnonKey = 'sb_publishable_ftZczAqycXvhZzyVV9l-FQ_xromG_J5'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
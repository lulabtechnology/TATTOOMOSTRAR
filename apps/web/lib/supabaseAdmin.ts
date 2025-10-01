import { createClient } from '@supabase/supabase-js'


export function createAdminClient(){
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if(!url || !key) throw new Error('Faltan variables de entorno de Supabase')
return createClient(url, key, { auth: { persistSession: false }})
}

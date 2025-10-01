import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'


export async function GET(){
try{
const supabase = createAdminClient()
const { data: hello, error } = await supabase.rpc('pg_sleep', { seconds: 0 })
const url = process.env.SUPABASE_URL
const ok = !!(url && process.env.SUPABASE_SERVICE_ROLE_KEY)
return NextResponse.json({ ok, supabaseUrl: url, canQuery: !error })
}catch(e:any){
return NextResponse.json({ ok:false, error: e.message }, { status: 500 })
}
}

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'

export async function GET(){
  try{
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    const okEnv = !!(url && key)

    let canQuery = false
    let rows = 0
    let buckets: any[] = []
    let tableExists = false
    let errorMsg: string | null = null

    if(okEnv){
      const supabase = createAdminClient()
      // tabla
      const { count, error } = await supabase.from('tattoo_requests').select('*', { head: true, count: 'exact' })
      if(!error){ canQuery = true; rows = count ?? 0 }
      else { errorMsg = error.message }

      // buckets (para confirmar storage)
      const { data: bks, error: e2 } = await (supabase as any).storage.listBuckets()
      if(!e2 && Array.isArray(bks)){ buckets = bks }
      tableExists = !error || /does not exist/i.test(error.message) === false
    }

    return NextResponse.json({ ok: okEnv, supabaseUrl: url, canQuery, rows, tableExists, buckets, errorMsg })
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e.message }, { status: 500 })
  }
}

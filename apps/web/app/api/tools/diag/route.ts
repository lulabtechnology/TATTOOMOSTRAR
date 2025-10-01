import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'

export async function GET(){
  try{
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    const okEnv = !!(url && key)

    let canQuery = false
    let rows = 0
    let errorMsg: string | null = null
    let buckets: any[] = []

    if(okEnv){
      const supabase = createAdminClient()
      const { count, error } = await supabase
        .from('tattoo_requests')
        .select('*', { head: true, count: 'exact' })
      if(!error){ canQuery = true; rows = count ?? 0 } else { errorMsg = error.message }

      const { data: bks } = await (supabase as any).storage.listBuckets()
      if(Array.isArray(bks)) buckets = bks
    }

    return NextResponse.json({ okEnv, supabaseUrl: url, canQuery, rows, errorMsg, buckets })
  }catch(e:any){
    return NextResponse.json({ okEnv:false, error: e.message }, { status: 500 })
  }
}

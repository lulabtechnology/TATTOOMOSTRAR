import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { nanoid } from 'nanoid'

export const runtime = 'nodejs'

export async function POST(){
  try{
    if(!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY){
      return NextResponse.json({ ok:false, error:'Faltan variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en Vercel' }, { status: 500 })
    }
    const supabase = createAdminClient()
    const public_id = 'TEST_' + nanoid(6)

    const { error } = await supabase.from('tattoo_requests').insert({
      public_id,
      customer_name: 'Test Insert',
      email: 'test@example.com',
      appointment_date: new Date().toISOString().slice(0,10),
      appointment_time: '10:00',
      style: 'caricatura',
      body_part: 'antebrazo',
      size_preset: '2x2',
      price: 60,
      breakdown: { test: true },
      status: 'pending'
    })

    if(error) return NextResponse.json({ ok:false, step:'insert', error: error.message }, { status: 500 })
    return NextResponse.json({ ok:true, id: public_id })
  }catch(e:any){
    return NextResponse.json({ ok:false, step:'fatal', error: e.message }, { status: 500 })
  }
}

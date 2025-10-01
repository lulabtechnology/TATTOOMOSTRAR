import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { computePrice } from '@/lib/price'
import type { PriceInput } from '@/lib/types'
import { nanoid } from 'nanoid'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ ok: true, note: 'Usa POST para crear la ficha.' })
}
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { Allow: 'GET, POST, OPTIONS' } })
}

export async function POST(req: NextRequest) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Faltan variables de Supabase en Vercel.' }, { status: 500 })
  }
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Body inválido' }, { status: 400 }) }

  const required = ['customer_name', 'email', 'appointment_date', 'appointment_time', 'style', 'body_part']
  for (const k of required) if (!body[k]) return NextResponse.json({ error: `Falta ${k}` }, { status: 400 })

  try {
    const supabase = createAdminClient()
    const input: PriceInput = {
      style: body.style, bodyPart: body.body_part,
      widthIn: body.width_in ?? null, heightIn: body.height_in ?? null,
      sizePreset: body.size_preset ?? null, complexityScore: body.image_meta?.complexityScore ?? 1.0
    }
    const priced = computePrice(input)
    const public_id = nanoid(10)
    const { error } = await supabase.from('tattoo_requests').insert({
      public_id,
      customer_name: body.customer_name,
      email: body.email,
      phone: body.phone ?? null,
      appointment_date: body.appointment_date,
      appointment_time: body.appointment_time,
      style: body.style,
      body_part: body.body_part,
      size_preset: body.size_preset ?? null,
      height_in: body.height_in ?? null,
      width_in: body.width_in ?? null,
      image_url: body.image_url ?? null,
      image_meta: body.image_meta ?? null,
      price: priced.total,
      breakdown: priced.breakdown,
      status: 'pending'
    })
    if (error) {
      console.error('submit insert error', error)
      return NextResponse.json({ error: `Supabase insert: ${error.message}` }, { status: 500 })
    }
    return NextResponse.json({ id: public_id })
  } catch (e: any) {
    console.error('submit fatal', e?.message, e)
    return NextResponse.json({ error: `Server error: ${e?.message || 'unknown'}` }, { status: 500 })
  }
}

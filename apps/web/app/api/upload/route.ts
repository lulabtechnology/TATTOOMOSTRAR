import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { nanoid } from 'nanoid'


export const runtime = 'nodejs'


export async function POST(req: NextRequest){
try {
const form = await req.formData()
const file = form.get('file') as File | null
const ext = (form.get('ext') as string) || 'jpg'
if(!file) return NextResponse.json({ error: 'Archivo no recibido' }, { status: 400 })


const supabase = createAdminClient()
const id = nanoid(12)
const path = `refs/${id}.${ext.split('/').pop()}`


const arrayBuffer = await file.arrayBuffer()
const { error } = await supabase.storage
.from('tattoo-refs')
.upload(path, Buffer.from(arrayBuffer), { contentType: file.type, upsert: false })


if(error) return NextResponse.json({ error: error.message }, { status: 500 })


const { data: pub } = supabase.storage.from('tattoo-refs').getPublicUrl(path)
return NextResponse.json({ url: pub.publicUrl, key: path })
} catch (e:any) {
return NextResponse.json({ error: e.message }, { status: 500 })
}
}

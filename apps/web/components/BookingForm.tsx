'use client'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import BodyPartSelector from '@/components/BodyPartSelector'
import StyleSelector from '@/components/StyleSelector'
import SizePicker from '@/components/SizePicker'
import ImageUploader from '@/components/ImageUploader'
import { computePrice, PriceInput } from '@/lib/price'
import PriceSummary from '@/components/PriceSummary'

export default function BookingForm(){
  const r = useRouter()
  const [customerName, setCustomerName] = useState('Juan Pérez')
  const [email, setEmail] = useState('cliente@example.com')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState<string>('2025-10-15')
  const [time, setTime] = useState<string>('15:00')

  const [style, setStyle] = useState('caricatura')
  const [bodyPart, setBodyPart] = useState('antebrazo')
  const [unit, setUnit] = useState<'in'|'cm'>('in')
  const [preset, setPreset] = useState<string|null>('3x3')
  const [width, setWidth] = useState<number|null>(null)
  const [height, setHeight] = useState<number|null>(null)
  const [image, setImage] = useState<File|null>(null)
  const [imageMeta, setImageMeta] = useState<any|null>(null)

  const priceInput: PriceInput = useMemo(()=>({
    style,
    bodyPart,
    widthIn: width? (unit==='cm'? width/2.54 : width) : null,
    heightIn: height? (unit==='cm'? height/2.54 : height) : null,
    sizePreset: preset,
    complexityScore: imageMeta?.complexityScore ?? 1.0
  }), [style, bodyPart, width, height, unit, preset, imageMeta])

  const quote = computePrice(priceInput)

  async function onSubmit(){
    if(!style || !bodyPart) return alert('Completa estilo y parte del cuerpo')
    if(!preset && !(width && height)) return alert('Define el tamaño (preset o personalizado)')

    let uploadedUrl: string | null = null
    if(image){
      const fd = new FormData()
      fd.append('file', image)
      fd.append('ext', image.type)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const j = await res.json()
      if(!res.ok) return alert(j.error || 'Error subiendo imagen')
      uploadedUrl = j.url
    }

    const payload = {
      customer_name: customerName,
      email, phone,
      appointment_date: date,
      appointment_time: time,
      style,
      body_part: bodyPart,
      size_preset: preset,
      width_in: priceInput.widthIn,
      height_in: priceInput.heightIn,
      image_url: uploadedUrl,
      image_meta: imageMeta
    }

    const res2 = await fetch('/api/submit', { method: 'POST', body: JSON.stringify(payload) })
    const j2 = await res2.json()
    if(!res2.ok) return alert(j2.error || 'Error creando la reserva')
    r.push(`/review/${j2.id}`)
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="card md:col-span-2 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Nombre</label>
            <input className="input" value={customerName} onChange={e=>setCustomerName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Teléfono (opcional)</label>
            <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Fecha deseada</label>
              <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
            </div>
            <div>
              <label className="label">Hora deseada</label>
              <input className="input" type="time" value={time} onChange={e=>setTime(e.target.value)} />
            </div>
          </div>
        </div>

        <StyleSelector value={style} onChange={setStyle} />
        <BodyPartSelector value={bodyPart} onChange={setBodyPart} />
        <SizePicker unit={unit} setUnit={setUnit} preset={preset} setPreset={setPreset}
          width={width} setWidth={setWidth} height={height} setHeight={setHeight} />
        <ImageUploader onReady={({ file, meta })=>{ setImage(file); setImageMeta(meta) }} />
      </div>

      <div className="card space-y-4 h-fit">
        <h3 className="font-semibold">Estimado</h3>
        <PriceSummary price={quote.total} breakdown={quote.breakdown} />
        <button onClick={onSubmit} className="btn btn-primary w-full">Subir y crear ficha</button>
        <p className="text-xs text-gray-500">Nota: análisis y precio son aproximados (demo).</p>
      </div>
    </div>
  )
}

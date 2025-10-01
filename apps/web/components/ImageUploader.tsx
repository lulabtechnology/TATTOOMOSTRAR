'use client'
import { analyzeImage } from '@/lib/imageAnalysis'
import { useRef, useState } from 'react'


export default function ImageUploader({ onReady }:{ onReady: (info:{ file: File, meta:any })=>void }){
const ref = useRef<HTMLInputElement>(null)
const [preview, setPreview] = useState<string | null>(null)
const [meta, setMeta] = useState<any|null>(null)
const [loading, setLoading] = useState(false)


async function handleFile(file: File){
setLoading(true)
const url = URL.createObjectURL(file)
setPreview(url)
const m = await analyzeImage(file)
setMeta(m)
onReady({ file, meta: m })
setLoading(false)
}


return (
<div className="space-y-2">
<label className="label">Imagen de referencia</label>
<input ref={ref} type="file" accept="image/*" className="input" onChange={e=>{
const f = e.target.files?.[0]; if(f) handleFile(f)
}} />
{loading && <div className="text-sm">Analizando imagen…</div>}
{preview && (
<div className="grid md:grid-cols-2 gap-4 items-start">
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={preview} alt="preview" className="rounded-xl border w-full max-h-72 object-contain" />
{meta && (
<div className="text-sm space-y-1">
<div><span className="text-gray-500">Resolución:</span> {meta.width} × {meta.height}px ({meta.megapixels.toFixed(2)} MP)</div>
<div><span className="text-gray-500">Archivo:</span> ~{Math.round(meta.fileSizeKB)} KB</div>
<div><span className="text-gray-500">Densidad de bordes:</span> {(meta.edgeDensity*100).toFixed(0)}%</div>
<div><span className="text-gray-500">Complejidad:</span> {meta.complexityScore.toFixed(2)}</div>
</div>
)}
</div>
)}
</div>
)
}

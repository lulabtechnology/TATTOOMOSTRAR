'use client'
import { useState } from 'react'


const PRESETS = ['2x2','3x3','4x4','5x5','6x6']


type Props = {
unit: 'in'|'cm'
setUnit: (u:'in'|'cm')=>void
preset: string | null
setPreset: (p:string|null)=>void
width: number | null
setWidth: (v:number|null)=>void
height: number | null
setHeight: (v:number|null)=>void
}


export default function SizePicker({ unit, setUnit, preset, setPreset, width, setWidth, height, setHeight }: Props){
const [mode, setMode] = useState<'preset'|'custom'>(preset? 'preset' : 'custom')
return (
<div className="space-y-3">
<label className="label">Tamaño</label>
<div className="flex gap-2">
<button type="button" className={`btn ${mode==='preset'?'btn-primary':'btn-outline'}`} onClick={()=>setMode('preset')}>Presets</button>
<button type="button" className={`btn ${mode==='custom'?'btn-primary':'btn-outline'}`} onClick={()=>setMode('custom')}>Personalizado</button>
<div className="ml-auto flex items-center gap-2 text-sm">
<span>Unidad:</span>
<select className="input" value={unit} onChange={e=>setUnit(e.target.value as any)}>
<option value="in">pulgadas (in)</option>
<option value="cm">centímetros (cm)</option>
</select>
</div>
</div>


{mode==='preset' ? (
<div className="grid grid-cols-3 md:grid-cols-6 gap-2">
{PRESETS.map(p => (
<button type="button" key={p} onClick={()=>{ setPreset(p); setWidth(null); setHeight(null); }}
className={`btn ${preset===p? 'btn-primary':'btn-outline'}`}>{p} in</button>
))}
</div>
) : (
<div className="grid grid-cols-2 gap-2">
<div>
<span className="text-sm">Ancho ({unit})</span>
<input className="input" type="number" min={1} step={0.5} value={width ?? ''} onChange={e=>setWidth(e.target.value? Number(e.target.value) : null)} />
</div>
<div>
<span className="text-sm">Alto ({unit})</span>
<input className="input" type="number" min={1} step={0.5} value={height ?? ''} onChange={e=>setHeight(e.target.value? Number(e.target.value) : null)} />
</div>
</div>
)}
</div>
)
}

'use client'
import { styleLabel } from '@/lib/utils'


const STYLES = [
'caricatura',
'realismo_caras',
'mascotas',
'nombres_letras',
'geometrico'
] as const


export type StyleType = typeof STYLES[number]


export default function StyleSelector({ value, onChange }:{ value: string; onChange: (v:string)=>void }){
return (
<div className="space-y-2">
<label className="label">Estilo del tatuaje</label>
<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
{STYLES.map(s => (
<button key={s} type="button" onClick={()=>onChange(s)}
className={`btn ${value===s? 'btn-primary' : 'btn-outline'} justify-start`}>{styleLabel(s)}</button>
))}
</div>
</div>
)
}

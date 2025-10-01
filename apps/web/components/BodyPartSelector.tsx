'use client'


const PARTS = [
'brazo', 'antebrazo', 'muñeca', 'mano', 'pecho', 'espalda', 'hombro', 'pantorrilla', 'tobillo', 'cuello', 'costillas'
]


export default function BodyPartSelector({ value, onChange }:{ value: string; onChange: (v:string)=>void }){
return (
<div className="space-y-2">
<label className="label">Parte del cuerpo</label>
<select className="input" value={value} onChange={e=>onChange(e.target.value)}>
<option value="">Selecciona…</option>
{PARTS.map(p => <option key={p} value={p}>{p}</option>)}
</select>
</div>
)
}

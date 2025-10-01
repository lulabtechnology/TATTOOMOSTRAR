export function formatCurrency(v:number){
return v.toLocaleString('es-PA', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}


export function inchesFromPreset(preset: string){
const [w,h] = preset.split('x').map(Number)
return { w, h }
}


export function styleLabel(s:string){
return ({
caricatura: 'Caricatura / Ilustración',
realismo_caras: 'Caras (realismo)',
mascotas: 'Mascotas',
nombres_letras: 'Nombres / Letras',
geometrico: 'Geométrico'
} as any)[s] || s
}


export function prettySize(req: any){
if(req.size_preset) return `${req.size_preset} in`
if(req.width_in && req.height_in) return `${req.width_in}" × ${req.height_in}"`
return 'N/D'
}

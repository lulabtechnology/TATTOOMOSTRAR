import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabaseAdmin'
import PriceSummary from '@/components/PriceSummary'
import { formatCurrency, prettySize, styleLabel } from '@/lib/utils'


export default async function ReviewPage({ params }: { params: { id: string } }) {
const supabase = createAdminClient()
const { data, error } = await supabase
.from('tattoo_requests')
.select('*')
.eq('public_id', params.id)
.maybeSingle()


if (error || !data) return notFound()


const req = data as any
return (
<div className="space-y-6">
<div className="flex items-center justify-between">
<h2 className="text-xl font-bold">Ficha para el tatuador</h2>
<span className="badge">ID: {req.public_id}</span>
</div>


<div className="grid md:grid-cols-3 gap-6">
<div className="card md:col-span-2 space-y-4">
<h3 className="font-semibold">Datos del cliente</h3>
<div className="grid sm:grid-cols-2 gap-3 text-sm">
<div><span className="text-gray-500">Nombre:</span> {req.customer_name}</div>
<div><span className="text-gray-500">Email:</span> {req.email}</div>
{req.phone && (<div><span className="text-gray-500">Teléfono:</span> {req.phone}</div>)}
<div><span className="text-gray-500">Fecha deseada:</span> {req.appointment_date}</div>
<div><span className="text-gray-500">Hora deseada:</span> {req.appointment_time}</div>
</div>


<hr className="my-4" />


<h3 className="font-semibold">Detalle del tatuaje</h3>
<div className="grid sm:grid-cols-2 gap-3 text-sm">
<div><span className="text-gray-500">Estilo:</span> {styleLabel(req.style)}</div>
<div><span className="text-gray-500">Parte del cuerpo:</span> {req.body_part}</div>
<div><span className="text-gray-500">Tamaño:</span> {prettySize(req)}</div>
{req.image_meta?.megapixels && (
<div><span className="text-gray-500">Imagen:</span> {req.image_meta.megapixels.toFixed(2)} MP, ~{Math.round(req.image_meta.fileSizeKB)} KB</div>
)}
</div>


{req.image_url && (
<div className="mt-4">
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={req.image_url} alt="Referencia" className="rounded-xl border w-full max-h-[420px] object-contain" />
</div>
)}
</div>


<div className="card">
<PriceSummary price={req.price} breakdown={req.breakdown} />
<div className="text-sm text-gray-600 mt-4">
<p>Este es un <strong>estimado</strong>. El precio real puede variar según complejidad, piel y tiempo en sesión. Se sugiere un margen ±15%.</p>
<p className="mt-2">Depósito no reembolsable para reservar: {formatCurrency(req.breakdown?.deposit || 0)}</p>
</div>
</div>
</div>
</div>
)
}

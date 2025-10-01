'use client'
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/utils'


export default function PriceSummary({ price, breakdown }:{ price: number, breakdown: any }){
const data = [
{ name: 'Tiempo base', value: breakdown.baseCost },
{ name: 'Complejidad', value: breakdown.complexityCost },
{ name: 'Zona cuerpo', value: breakdown.bodyPartCost },
{ name: 'Mínimo tienda', value: breakdown.shopMinAdj }
].filter(d=>d.value>0)


return (
<div>
<div className="text-3xl font-bold">{formatCurrency(price)}</div>
<div className="text-xs text-gray-500">±15% de margen</div>
<div className="h-44 mt-2">
<ResponsiveContainer>
<PieChart>
<Pie dataKey="value" data={data} outerRadius={70} label>
{data.map((entry, idx) => <Cell key={idx} />)}
</Pie>
<Tooltip formatter={(v)=>formatCurrency(Number(v))} />
</PieChart>
</ResponsiveContainer>
</div>
<div className="text-sm space-y-1 mt-2">
<div>Depósito sugerido: <strong>{formatCurrency(breakdown.deposit)}</strong></div>
<ul className="list-disc ml-4 text-gray-600">
<li>Tarifa por hora: {formatCurrency(breakdown.ratePerHour)}/h</li>
<li>Horas estimadas: {breakdown.hours.toFixed(1)} h</li>
</ul>
</div>
</div>
)
}

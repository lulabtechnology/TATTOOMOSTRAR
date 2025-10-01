import Link from 'next/link'


export default function Home() {
return (
<div className="container-page">
<section className="card text-center">
<h1 className="text-3xl font-bold mb-2">Estudio de Tatuajes — Demo</h1>
<p className="text-gray-600 mb-6">Reserva tu cita, sube tu referencia y obtén un precio aproximado.</p>
<Link href="/book" className="btn btn-primary">Reservar ahora</Link>
</section>
</div>
)
}

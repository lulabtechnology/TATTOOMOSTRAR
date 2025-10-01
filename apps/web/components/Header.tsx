import Link from 'next/link'


export default function Header(){
return (
<header className="border-b bg-white">
<div className="container-page py-4 flex items-center justify-between">
<Link href="/" className="flex items-center gap-2">
<span className="font-bold">Tattoo Studio</span>
</Link>
<nav className="flex items-center gap-4 text-sm">
<Link href="/book" className="hover:underline">Reservar</Link>
</nav>
</div>
</header>
)
}

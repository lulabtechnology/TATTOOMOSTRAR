import './globals.css'
import { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'


export const metadata = {
title: 'Tattoo Studio — Demo',
description: 'Reservas, análisis de imagen y precio estimado',
}


export default function RootLayout({ children }: { children: ReactNode }) {
return (
<html lang="es">
<body>
<Header />
<main className="container-page py-8">{children}</main>
<Footer />
</body>
</html>
)
}

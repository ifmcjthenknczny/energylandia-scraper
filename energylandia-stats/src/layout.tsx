import './styles/globals.css'

import Footer from '@/components/util/Footer'
import Head from 'next/head'

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>Energylandia Stats</title>
            </Head>
            <main className="flex-grow pb-8 md:pb-12">{children}</main>
            <Footer />
        </div>
    )
}

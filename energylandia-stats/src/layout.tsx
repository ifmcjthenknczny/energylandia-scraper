import './styles/globals.css'

import Footer from '@/components/util/Footer'
import Head from 'next/head'
import { ThemeButton } from './components/theme/ThemeButton'

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
            <ThemeButton />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    )
}

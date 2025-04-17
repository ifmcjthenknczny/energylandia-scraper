import '../styles/globals.css'

import type { AppProps } from 'next/app'
import Layout from '@/layout'
import { Provider } from '@/app/Providers'

function App({ Component, pageProps }: AppProps) {
    return (
        <Provider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Provider>
    )
}

export default App

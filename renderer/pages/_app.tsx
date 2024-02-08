import Head from 'next/head'
import Navigation from '../components/navigation'
import '../styles/globals.css'
import { ServersProvider } from '../contexts/servers'

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>LeoparDB 🐆</title>
                <meta charSet='utf-8' />
                <meta
                    name='description'
                    content='The easiest way to visualize your databases'
                ></meta>
                <meta
                    name='viewport'
                    content='initial-scale=1.0, width=device-width'
                />
            </Head>

            <ServersProvider>
                <div className='grid h-screen grid-cols-[230px_1fr]'>
                    <Navigation />
                    <div className='m-4 overflow-scroll'>
                        <Component {...pageProps} />
                    </div>
                </div>
            </ServersProvider>
        </>
    )
}

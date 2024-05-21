'use client'

import Head from "next/head"
import Navigation from "./components/navigation"
import { ServersProvider } from "./contexts/servers"
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <Head>
        <title>LeoparDB 🐆</title>
        <meta
          name="description"
          content="The easiest way to visualize your databases"
        />
      </Head>
      <body>
        <ServersProvider>
            <div className='grid h-screen grid-cols-[230px_1fr]'>
                <Navigation />
                <div className='m-4 overflow-scroll'>
                    {children}
                </div>
            </div>
        </ServersProvider>
      </body>
    </html>
  )
}

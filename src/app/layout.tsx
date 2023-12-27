import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/Components/Navbar'
import NextAuthProvider from '@/provider/SessionProvider'
import ReduxProdiver from '@/provider/ReduxProdiver'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Copy Code Community',
  description: `Copy Code Community is like a cool online club for people who love playing with computers and making websites and apps. Whether you're a total pro or just starting, everyone is invited to share their computer codes and chat about tech stuff.`,
}

export default function RootLayout({
  children,

}: {
  children: React.ReactNode,

}) {
  return (
    <html lang="en" style={{ position: 'relative' }}>
      <head>
      </head>
      <body className={inter.className}  >
        <NextAuthProvider>
          <ReduxProdiver>
            <Navbar />
            {children}
          </ReduxProdiver>
        </NextAuthProvider>
      </body>
    </html>
  )
}

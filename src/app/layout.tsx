import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import NextAuthProvider from '@/provider/SessionProvider'
import ReduxProdiver from '@/provider/ReduxProdiver'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@/provider/theme-provider';
import { Toaster as SonnerToast } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Copy Code Community',
  description: `Copy Code Community is like a cool online club for people who love playing with computers and making websites and apps. Whether you're a total pro or just starting, everyone is invited to share their computer codes and chat about tech stuff.`,
  authors: [
    {
      name: 'Copy Code Community',
      url: 'https://copycode.vercel.app'
    },
    {
      name: 'Jamia Hamdard',
      url: 'jamiahamdard.edu'
    }
  ],
  keywords: `Code, Programming, Web Development, Software Engineering,Copy Code Community,Copy Code Community Official, Computer Science, Developer, JamiaHamdard, Copy Code, Open Source, Jamia hamdard, Students community, Tutorial, java, python, c,c++, react,next,node,full stack, hackthon,Code, Programming, Web Development, Software Engineering,Copy Code Community, Computer Science, Developer, JamiaHamdard, Copy Code, Open Source, Jamia hamdard, Students community, Tutorial, java, python, c,c++, react,next,node,full stack, hackthon,Jamia Hamdard College, Technical Students Community, Jamia Hamdard Students, College Technology Forum, Student Tech Hub, Technical Discussions, Student Projects, Coding Community, Technology Events, Engineering Students, Computer Science Club, Tech Enthusiasts, Programming Challenges, Campus Tech News,Jamia Hamdard, Technical College, Student Technology Network, Coding Community, STEM Education, Programming Languages, Innovation Hub, IT Projects, Tech Workshops, Student Tech Blog, Digital Learning, Computer Science Society, Campus Tech Events, Engineering Projects, IT Networking, Hackathons, Software Development, Open Source Contributions, Tech Meetups, College Tech News,Copy Code Community Official,Copy Code Community Official`,
  // openGraph: {
  //   type: 'website',
  //   url: 'https://copycode.vercel.app',
  //   title: 'Copy Code Community',
  //   description: "A copy code community for sharing code snippets and learning from others.",
  //   siteName: 'Copy Code Community',
  //   images: [{ url: 'https://raw.githubusercontent.com/Zer-0ne/portfolio-freelancing-copy-code-community/main/src/app/favicon.ico' }]
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   site: 'https://copycode.vercel.app',
  //   creator: 'Copy Code Team',
  //   'images': 'https://raw.githubusercontent.com/Zer-0ne/portfolio-freelancing-copy-code-community/main/src/app/favicon.ico',
  //   title: 'Copy Code Community',
  //   description: "A copy code community for sharing code snippets and learning from others."
  // },
  robots: 'follow, index',
  publisher: 'Copy Code Community',
}

export default function RootLayout({
  children,

}: {
  children: React.ReactNode,

}) {
  return (
    <html lang="en" className='h-screen dark'>
      <head>
      </head>
      <body
        style={{
          // overscrollBehavior: 'none'
        }}
        className={`${inter.className} !m-0  `}  >
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            // defaultTheme="system"
            // defaultTheme="dark"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            <ReduxProdiver>
              <Navbar />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
              <SonnerToast 
                theme='dark'
                position='top-right'
              />
              {children}
              <Analytics />
            </ReduxProdiver>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}

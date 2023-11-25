'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { RecoilRoot } from 'recoil'
import Navbar from '../components/nav/Navbar'
import Sidebar from '@/components/nav/Sidebar'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
        <RecoilRoot>
          <head>
            <title>Pospal</title>
          </head>
          <body className={`${inter.className} bg-gray-50 w-full h-screen overflow-clip flex flex-col`}>
            <Navbar />
            <main className="w-full h-full flex flex-col md:flex-row">
              <Sidebar />
              <div className='w-full md:pr-32 overflow-auto'>{children}</div>
            </main>
            <Analytics />
          </body>
        </RecoilRoot>
      </UserProvider>
    </html>
  )
}

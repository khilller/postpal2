'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import Navbar from './components/nav/Navbar'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
        <head>
          <title>Pospal</title>
        </head>
        <body className={inter.className}>
          <Navbar />
          {children}
          </body>
      </UserProvider>
    </html>
  )
}

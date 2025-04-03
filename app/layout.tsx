import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Garden Machinery Advisor',
  description: 'Your personal garden machinery advisor for Spain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
          {children}
        </main>
      </body>
    </html>
  )
} 
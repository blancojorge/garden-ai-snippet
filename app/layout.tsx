import React from 'react'
import './globals.css'
import { Noto_Sans } from 'next/font/google'

const notoSans = Noto_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

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
      <body className={notoSans.className}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
} 
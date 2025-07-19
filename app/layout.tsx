import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Recurring-Dates-App',
  description: 'A simple app to manage recurring dates',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

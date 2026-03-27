import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const fontHeading = Syne({ 
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const fontSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

import { AuthGuard } from '@/components/auth/AuthGuard'

export const metadata: Metadata = {
  title: 'TradeFXBook | Track Trades. Analyze PnL. Master Markets.',
  description: 'Sync your trades, journal every setup, backtest ideas, and let AI do the analysis — completely free.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased text-foreground',
        fontSans.variable,
        fontHeading.variable
      )}>
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  )
}

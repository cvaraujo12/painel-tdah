import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Loading } from '@/components/ui/loading'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Painel TDAH',
  description: 'Sistema de gerenciamento para pessoas com TDAH',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}

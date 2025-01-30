'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { A11yProvider } from '@/components/ui/a11y-provider'
import { Toaster } from '@/components/ui/toaster'
import { monitoring } from '@/lib/monitoring'
import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/web-vitals'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    reportWebVitals()
  }, [])

  return (
    <monitoring.AnalyticsProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <A11yProvider>
          {children}
          <Toaster />
        </A11yProvider>
      </ThemeProvider>
    </monitoring.AnalyticsProvider>
  )
} 
import { createContext, useContext, useState } from 'react'
import { useTheme } from 'next-themes'

interface A11yContextType {
  highContrast: boolean
  toggleHighContrast: () => void
  fontSize: number
  increaseFontSize: () => void
  decreaseFontSize: () => void
  reduceMotion: boolean
  toggleReduceMotion: () => void
}

const A11yContext = createContext<A11yContextType | undefined>(undefined)

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [reduceMotion, setReduceMotion] = useState(false)

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev)
    setTheme(highContrast ? 'default' : 'high-contrast')
  }

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 24))
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12))
  const toggleReduceMotion = () => setReduceMotion((prev) => !prev)

  return (
    <A11yContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        reduceMotion,
        toggleReduceMotion,
      }}
    >
      <div
        style={{
          fontSize: `${fontSize}px`,
        }}
        className={`${reduceMotion ? 'motion-reduce' : ''} ${
          highContrast ? 'contrast-high' : ''
        }`}
      >
        {children}
      </div>
    </A11yContext.Provider>
  )
}

export const useA11y = () => {
  const context = useContext(A11yContext)
  if (context === undefined) {
    throw new Error('useA11y must be used within an A11yProvider')
  }
  return context
} 
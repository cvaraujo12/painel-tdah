import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function Loading({ className, size = 'md', text }: LoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-2 p-4',
        className
      )}
      role="status"
      aria-label="Carregando..."
    >
      <Loader2 className={cn('animate-spin', sizeMap[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="h-8 bg-muted rounded-md animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded-md animate-pulse w-5/6" />
        <div className="h-4 bg-muted rounded-md animate-pulse w-4/6" />
      </div>
    </div>
  )
} 
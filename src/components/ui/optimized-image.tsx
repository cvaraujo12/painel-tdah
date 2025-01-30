import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string
  fallback?: string
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  fallback = '/images/placeholder.webp',
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        loading="lazy"
        placeholder="blur"
        blurDataURL={fallback}
        quality={90}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="transition-opacity duration-300"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = fallback
        }}
        {...props}
      />
    </div>
  )
} 
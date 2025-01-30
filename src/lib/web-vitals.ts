import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals'
import { monitoring } from './monitoring'

export function reportWebVitals() {
  onCLS((metric) => {
    monitoring.trackPerformance({
      name: 'CLS',
      value: metric.value,
      tags: {
        id: metric.id,
        navigationType: metric.navigationType,
      },
    })
  })

  onFID((metric) => {
    monitoring.trackPerformance({
      name: 'FID',
      value: metric.value,
      tags: {
        id: metric.id,
        navigationType: metric.navigationType,
      },
    })
  })

  onLCP((metric) => {
    monitoring.trackPerformance({
      name: 'LCP',
      value: metric.value,
      tags: {
        id: metric.id,
        navigationType: metric.navigationType,
      },
    })
  })

  onTTFB((metric) => {
    monitoring.trackPerformance({
      name: 'TTFB',
      value: metric.value,
      tags: {
        id: metric.id,
        navigationType: metric.navigationType,
      },
    })
  })
}

export function optimizeImages(images: HTMLImageElement[]) {
  images.forEach((img) => {
    if (!img.loading) img.loading = 'lazy'
    if (!img.decoding) img.decoding = 'async'
    if (img.src && !img.srcset) {
      const srcset = generateSrcSet(img.src)
      if (srcset) img.srcset = srcset
    }
  })
}

function generateSrcSet(src: string): string | null {
  if (!src.match(/\.(jpg|jpeg|png|webp)$/i)) return null

  const sizes = [640, 750, 828, 1080, 1200, 1920]
  return sizes
    .map((size) => `${src}?w=${size} ${size}w`)
    .join(', ')
} 
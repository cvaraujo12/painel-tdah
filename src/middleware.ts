import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { log } from '@/lib/logger'

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password']
const RATE_LIMIT_REQUESTS = 100
const RATE_LIMIT_WINDOW = '1 m'

// Cria limitador de taxa com Redis apenas em produção
let ratelimit: Ratelimit | null = null

if (process.env.NODE_ENV === 'production' && 
    process.env.UPSTASH_REDIS_REST_URL && 
    process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW),
  })
}

export async function middleware(request: NextRequest) {
  try {
    const ip = request.ip ?? '127.0.0.1'

    // Aplica rate limiting apenas em produção
    if (ratelimit) {
      const { success, limit, reset, remaining } = await ratelimit.limit(
        `ratelimit_${ip}`
      )

      if (!success) {
        log.warn('Rate limit excedido', { ip })
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        })
      }
    }

    const token = await getToken({ req: request })
    const { pathname } = request.nextUrl

    // Verifica se é uma rota pública
    if (PUBLIC_PATHS.includes(pathname)) {
      if (token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return NextResponse.next()
    }

    // Verifica autenticação para rotas protegidas
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Adiciona headers de segurança
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    )

    // Adiciona headers de rate limit se disponível
    if (ratelimit) {
      const { limit, remaining, reset } = await ratelimit.limit(`ratelimit_${ip}`)
      response.headers.set('X-RateLimit-Limit', limit.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())
      response.headers.set('X-RateLimit-Reset', reset.toString())
    }

    return response
  } catch (error) {
    log.error('Erro no middleware', { error })
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

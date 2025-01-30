import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
})

export function validateEnv() {
  try {
    const env = envSchema.parse(process.env)
    return { env, success: true as const }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => err.path.join('.'))
        .join(', ')
      console.error(
        `❌ Variáveis de ambiente inválidas ou faltando: ${missingVars}`
      )
      return {
        success: false as const,
        error: `Configuração inválida: ${missingVars}`,
      }
    }
    return {
      success: false as const,
      error: 'Erro ao validar variáveis de ambiente',
    }
  }
} 
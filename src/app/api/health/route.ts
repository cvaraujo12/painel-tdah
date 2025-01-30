import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateEnv } from '@/lib/env'

export async function GET() {
  try {
    // Valida variáveis de ambiente
    const envValidation = validateEnv()
    if (!envValidation.success) {
      return NextResponse.json(
        {
          status: 'error',
          checks: {
            env: { status: 'failed', error: envValidation.error },
          },
        },
        { status: 500 }
      )
    }

    // Verifica conexão com banco de dados
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: { status: 'healthy' },
        env: { status: 'healthy' },
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        checks: {
          database: {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Database error',
          },
        },
      },
      { status: 500 }
    )
  }
} 
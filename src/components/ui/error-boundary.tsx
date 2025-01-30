'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card'
import { monitoring } from '@/lib/monitoring'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    monitoring.captureError({
      message: error.message,
      stack: error.stack,
      context: {
        componentStack: errorInfo.componentStack,
      },
    })
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle>Algo deu errado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ocorreu um erro inesperado. Nossa equipe foi notificada e está
              trabalhando na solução.
            </p>
            {this.state.error && (
              <pre className="mt-4 p-4 bg-muted rounded-md text-xs overflow-auto">
                {this.state.error.message}
              </pre>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={this.handleReset}>Tentar novamente</Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
} 
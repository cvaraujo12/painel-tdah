import { Analytics } from '@vercel/analytics/react';
import * as Sentry from '@sentry/nextjs';

interface ErrorEvent {
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  tags?: Record<string, string>;
}

class Monitoring {
  private static instance: Monitoring;

  private constructor() {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV,
      });
    }
  }

  public static getInstance(): Monitoring {
    if (!Monitoring.instance) {
      Monitoring.instance = new Monitoring();
    }
    return Monitoring.instance;
  }

  public captureError(error: Error | ErrorEvent): void {
    console.error(error);
    
    if (process.env.NODE_ENV === 'production') {
      if (error instanceof Error) {
        Sentry.captureException(error);
      } else {
        Sentry.captureMessage(error.message, {
          extra: {
            ...error.context,
            stack: error.stack,
          },
        });
      }
    }
  }

  public trackPerformance(metric: PerformanceMetric): void {
    if (process.env.NODE_ENV === 'production') {
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `${metric.name}: ${metric.value}ms`,
        data: metric.tags,
      });
    }
  }

  public AnalyticsProvider({ children }: { children: React.ReactNode }) {
    if (process.env.NODE_ENV === 'production') {
      return <Analytics>{children}</Analytics>;
    }
    return <>{children}</>;
  }
}

export const monitoring = Monitoring.getInstance(); 
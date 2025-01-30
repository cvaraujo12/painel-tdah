
interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffFactor: number;
}

const defaultConfig: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffFactor: 2
};

type SupabaseResponse<T> = PostgrestResponse<T> | PostgrestSingleResponse<T>;

export async function withRetry<T>(
  operation: () => Promise<SupabaseResponse<T>> | PostgrestFilterBuilder<T>,
  config: Partial<RetryConfig> = {}
): Promise<SupabaseResponse<T>> {
  const finalConfig = { ...defaultConfig, ...config };
  let lastError: Error;
  let attempt = 0;

  while (attempt < finalConfig.maxAttempts) {
    try {
      const result = await operation();
      if ('error' in result && result.error) {
        throw result.error;
      }
      return result as SupabaseResponse<T>;
    } catch (error) {
      lastError = error as Error;
      attempt++;

      if (attempt === finalConfig.maxAttempts) {
        break;
      }

      // Exponential backoff
      const delay = finalConfig.delayMs * Math.pow(finalConfig.backoffFactor, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
} 
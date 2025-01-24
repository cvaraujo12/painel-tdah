export interface CacheConfig {
  duration: number;
  maxSize?: number;
}

export const cacheConfigs: Record<string, CacheConfig> = {
  tasks: {
    duration: 5 * 60 * 1000, // 5 minutos
    maxSize: 1000 // máximo de 1000 itens em cache
  },
  notes: {
    duration: 10 * 60 * 1000, // 10 minutos
    maxSize: 500
  },
  goals: {
    duration: 15 * 60 * 1000, // 15 minutos
    maxSize: 200
  }
}; 
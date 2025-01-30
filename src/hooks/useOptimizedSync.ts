import { useState, useEffect, useCallback } from 'react';
import { Task, TaskInput, TaskUpdate } from '@/types/Task';
import { useAuth } from '@/hooks/useAuth';
import { cacheConfigs } from '@/config/cache';
import { withRetry } from '@/utils/retry';
import { offlineQueue } from '@/utils/offlineQueue';
import { storage } from '@/lib/storage';

interface CacheItem<T> {
  data: T[];
  timestamp: number;
}

interface SyncOptions<T> {
  cacheTime?: number;
  sortBy?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

const cache: Record<string, CacheItem<any>> = {};

export function useOptimizedSync<T extends Task>(
  table: 'tasks' | 'notes' | 'mood_entries',
  options: SyncOptions<T> = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      const cacheKey = `${table}_${user.id}_${JSON.stringify(options)}`;
      const now = Date.now();
      const cachedData = cache[cacheKey];
      const cacheConfig = cacheConfigs[table] || { duration: 5 * 60 * 1000 };

      if (cachedData && now - cachedData.timestamp < cacheConfig.duration) {
        setData(cachedData.data);
        setLoading(false);
        return;
      }

      const items = await storage.query<T>(table, user.id);
      let sortedData = [...items];

      if (options.sortBy) {
        sortedData.sort((a, b) => {
          const aValue = a[options.sortBy!];
          const bValue = b[options.sortBy!];
          
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return options.sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
          }
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return options.sortDirection === 'desc' 
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          }
          
          return 0;
        });
      }

      cache[cacheKey] = {
        data: sortedData,
        timestamp: now
      };

      setData(sortedData);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [table, options, user]);

  const add = useCallback(async (item: TaskInput) => {
    if (!user) {
      setError(new Error('Usuário não autenticado'));
      return;
    }

    if (!navigator.onLine) {
      offlineQueue.addOperation({
        table,
        type: 'insert',
        data: { ...item, user_id: user.id }
      });
      return;
    }

    try {
      const newItem = await storage.insert<T>(table, item as Partial<T>, user.id);
      setData(prev => [...prev, newItem]);
      await loadData();
    } catch (err) {
      setError(err as Error);
    }
  }, [table, loadData, user]);

  const update = useCallback(async (id: string, updates: TaskUpdate) => {
    if (!user) {
      setError(new Error('Usuário não autenticado'));
      return;
    }

    if (!navigator.onLine) {
      offlineQueue.addOperation({
        table,
        type: 'update',
        data: { id, updates, user_id: user.id }
      });
      return;
    }

    try {
      const updatedItem = await storage.update<T>(table, id, updates as Partial<T>);
      if (updatedItem) {
        setData(prev => prev.map(item => 
          item.id === id ? updatedItem : item
        ));
      }
      await loadData();
    } catch (err) {
      setError(err as Error);
    }
  }, [table, loadData, user]);

  const remove = useCallback(async (id: string) => {
    if (!user) {
      setError(new Error('Usuário não autenticado'));
      return;
    }

    if (!navigator.onLine) {
      offlineQueue.addOperation({
        table,
        type: 'delete',
        data: { id, user_id: user.id }
      });
      return;
    }

    try {
      await storage.delete(table, id);
      setData(prev => prev.filter(item => item.id !== id));
      await loadData();
    } catch (err) {
      setError(err as Error);
    }
  }, [table, loadData, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    add,
    update,
    remove
  };
} 
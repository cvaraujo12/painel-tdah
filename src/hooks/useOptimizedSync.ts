import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Task, TaskInput, TaskUpdate } from '@/types/Task';
import { useAuth } from '@/hooks/useAuth';
import { cacheConfigs } from '@/config/cache';
import { withRetry } from '@/utils/retry';
import { offlineQueue } from '@/utils/offlineQueue';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

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
  table: string,
  options: SyncOptions<T> = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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

      const result = await withRetry<T[]>(() => 
        supabase
          .from(table)
          .select('*')
          .eq('user_id', user.id)
      );

      if (!result.data) {
        throw new Error('Nenhum dado retornado');
      }

      const items = result.data as T[];
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

      if (cacheConfig.maxSize && sortedData.length > cacheConfig.maxSize) {
        sortedData = sortedData.slice(0, cacheConfig.maxSize);
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
  }, [table, options, supabase, user]);

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
      const result = await withRetry<T>(() =>
        supabase
          .from(table)
          .insert([{ ...item, user_id: user.id }])
          .select()
          .single()
      );

      if (!result.data) {
        throw new Error('Erro ao adicionar item');
      }

      const newItem = result.data as T;
      setData(prev => [...prev, newItem]);
      await loadData();
    } catch (err) {
      setError(err as Error);
    }
  }, [table, supabase, loadData, user]);

  const update = useCallback(async (id: number, updates: TaskUpdate) => {
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
      const result = await withRetry<T>(() =>
        supabase
          .from(table)
          .update(updates)
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()
      );

      if (result.error) throw result.error;

      if (result.data) {
        const updatedItem = result.data as T;
        setData(prev => prev.map(item => 
          item.id === id ? updatedItem : item
        ));
      }
      
      await loadData();
    } catch (err) {
      setError(err as Error);
    }
  }, [table, supabase, loadData, user]);

  const remove = useCallback(async (id: number) => {
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
      const result = await withRetry<T>(() =>
        supabase
          .from(table)
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()
      );

      if (result.error) throw result.error;

      setData(prev => prev.filter(item => item.id !== id));
      await loadData();
    } catch (err) {
      setError(err as Error);
    }
  }, [table, supabase, loadData, user]);

  useEffect(() => {
    loadData();

    if (!user) return;

    const channel = supabase
      .channel(`${table}_changes_${user.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table,
        filter: `user_id=eq.${user.id}`
      }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [table, loadData, supabase, user]);

  return {
    data,
    loading,
    error,
    add,
    update,
    remove
  };
} 
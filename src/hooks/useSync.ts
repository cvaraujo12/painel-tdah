"use client";

import { useCallback, useEffect, useState } from "react";
import { storage, type StorageItem, type TableName } from "@/lib/storage";
import { useAuth } from "./useAuth";

export function useSync<T extends StorageItem>(table: TableName) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) return;
    const items = await storage.query<T>(table, user.id);
    setData(items);
    setIsLoading(false);
  }, [table, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = useCallback(async (item: Partial<T>) => {
    if (!user) return null;
    const newItem = await storage.insert<T>(table, item, user.id);
    setData(prev => [...prev, newItem]);
    return newItem;
  }, [table, user]);

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    const updatedItem = await storage.update<T>(table, id, updates);
    if (updatedItem) {
      setData(prev => prev.map(item => item.id === id ? updatedItem : item));
    }
    return updatedItem;
  }, [table]);

  const remove = useCallback(async (id: string) => {
    const success = await storage.delete(table, id);
    if (success) {
      setData(prev => prev.filter(item => item.id !== id));
    }
    return success;
  }, [table]);

  return {
    data,
    isLoading,
    create,
    update,
    remove,
    refresh: fetchData
  };
} 
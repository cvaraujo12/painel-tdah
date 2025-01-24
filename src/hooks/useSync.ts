import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from './useAuth'

export function useSync<T extends { id: number; user_id: string }>(table: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (user) {
      loadData()
      subscribeToChanges()
    }
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      const { data: result, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user?.id)

      if (error) throw error
      setData(result as T[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const subscribeToChanges = () => {
    const subscription = supabase
      .channel(`public:${table}:user_id=eq.${user?.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: table,
        filter: `user_id=eq.${user?.id}`
      }, payload => {
        if (payload.eventType === 'INSERT') {
          setData(prev => [...prev, payload.new as T])
        } else if (payload.eventType === 'UPDATE') {
          setData(prev => prev.map(item => 
            item.id === payload.new.id ? payload.new as T : item
          ))
        } else if (payload.eventType === 'DELETE') {
          setData(prev => prev.filter(item => item.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const add = async (input: Omit<T, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user?.id) {
      setError('Usuário não autenticado')
      return null
    }

    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([{ ...input, user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      return result as T
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar item')
      return null
    }
  }

  const update = async (id: number, input: Partial<Omit<T, 'id' | 'created_at' | 'updated_at' | 'user_id'>>) => {
    if (!user?.id) {
      setError('Usuário não autenticado')
      return false
    }

    try {
      const { error } = await supabase
        .from(table)
        .update(input)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar item')
      return false
    }
  }

  const remove = async (id: number) => {
    if (!user?.id) {
      setError('Usuário não autenticado')
      return false
    }

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover item')
      return false
    }
  }

  return {
    data,
    loading,
    error,
    add,
    update,
    remove,
  }
} 
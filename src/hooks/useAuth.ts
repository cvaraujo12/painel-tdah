import { storage, auth } from "@/lib/storage";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/storage'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = auth.getCurrentUser()
      setUser(currentUser)
      setLoading(false)

      if (!currentUser) {
        router.push('/auth/login')
      }
    }

    // Verificar autenticação inicial
    checkAuth()

    // Adicionar listener para mudanças de autenticação
    window.addEventListener('storage', (event) => {
      if (event.key === auth['STORAGE_KEY']) {
        checkAuth()
      }
    })

    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [router])

  const signOut = async () => {
    await auth.signOut()
    router.push('/auth/login')
  }

  return {
    user,
    loading,
    signOut
  }
} 
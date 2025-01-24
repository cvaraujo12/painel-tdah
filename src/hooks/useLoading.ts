import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  message: string;
  setLoading: (loading: boolean, message?: string) => void;
}

export const useLoading = create<LoadingState>((set) => ({
  isLoading: false,
  message: '',
  setLoading: (loading: boolean, message: string = '') => set({ isLoading: loading, message }),
}));

export function useLoadingWrapper() {
  const { setLoading } = useLoading();

  const withLoading = async <T>(
    fn: () => Promise<T>,
    message: string = 'Carregando...'
  ): Promise<T> => {
    try {
      setLoading(true, message);
      return await fn();
    } finally {
      setLoading(false, '');
    }
  };

  return { withLoading };
} 
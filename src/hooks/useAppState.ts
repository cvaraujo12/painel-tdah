import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  layout: 'default' | 'compact' | 'comfortable';
  notifications: boolean;
  soundEnabled: boolean;
  lastSync: string | null;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLayout: (layout: 'default' | 'compact' | 'comfortable') => void;
  setNotifications: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setLastSync: (date: string) => void;
}

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      layout: 'default',
      notifications: true,
      soundEnabled: true,
      lastSync: null,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      setLayout: (layout) => set({ layout }),
      setNotifications: (enabled) => set({ notifications: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setLastSync: (date) => set({ lastSync: date }),
    }),
    {
      name: 'app-state',
      partialize: (state) => ({
        theme: state.theme,
        layout: state.layout,
        notifications: state.notifications,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
); 
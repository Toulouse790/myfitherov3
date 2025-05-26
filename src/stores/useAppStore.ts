
import { create } from 'zustand';

// Interface pour l'état global de l'application
interface AppState {
  isLoading: boolean;
  sidebarCollapsed: boolean;
  notifications: any[];
  setLoading: (loading: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Store Zustand pour l'état global de l'application
export const useAppStore = create<AppState>((set, get) => ({
  isLoading: false,
  sidebarCollapsed: false,
  notifications: [],
  setLoading: (loading) => set({ isLoading: loading }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  addNotification: (notification) => 
    set((state) => ({ 
      notifications: [...state.notifications, { 
        id: crypto.randomUUID(), 
        timestamp: Date.now(), 
        ...notification 
      }] 
    })),
  removeNotification: (id) => 
    set((state) => ({ 
      notifications: state.notifications.filter(n => n.id !== id) 
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

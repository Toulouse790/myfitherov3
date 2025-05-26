
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interface pour l'état utilisateur
interface UserState {
  profile: any | null;
  preferences: any | null;
  isOnboardingComplete: boolean;
  setProfile: (profile: any) => void;
  setPreferences: (preferences: any) => void;
  setOnboardingComplete: (complete: boolean) => void;
  clearUser: () => void;
}

// Store Zustand pour l'état utilisateur
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      preferences: null,
      isOnboardingComplete: false,
      setProfile: (profile) => set({ profile }),
      setPreferences: (preferences) => set({ preferences }),
      setOnboardingComplete: (complete) => set({ isOnboardingComplete: complete }),
      clearUser: () => set({ 
        profile: null, 
        preferences: null, 
        isOnboardingComplete: false 
      }),
    }),
    {
      name: 'user-store',
    }
  )
);


import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/sonner';
import { useUserStore } from '@/stores/useUserStore';
import { ProfileService } from '@/services/supabase/ProfileService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { setProfile, clearUser } = useUserStore();

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session initiale:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Charger le profil utilisateur si connecté
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Changement auth:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Charger le profil après connexion
        await loadUserProfile(session.user.id);
      } else {
        // Nettoyer le store si déconnexion
        clearUser();
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setProfile, clearUser]);

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await ProfileService.getUserProfile(userId);
      if (profile) {
        setProfile({ user_id: userId, ...profile });
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Tentative de connexion pour:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erreur connexion:', error);
      throw new Error(error.message);
    }

    console.log('Connexion réussie:', data);
    toast.success('Connexion réussie', {
      description: 'Bienvenue dans MyFitHero !'
    });
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('Tentative d\'inscription pour:', email, 'avec metadata:', metadata);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      console.error('Erreur inscription:', error);
      throw new Error(error.message);
    }

    console.log('Inscription réussie:', data);
    toast.success('Inscription réussie', {
      description: 'Votre compte a été créé avec succès !'
    });
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      throw new Error(error.message);
    }

    toast.success('Email envoyé', {
      description: 'Vérifiez votre boîte e-mail pour réinitialiser votre mot de passe'
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }

    toast.info('Déconnexion', {
      description: 'À bientôt !'
    });
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGitHub,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

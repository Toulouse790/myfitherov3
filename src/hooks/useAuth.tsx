
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

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('🔄 Chargement du profil pour userId:', userId);
      const profile = await ProfileService.getUserProfile(userId);
      if (profile) {
        console.log('✅ Profil chargé et mis en store:', profile);
        setProfile({ user_id: userId, ...profile });
      } else {
        console.log('ℹ️ Aucun profil trouvé, utilisateur probablement nouveau');
      }
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      // Ne pas faire échouer l'authentification si le profil échoue
    }
  };

  useEffect(() => {
    console.log('🔧 useAuth useEffect: Initialisation de l\'authentification');
    
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Session initiale récupérée:', session ? 'connecté' : 'non connecté');
      setSession(session);
      setUser(session?.user ?? null);
      
      // Charger le profil utilisateur si connecté
      if (session?.user) {
        loadUserProfile(session.user.id).finally(() => {
          console.log('✅ Chargement initial terminé - setLoading(false)');
          setLoading(false);
        });
      } else {
        console.log('✅ Pas d\'utilisateur connecté - setLoading(false)');
        setLoading(false);
      }
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Changement auth détecté:', event, session ? 'avec session' : 'sans session');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Charger le profil après connexion avec gestion d'erreur appropriée
        try {
          await loadUserProfile(session.user.id);
        } catch (error) {
          console.error('❌ Erreur lors du chargement du profil dans onAuthStateChange:', error);
          // Ne pas bloquer l'authentification si le profil échoue
        }
      } else {
        // Nettoyer le store si déconnexion
        console.log('🧹 Nettoyage du store utilisateur (déconnexion)');
        clearUser();
      }
      
      // S'assurer que loading est toujours mis à false à la fin
      console.log('✅ Changement auth traité - setLoading(false)');
      setLoading(false);
    });

    return () => {
      console.log('🧹 Nettoyage de l\'abonnement auth');
      subscription.unsubscribe();
    };
  }, [setProfile, clearUser]);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Tentative de connexion pour:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Erreur connexion:', error);
      throw new Error(error.message);
    }

    console.log('✅ Connexion réussie:', data);
    toast.success('Connexion réussie', {
      description: 'Bienvenue dans MyFitHero !'
    });
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('📝 Tentative d\'inscription pour:', email, 'avec metadata:', metadata);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      console.error('❌ Erreur inscription:', error);
      throw new Error(error.message);
    }

    console.log('✅ Inscription réussie:', data);
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

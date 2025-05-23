
// Service pour la gestion des profils utilisateur
import { supabase } from '@/integrations/supabase/client';
import { BaseService } from './BaseService';

export interface UserProfile {
  first_name?: string;
  last_name?: string;
  birthdate?: string;
  gender?: string;
  country?: string;
  language?: string;
  timezone?: string;
  experience_level?: string;
  frequency?: string;
  main_goal?: string;
  accepted_terms?: boolean;
}

export class ProfileService extends BaseService {
  /**
   * Sauvegarde le profil utilisateur
   */
  static async saveUserProfile(userId: string, profile: UserProfile): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert([{ user_id: userId, ...profile }]);

      if (error) {
        console.error("Erreur enregistrement user_profiles :", error.message);
        return false;
      }

      console.log("Profil utilisateur enregistré avec succès !");
      return true;
    } catch (err) {
      console.error('Exception saveUserProfile:', err);
      return false;
    }
  }

  /**
   * Met à jour le profil utilisateur
   */
  static async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(profile)
        .eq('user_id', userId);

      if (error) {
        console.error("Erreur mise à jour user_profiles :", error.message);
        return false;
      }

      console.log("Profil utilisateur mis à jour avec succès !");
      return true;
    } catch (err) {
      console.error('Exception updateUserProfile:', err);
      return false;
    }
  }

  /**
   * Récupère le profil utilisateur
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Erreur récupération user_profiles :", error.message);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Exception getUserProfile:', err);
      return null;
    }
  }
}

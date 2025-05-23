
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
      // Mapper les données vers la structure de la table profiles
      const profileData = {
        id: userId,
        username: profile.first_name ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}` : undefined,
        birth_date: profile.birthdate ? new Date(profile.birthdate).toISOString().split('T')[0] : undefined,
        gender: profile.gender,
        experience_level: profile.experience_level,
        training_frequency: profile.frequency,
        main_objective: profile.main_goal,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert([profileData], { onConflict: 'id' });

      if (error) {
        console.error("Erreur enregistrement profil :", error.message);
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
      // Mapper les données vers la structure de la table profiles
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (profile.first_name || profile.last_name) {
        updateData.username = `${profile.first_name || ''}${profile.last_name ? ' ' + profile.last_name : ''}`.trim();
      }
      if (profile.birthdate) {
        updateData.birth_date = new Date(profile.birthdate).toISOString().split('T')[0];
      }
      if (profile.gender) {
        updateData.gender = profile.gender;
      }
      if (profile.experience_level) {
        updateData.experience_level = profile.experience_level;
      }
      if (profile.frequency) {
        updateData.training_frequency = profile.frequency;
      }
      if (profile.main_goal) {
        updateData.main_objective = profile.main_goal;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error("Erreur mise à jour profil :", error.message);
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
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Erreur récupération profil :", error.message);
        return null;
      }

      if (!data) return null;

      // Mapper les données de la table profiles vers UserProfile
      return {
        first_name: data.username?.split(' ')[0] || undefined,
        last_name: data.username?.split(' ').slice(1).join(' ') || undefined,
        birthdate: data.birth_date || undefined,
        gender: data.gender || undefined,
        experience_level: data.experience_level || undefined,
        frequency: data.training_frequency || undefined,
        main_goal: data.main_objective || undefined,
        accepted_terms: true // Assumé vrai si le profil existe
      };
    } catch (err) {
      console.error('Exception getUserProfile:', err);
      return null;
    }
  }
}

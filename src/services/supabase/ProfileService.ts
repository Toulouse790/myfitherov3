
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
      // Préparer les données pour la table user_profiles
      const profileData = {
        user_id: userId,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: '', // Sera rempli par l'auth
        age: profile.birthdate ? this.calculateAge(profile.birthdate) : null,
        gender: profile.gender,
        experience_level: profile.experience_level,
        frequency: profile.frequency,
        main_goal: profile.main_goal,
        timezone: profile.timezone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Utiliser upsert pour gérer les doublons éventuels
      const { error } = await supabase
        .from('user_profiles' as any)
        .upsert([profileData], { onConflict: 'user_id' });

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
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (profile.first_name) updateData.first_name = profile.first_name;
      if (profile.last_name) updateData.last_name = profile.last_name;
      if (profile.birthdate) updateData.age = this.calculateAge(profile.birthdate);
      if (profile.gender) updateData.gender = profile.gender;
      if (profile.experience_level) updateData.experience_level = profile.experience_level;
      if (profile.frequency) updateData.frequency = profile.frequency;
      if (profile.main_goal) updateData.main_goal = profile.main_goal;
      if (profile.timezone) updateData.timezone = profile.timezone;

      const { error } = await supabase
        .from('user_profiles' as any)
        .update(updateData)
        .eq('user_id', userId);

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
        .from('user_profiles' as any)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Erreur récupération profil :", error.message);
        return null;
      }

      if (!data) return null;

      // Mapper les données vers UserProfile
      return {
        first_name: data.first_name || undefined,
        last_name: data.last_name || undefined,
        birthdate: data.age ? this.ageToApproximateBirthdate(data.age) : undefined,
        gender: data.gender || undefined,
        experience_level: data.experience_level || undefined,
        frequency: data.frequency || undefined,
        main_goal: data.main_goal || undefined,
        timezone: data.timezone || undefined,
        accepted_terms: true // Assumé vrai si le profil existe
      };
    } catch (err) {
      console.error('Exception getUserProfile:', err);
      return null;
    }
  }

  /**
   * Calcule l'âge à partir de la date de naissance
   */
  private static calculateAge(birthdate: string): number {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Estime une date de naissance approximative à partir de l'âge
   */
  private static ageToApproximateBirthdate(age: number): string {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return `${birthYear}-01-01`;
  }
}

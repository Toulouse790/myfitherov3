
// Service pour la gestion des profils utilisateur
import { supabase } from '@/integrations/supabase/client';
import { BaseService } from './BaseService';
import { ApiService } from '@/services/api';

export interface UserProfile {
  first_name?: string;
  last_name?: string;
  email?: string;
  birthdate?: string;
  gender?: string;
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  timezone?: string;
  experience_level?: string;
  frequency?: string;
  main_goal?: string;
  accepted_terms?: boolean;
}

// Interface pour la table user_profiles
interface UserProfileData {
  id?: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  age?: number;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}

export class ProfileService extends BaseService {
  /**
   * Met à jour le profil utilisateur avec les données d'onboarding
   */
  static async updateUserProfile(userId: string, profileData: UserProfile): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const updateData: Partial<UserProfileData> = {
        user_id: userId,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        age: profileData.age || (profileData.birthdate ? this.calculateAge(profileData.birthdate) : undefined),
        gender: profileData.gender,
        height_cm: profileData.height_cm,
        weight_kg: profileData.weight_kg,
        timezone: profileData.timezone,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(updateData)
        .select()
        .single();

      if (error) {
        console.error('Erreur mise à jour profil:', error);
        throw error;
      }

      // Envoyer les données à n8n après succès
      await this.sendToN8N(data);

      return { success: true, data };
    } catch (error) {
      console.error('Erreur ProfileService:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  /**
   * Sauvegarde le profil utilisateur (alias pour compatibilité)
   */
  static async saveUserProfile(userId: string, profile: UserProfile): Promise<boolean> {
    const result = await this.updateUserProfile(userId, profile);
    return result.success;
  }

  /**
   * Récupère le profil utilisateur complet
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Erreur récupération profil :", error.message);
        return null;
      }

      if (!data) return null;

      // Mapper les données vers UserProfile
      const profileData = data as UserProfileData;
      return {
        first_name: profileData.first_name || undefined,
        last_name: profileData.last_name || undefined,
        email: profileData.email || undefined,
        birthdate: profileData.age ? this.ageToApproximateBirthdate(profileData.age) : undefined,
        gender: profileData.gender || undefined,
        age: profileData.age || undefined,
        height_cm: profileData.height_cm || undefined,
        weight_kg: profileData.weight_kg || undefined,
        timezone: profileData.timezone || undefined,
        accepted_terms: true // Assumé vrai si le profil existe
      };
    } catch (err) {
      console.error('Exception getUserProfile:', err);
      return null;
    }
  }

  /**
   * Envoie les données vers n8n
   */
  private static async sendToN8N(profileData: UserProfileData): Promise<void> {
    try {
      const payload = {
        type: 'profile_updated',
        userId: profileData.user_id,
        data: profileData,
        timestamp: new Date().toISOString()
      };

      const response = await ApiService.sendToN8n(payload);

      if (response.success) {
        console.log('✅ Profil envoyé vers n8n avec succès');
      } else {
        console.warn('Échec envoi vers n8n:', response.error);
      }
    } catch (error) {
      console.warn('Erreur envoi n8n:', error);
      // Ne pas faire échouer la mise à jour du profil si n8n échoue
    }
  }

  /**
   * Log d'interaction utilisateur
   */
  static async logInteraction(userId: string, action: string, metadata: Record<string, any> = {}): Promise<void> {
    try {
      await supabase
        .from('ai_training_data')
        .insert({
          user_id: userId,
          action_type: action,
          context: metadata,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.warn('Erreur log interaction:', error);
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

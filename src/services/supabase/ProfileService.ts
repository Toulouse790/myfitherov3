
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

      // Utiliser une requête SQL brute pour éviter les problèmes de types TypeScript
      const { data, error } = await supabase.rpc('upsert_user_profile', {
        p_user_id: userId,
        p_first_name: updateData.first_name,
        p_last_name: updateData.last_name,
        p_email: updateData.email,
        p_age: updateData.age,
        p_gender: updateData.gender,
        p_height_cm: updateData.height_cm,
        p_weight_kg: updateData.weight_kg,
        p_timezone: updateData.timezone
      });

      if (error) {
        console.error('Erreur mise à jour profil:', error);
        // Fallback vers une approche directe si la fonction n'existe pas
        return await this.fallbackUpdateProfile(userId, updateData);
      }

      // Envoyer les données à n8n après succès
      await this.sendToN8N({ user_id: userId, ...updateData });

      return { success: true, data };
    } catch (error) {
      console.error('Erreur ProfileService:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  /**
   * Méthode de fallback utilisant une requête SQL directe
   */
  private static async fallbackUpdateProfile(userId: string, updateData: Partial<UserProfileData>): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Construire la requête d'upsert manuellement
      const columns = Object.keys(updateData).filter(key => updateData[key as keyof UserProfileData] !== undefined);
      const values = columns.map(col => updateData[col as keyof UserProfileData]);
      
      // Utiliser une requête SQL brute
      const query = `
        INSERT INTO user_profiles (user_id, ${columns.join(', ')})
        VALUES ($1, ${columns.map((_, i) => `$${i + 2}`).join(', ')})
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          ${columns.map((col, i) => `${col} = $${i + 2}`).join(', ')},
          updated_at = NOW()
        RETURNING *;
      `;

      const { data, error } = await supabase.rpc('exec_sql', {
        query: query,
        params: [userId, ...values]
      });

      if (error) {
        console.error('Erreur fallback:', error);
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erreur fallback ProfileService:', error);
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
      // Utiliser une requête SQL brute pour éviter les problèmes de types
      const { data, error } = await supabase.rpc('get_user_profile', {
        p_user_id: userId
      });

      if (error) {
        console.error("Erreur récupération profil :", error.message);
        // Fallback vers une approche directe
        return await this.fallbackGetProfile(userId);
      }

      if (!data || data.length === 0) return null;

      const profileData = data[0];
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
   * Méthode de fallback pour récupérer le profil
   */
  private static async fallbackGetProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        query: 'SELECT * FROM user_profiles WHERE user_id = $1',
        params: [userId]
      });

      if (error || !data || data.length === 0) {
        console.error("Erreur fallback récupération profil :", error?.message);
        return null;
      }

      const profileData = data[0];
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
        accepted_terms: true
      };
    } catch (err) {
      console.error('Exception fallback getUserProfile:', err);
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
      await supabase.rpc('exec_sql', {
        query: `
          INSERT INTO ai_training_data (user_id, action_type, context, created_at)
          VALUES ($1, $2, $3, NOW())
        `,
        params: [userId, action, JSON.stringify(metadata)]
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

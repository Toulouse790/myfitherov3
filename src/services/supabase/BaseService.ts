
// Service de base avec fonctionnalités communes
import { supabase } from '@/integrations/supabase/client';

// Configuration pour l'API externe
export const API_CONFIG = {
  // Utilisez l'URL de l'API fournie dans l'environnement ou utilisez une valeur par défaut
  EXTERNAL_API_URL: import.meta.env.VITE_EXTERNAL_API_URL || 'https://api.lovable.ai/receive-synthese',
  ENABLE_EXTERNAL_API: import.meta.env.VITE_ENABLE_EXTERNAL_API === 'true' || false
};

export class BaseService {
  /**
   * Teste la connexion à Supabase
   */
  static async testConnection(): Promise<boolean> {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Erreur d\'authentification Supabase:', authError);
        return false;
      }
      
      // Tenter une requête simple sur une table disponible (user_profiles)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id')
        .limit(1);
        
      if (error) {
        console.error('Erreur de connexion Supabase:', error);
        return false;
      }
      
      console.log('Connexion Supabase OK:', data);
      return true;
    } catch (err) {
      console.error('Exception connexion Supabase:', err);
      return false;
    }
  }

  /**
   * Envoie des données à une API externe
   * @param payload Données à envoyer
   */
  static async sendToExternalAPI(payload: any): Promise<boolean> {
    try {
      console.log(`📤 Envoi de données vers API externe: ${API_CONFIG.EXTERNAL_API_URL}`, payload);
      
      const response = await fetch(API_CONFIG.EXTERNAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Ajoutez ici votre token d'authentification si nécessaire
          'Authorization': `Bearer ${import.meta.env.VITE_LOVABLE_API_KEY || ''}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        console.error(`❌ Erreur API externe: ${response.status} ${response.statusText}`);
        return false;
      }
      
      console.log('✅ Données envoyées avec succès à l\'API externe');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi à l\'API externe:', error);
      return false;
    }
  }
}

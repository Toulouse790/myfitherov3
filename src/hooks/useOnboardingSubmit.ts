
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProfileService } from '@/services/supabase/ProfileService';
import { StorageService } from '@/services/storage';
import { useToast } from '@/hooks/use-toast';

interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  birthdate: string;
  gender: string;
  height: string;
  weight: string;
  experienceLevel: string;
  frequency: string;
  mainGoal: string;
  [key: string]: any;
}

export const useOnboardingSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const calculateAge = (birthdate: string): number => {
    if (!birthdate) return 0;
    
    const birthdateDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthdateDate.getFullYear();
    const monthDiff = today.getMonth() - birthdateDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const submitOnboarding = async (userData: OnboardingData) => {
    setIsSubmitting(true);
    
    try {
      const age = calculateAge(userData.birthdate);

      const enrichedData = {
        ...userData,
        age,
        calculatedAt: new Date().toISOString(),
        platform: navigator.userAgent,
        onboarding_completed: true,
        terms_accepted: true,
        privacy_accepted: true
      };

      // Sauvegarder localement
      StorageService.setItem('userProfile', enrichedData);

      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.id) {
        // Préparer les données du profil
        const profileData = {
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          birthdate: userData.birthdate,
          gender: userData.gender,
          age: age,
          height_cm: parseInt(userData.height) || undefined,
          weight_kg: parseFloat(userData.weight) || undefined,
          experience_level: userData.experienceLevel,
          frequency: userData.frequency,
          main_goal: userData.mainGoal,
          accepted_terms: true
        };

        // Sauvegarder le profil dans Supabase
        const result = await ProfileService.updateUserProfile(user.id, profileData);

        if (result.success) {
          // Logger la completion de l'onboarding avec les flags corrects
          await ProfileService.logInteraction(user.id, 'onboarding_completed', {
            steps_completed: 4,
            profile_data: profileData,
            completion_time: new Date().toISOString(),
            onboarding_completed: true,
            terms_accepted: true,
            privacy_accepted: true,
            platform: navigator.userAgent,
            user_agent: navigator.userAgent
          });

          toast({
            description: "Votre profil personnalisé a été enregistré avec succès!"
          });

          // Rediriger vers le dashboard après un court délai
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          throw new Error(result.error || 'Erreur lors de la sauvegarde');
        }
      } else {
        throw new Error('Utilisateur non connecté');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'onboarding:', error);
      toast({
        description: "Erreur lors de l'enregistrement. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOnboarding,
    isSubmitting
  };
};

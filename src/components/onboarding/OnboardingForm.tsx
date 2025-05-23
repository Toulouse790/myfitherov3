
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import ProgressBar from './ProgressBar';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2Measurements from './Step2Measurements';
import Step3Goals from './Step3Goals';
import Step4Preferences from './Step4Preferences';
import { UserData, OnboardingFormProps } from './types';
import { calculateAge } from './utils';
import { StorageService } from '@/services/storage';
import { ApiService } from '@/services/api';
import { ProfileService } from '@/services/supabase/ProfileService';

const OnboardingForm: React.FC<OnboardingFormProps> = ({ initialStep = 1 }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    gender: "male",
    pseudo: "",
    height: "",
    weight: "",
    experienceLevel: "intermediate",
    frequency: "3-4",
    mainGoal: "strength",
    sports: [],
    availableDays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    equipment: {
      home: true,
      gym: true
    },
    dietaryRestrictions: [],
    notifications: true
  });

  const handleInputChange = (field: string, value: any) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, item: string, checked: boolean) => {
    setUserData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), item]
        : (prev[field as keyof typeof prev] as string[]).filter(i => i !== item)
    }));
  };

  const handleNestedChange = (field: string, key: string, value: boolean) => {
    setUserData((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field as keyof typeof prev] as Record<string, boolean>),
        [key]: value
      }
    }));
  };

  const handleDayChange = (day: string, checked: boolean) => {
    setUserData(prev => ({
      ...prev,
      availableDays: checked
        ? [...prev.availableDays, day]
        : prev.availableDays.filter(d => d !== day)
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      const age = calculateAge(userData.birthdate);

      const enrichedData = {
        ...userData,
        age,
        calculatedAt: new Date().toISOString(),
        platform: navigator.userAgent
      };

      try {
        // Sauvegarder localement avec notre service
        StorageService.setItem('userProfile', enrichedData);

        // Récupérer l'utilisateur connecté
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.id) {
          // Sauvegarder le profil dans Supabase
          const profileData = {
            first_name: userData.firstName,
            last_name: userData.lastName,
            birthdate: userData.birthdate,
            gender: userData.gender,
            experience_level: userData.experienceLevel,
            frequency: userData.frequency,
            main_goal: userData.mainGoal,
            accepted_terms: true
          };

          await ProfileService.saveUserProfile(user.id, profileData);
        }

        // Envoyer à n8n via notre service API
        const response = await ApiService.sendToN8n(enrichedData);

        toast({
          description: response.success
            ? "Votre profil personnalisé a été enregistré!"
            : "Votre profil a été enregistré localement. La synchronisation sera tentée ultérieurement."
        });

        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du profil:', error);
        toast({
          description: "Erreur lors de l'enregistrement. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Bienvenue sur MyFitHero</CardTitle>
        <CardDescription>
          Créez votre profil personnalisé pour obtenir un programme sur mesure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressBar currentStep={currentStep} totalSteps={4} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <Step1PersonalInfo userData={userData} handleInputChange={handleInputChange} />
          )}
          {currentStep === 2 && (
            <Step2Measurements userData={userData} handleInputChange={handleInputChange} />
          )}
          {currentStep === 3 && (
            <Step3Goals userData={userData} handleInputChange={handleInputChange} handleArrayChange={handleArrayChange} />
          )}
          {currentStep === 4 && (
            <Step4Preferences userData={userData} handleInputChange={handleInputChange} handleArrayChange={handleArrayChange} handleNestedChange={handleNestedChange} handleDayChange={handleDayChange} />
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Button
          variant="outline"
          onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1 || isSubmitting}
        >
          Précédent
        </Button>
        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Traitement en cours..." : currentStep < 4 ? "Continuer" : "Terminer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingForm;

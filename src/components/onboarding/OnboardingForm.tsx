import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import ProgressBar from './ProgressBar';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2Measurements from './Step2Measurements';
import Step3Goals from './Step3Goals';
import Step4Preferences from './Step4Preferences';
import { UserData, OnboardingFormProps } from './types';
import { useOnboardingSubmit } from '@/hooks/useOnboardingSubmit';

const OnboardingForm: React.FC<OnboardingFormProps> = ({ initialStep = 1 }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const { submitOnboarding, isSubmitting } = useOnboardingSubmit();

  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    gender: "male",
    pseudo: "",
    timezone: "", // Initialisé vide, sera détecté automatiquement
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
      await submitOnboarding(userData);
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

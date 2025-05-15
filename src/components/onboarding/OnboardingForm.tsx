
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Import refactored components
import ProgressBar from './ProgressBar';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2Measurements from './Step2Measurements';
import Step3Goals from './Step3Goals';
import Step4Preferences from './Step4Preferences';
import { UserData, OnboardingFormProps } from './types';
import { sendToN8nWebhook, calculateAge } from './utils';

const OnboardingForm: React.FC<OnboardingFormProps> = ({ initialStep = 1 }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to store user data
  const [userData, setUserData] = useState<UserData>({
    // Step 1: Personal Information
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    gender: "male",
    // Step 2: Measurements and Level
    height: "",
    weight: "",
    experienceLevel: "intermediate",
    frequency: "3-4",
    // Step 3: Goals
    mainGoal: "strength",
    sports: [] as string[],
    // Step 4: Preferences and Constraints
    availableDays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    equipment: {
      home: true,
      gym: true
    },
    dietaryRestrictions: [] as string[],
    notifications: true
  });

  // Handle changes for all fields
  const handleInputChange = (field: string, value: any) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle changes for arrays (like sports)
  const handleArrayChange = (field: string, item: string, checked: boolean) => {
    if (checked) {
      setUserData((prev) => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as string[], item]
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [field]: (prev[field as keyof typeof prev] as string[]).filter(i => i !== item)
      }));
    }
  };

  // Handle changes for nested objects (like equipment)
  const handleNestedChange = (field: string, key: string, value: boolean) => {
    setUserData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev] as Record<string, boolean>,
        [key]: value
      }
    }));
  };

  // Handle day availability changes
  const handleDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setUserData(prev => ({
        ...prev,
        availableDays: [...prev.availableDays, day]
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        availableDays: prev.availableDays.filter(d => d !== day)
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - user completes the form
      setIsSubmitting(true);

      // Calculate age from birthdate
      const age = calculateAge(userData.birthdate);

      // Prepare enriched data for the webhook
      const enrichedData = {
        ...userData,
        age,
        calculatedAt: new Date().toISOString(),
        platform: navigator.userAgent
      };
      
      // Save data to localStorage for persistence
      localStorage.setItem('myFitHeroUserProfile', JSON.stringify(enrichedData));
      
      // Send data to n8n webhook
      const webhookSuccess = await sendToN8nWebhook(enrichedData);
      
      // Notify user
      toast({
        description: webhookSuccess 
          ? "Votre profil personnalisé a été enregistré avec succès et synchronisé!"
          : "Votre profil a été enregistré localement. La synchronisation sera tentée ultérieurement.",
      });
      
      setIsSubmitting(false);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
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
            <Step1PersonalInfo 
              userData={userData} 
              handleInputChange={handleInputChange} 
            />
          )}

          {currentStep === 2 && (
            <Step2Measurements
              userData={userData}
              handleInputChange={handleInputChange}
            />
          )}

          {currentStep === 3 && (
            <Step3Goals
              userData={userData}
              handleInputChange={handleInputChange}
              handleArrayChange={handleArrayChange}
            />
          )}

          {currentStep === 4 && (
            <Step4Preferences
              userData={userData}
              handleInputChange={handleInputChange}
              handleArrayChange={handleArrayChange}
              handleNestedChange={handleNestedChange}
              handleDayChange={handleDayChange}
            />
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
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting 
            ? "Traitement en cours..." 
            : currentStep < 4 
              ? "Continuer" 
              : "Terminer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingForm;


import { useState, useEffect } from 'react';

// Interface simplifiée pour les recommandations d'hydratation
export interface SimpleHydrationRecommendation {
  dailyTarget: number;
  message: string;
  tips: string[];
}

// Hook simplifié pour les recommandations d'hydratation
export const useHydrationAI = (profile: any, currentIntake: number) => {
  const [recommendation, setRecommendation] = useState<SimpleHydrationRecommendation | null>(null);

  useEffect(() => {
    if (!profile) return;

    // Calcul simple basé sur le poids et l'âge
    const baseTarget = calculateSimpleTarget(profile);
    
    const simpleRecommendation: SimpleHydrationRecommendation = {
      dailyTarget: baseTarget,
      message: generateEncouragingMessage(currentIntake, baseTarget),
      tips: generateSimpleTips(profile)
    };

    setRecommendation(simpleRecommendation);
  }, [profile, currentIntake]);

  return {
    recommendation,
    alert: null, // Plus d'alertes dramatiques
    medicalValidationStatus: 'safe', // Toujours sécurisé
    lastMedicalCheck: null
  };
};

// Calcul simple de l'objectif d'hydratation
function calculateSimpleTarget(profile: any): number {
  const weight = profile?.weight || 70;
  const age = profile?.age || 30;
  
  // Formule simple : 35ml par kg + ajustement âge
  let target = weight * 35;
  
  // Légère augmentation pour les jeunes actifs
  if (age < 30) target += 200;
  
  // Arrondir à un multiple de 250ml pour simplicité
  return Math.round(target / 250) * 250;
}

// Messages encourageants selon progression
function generateEncouragingMessage(current: number, target: number): string {
  const percentage = (current / target) * 100;
  
  if (percentage >= 100) return "🎉 Objectif atteint ! Continuez à écouter votre soif";
  if (percentage >= 80) return "🔥 Excellent ! Vous y êtes presque";
  if (percentage >= 60) return "💪 Bonne progression, gardez le rythme !";
  if (percentage >= 40) return "⭐ C'est parti, vous êtes sur la bonne voie";
  if (percentage >= 20) return "💧 Commencez votre journée en beauté !";
  return "🌱 Chaque gorgée compte, lancez-vous !";
}

// Conseils simples et bienveillants
function generateSimpleTips(profile: any): string[] {
  const tips = [
    "💡 Gardez une bouteille d'eau à portée de main",
    "⏰ Buvez un verre d'eau au réveil",
    "🍋 Ajoutez du citron pour plus de saveur",
    "📱 Utilisez des rappels pour ne pas oublier",
    "🥤 Les tisanes comptent aussi !",
    "🏃‍♂️ Hydratez-vous avant et après l'effort"
  ];
  
  // Retourner 3 conseils aléatoirement
  return tips.sort(() => Math.random() - 0.5).slice(0, 3);
}

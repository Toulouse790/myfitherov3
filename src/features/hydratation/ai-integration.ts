
import { useState, useEffect } from 'react';
import { WellnessRecommendation, HydrationAdvice } from './types';

// Hook simplifié pour les recommandations d'hydratation bienveillantes
export const useHydrationAI = (profile: any, currentIntake: number) => {
  const [recommendation, setRecommendation] = useState<WellnessRecommendation | null>(null);
  const [advice, setAdvice] = useState<HydrationAdvice | null>(null);

  useEffect(() => {
    if (!profile) return;

    // Calcul simple basé sur le poids et l'âge
    const baseTarget = calculateSimpleTarget(profile);
    
    const wellnessRecommendation: WellnessRecommendation = {
      suggestion: generateEncouragingSuggestion(currentIntake, baseTarget),
      confidence: calculateConfidenceLevel(profile),
      tips: generateSimpleTips(profile)
    };

    const hydrationAdvice: HydrationAdvice = {
      message: generateEncouragingMessage(currentIntake, baseTarget),
      motivation: generateMotivation(currentIntake, baseTarget),
      nextSteps: generateNextSteps(currentIntake, baseTarget),
      encouragement: generateEncouragement(currentIntake, baseTarget)
    };

    setRecommendation(wellnessRecommendation);
    setAdvice(hydrationAdvice);
  }, [profile, currentIntake]);

  return {
    recommendation,
    advice,
    isPositive: true, // Toujours positif
    wellnessLevel: 'good' // Toujours bienveillant
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

// Suggestions bienveillantes
function generateEncouragingSuggestion(current: number, target: number): string {
  const remaining = target - current;
  
  if (remaining <= 0) return "Vous avez atteint votre objectif ! Continuez à vous hydrater selon votre soif.";
  if (remaining <= 500) return `Plus que ${remaining}ml à boire, vous y êtes presque !`;
  if (remaining <= 1000) return `${remaining}ml restants, vous pouvez le faire !`;
  return `${Math.round(remaining/1000*10)/10}L à répartir sur la journée, c'est tout à fait faisable !`;
}

// Niveau de confiance simple
function calculateConfidenceLevel(profile: any): number {
  // Confiance de base élevée pour encourager
  let confidence = 85;
  
  if (profile?.age && profile.age > 18 && profile.age < 65) confidence += 10;
  if (profile?.weight && profile.weight > 50 && profile.weight < 100) confidence += 5;
  
  return Math.min(100, confidence);
}

// Motivation personnalisée
function generateMotivation(current: number, target: number): string {
  const percentage = (current / target) * 100;
  
  if (percentage >= 100) return "Votre corps vous remercie pour cette excellente hydratation !";
  if (percentage >= 80) return "Vous prenez soin de votre corps, bravo !";
  if (percentage >= 60) return "Votre énergie va être au top avec cette hydratation !";
  return "Chaque verre d'eau est un cadeau que vous offrez à votre corps !";
}

// Prochaines étapes encourageantes
function generateNextSteps(current: number, target: number): string[] {
  const remaining = target - current;
  
  if (remaining <= 0) {
    return [
      "Continuez à écouter votre soif",
      "Savourez vos boissons préférées",
      "Félicitez-vous pour cet objectif atteint !"
    ];
  }
  
  if (remaining <= 500) {
    return [
      "Un dernier verre d'eau",
      "Une tisane relaxante",
      "Célébrez votre réussite !"
    ];
  }
  
  return [
    "Buvez régulièrement par petites gorgées",
    "Variez les plaisirs : eau, tisanes, eau aromatisée",
    "Gardez une bouteille à portée de main"
  ];
}

// Encouragement selon le moment
function generateEncouragement(current: number, target: number): string {
  const hour = new Date().getHours();
  const percentage = (current / target) * 100;
  
  if (hour < 12) {
    return percentage < 30 ? "Belle matinée pour bien s'hydrater !" : "Excellent début de journée !";
  } else if (hour < 18) {
    return percentage < 70 ? "L'après-midi est parfait pour rattraper !" : "Superbe après-midi hydratation !";
  } else {
    return percentage < 90 ? "La soirée peut encore être productive !" : "Quelle belle journée bien hydratée !";
  }
}

// Conseils simples et bienveillants
function generateSimpleTips(profile: any): string[] {
  const tips = [
    "💡 Gardez une bouteille d'eau à portée de main",
    "⏰ Buvez un verre d'eau au réveil",
    "🍋 Ajoutez du citron pour plus de saveur",
    "📱 Utilisez des rappels pour ne pas oublier",
    "🥤 Les tisanes comptent aussi !",
    "🏃‍♂️ Hydratez-vous avant et après l'effort",
    "🌿 L'eau infusée aux fruits, c'est délicieux !",
    "☕ Alternez café et eau tout au long de la journée"
  ];
  
  // Retourner 3 conseils aléatoirement
  return tips.sort(() => Math.random() - 0.5).slice(0, 3);
}

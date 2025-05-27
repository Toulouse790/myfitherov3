
// Utilitaires pour l'hydratation
export const calculateDailyNeed = (weight: number = 70, age: number = 30): number => {
  let baseNeed = weight * 35; // 35ml par kg
  
  // Ajustement selon l'âge
  if (age < 30) baseNeed += 200;
  if (age > 65) baseNeed += 100;
  
  return Math.round(baseNeed / 250) * 250; // Arrondi à 250ml près
};

export const getProgressMessage = (percentage: number): string => {
  if (percentage >= 100) return "🎉 Objectif atteint ! Continuez à écouter votre soif";
  if (percentage >= 80) return "🔥 Excellent ! Vous y êtes presque";
  if (percentage >= 60) return "💪 Bonne progression, gardez le rythme !";
  if (percentage >= 40) return "⭐ C'est parti, vous êtes sur la bonne voie";
  if (percentage >= 20) return "💧 Commencez votre journée en beauté !";
  return "🌱 Chaque gorgée compte, lancez-vous !";
};

export const getHydrationTips = (): string[] => {
  const tips = [
    "💡 Gardez une bouteille d'eau à portée de main",
    "⏰ Buvez un verre d'eau au réveil",
    "🍋 Ajoutez du citron pour plus de saveur",
    "📱 Utilisez des rappels pour ne pas oublier",
    "🥤 Les tisanes comptent aussi !",
    "🏃‍♂️ Hydratez-vous avant et après l'effort"
  ];
  
  return tips.sort(() => Math.random() - 0.5).slice(0, 3);
};

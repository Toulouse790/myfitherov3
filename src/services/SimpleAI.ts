
export interface UserContext {
  workoutIntensity: 'low' | 'medium' | 'high';
  weatherTemp: number;
  sleepHours: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  currentWeight: number;
  targetWeight?: number;
}

export interface SimpleRecommendation {
  type: 'hydration' | 'nutrition' | 'workout' | 'sleep';
  message: string;
  value?: number;
  unit?: string;
}

export class SimpleAI {
  static generateRecommendations(context: UserContext): SimpleRecommendation[] {
    const recommendations: SimpleRecommendation[] = [];

    // Logic 1: Sport intense → +hydratation +nutrition +sommeil
    if (context.workoutIntensity === 'high') {
      recommendations.push({
        type: 'hydration',
        message: 'Entraînement intense détecté - augmentez votre hydratation',
        value: 3.5,
        unit: 'L'
      });
      
      recommendations.push({
        type: 'nutrition',
        message: 'Augmentez vos protéines pour la récupération',
        value: context.currentWeight * 2,
        unit: 'g'
      });
      
      recommendations.push({
        type: 'sleep',
        message: 'Visez 8-9h de sommeil pour optimiser la récupération',
        value: 8.5,
        unit: 'h'
      });
    }

    // Logic 2: Si chaleur → +hydratation
    if (context.weatherTemp > 25) {
      const extraWater = Math.round((context.weatherTemp - 25) * 0.1 * 10) / 10;
      recommendations.push({
        type: 'hydration',
        message: `Température élevée (${context.weatherTemp}°C) - hydratez-vous davantage`,
        value: 2.5 + extraWater,
        unit: 'L'
      });
    }

    // Logic 3: Si peu sommeil → workout léger conseillé
    if (context.sleepHours < 6) {
      recommendations.push({
        type: 'workout',
        message: 'Sommeil insuffisant - privilégiez un entraînement léger aujourd\'hui',
        value: 30,
        unit: 'min'
      });
    }

    // Logic 4: Si objectif perte poids → déficit calculé intelligent
    if (context.goal === 'weight_loss' && context.targetWeight) {
      const weightToLose = context.currentWeight - context.targetWeight;
      const weeklyDeficit = Math.min(weightToLose * 0.5, 2); // Max 2kg par semaine
      const dailyCalorieDeficit = weeklyDeficit * 7700 / 7; // 7700 cal = 1kg
      
      recommendations.push({
        type: 'nutrition',
        message: `Déficit calorique pour perdre ${weightToLose}kg`,
        value: Math.round(dailyCalorieDeficit),
        unit: 'cal déficit/jour'
      });
    }

    return recommendations;
  }

  static getHydrationTarget(context: UserContext): number {
    let baseHydration = context.currentWeight * 0.035; // 35ml par kg

    // Ajustements simples
    if (context.workoutIntensity === 'high') baseHydration += 0.5;
    if (context.weatherTemp > 25) baseHydration += (context.weatherTemp - 25) * 0.1;
    
    return Math.round(baseHydration * 10) / 10;
  }

  static getCalorieTarget(context: UserContext): number {
    // Calcul BMR simple (Harris-Benedict simplifié)
    const bmr = context.currentWeight * 22; // Approximation simple
    
    // Ajustement activité
    const activityMultiplier = {
      low: 1.2,
      medium: 1.5,
      high: 1.8
    }[context.workoutIntensity];

    let calories = bmr * activityMultiplier;

    // Ajustement objectif
    if (context.goal === 'weight_loss') {
      calories -= 500; // Déficit standard
    } else if (context.goal === 'muscle_gain') {
      calories += 300; // Surplus pour prise de masse
    }

    return Math.round(calories);
  }

  static getWorkoutRecommendation(context: UserContext): string {
    if (context.sleepHours < 6) {
      return 'Récupération active - 20-30min de marche ou yoga léger';
    }
    
    if (context.weatherTemp > 30) {
      return 'Entraînement en intérieur recommandé (climatisation)';
    }
    
    if (context.goal === 'weight_loss') {
      return 'Cardio 30-45min + renforcement musculaire';
    }
    
    if (context.goal === 'muscle_gain') {
      return 'Musculation 45-60min avec charges progressives';
    }
    
    return 'Entraînement équilibré cardio + musculation';
  }
}

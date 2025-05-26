
import { useQuery } from '@tanstack/react-query';
import { Food, MealEntry, MealPlan } from './types';

// Hooks personnalisés pour le module Nutrition
export const useFoods = () => {
  return useQuery({
    queryKey: ['foods'],
    queryFn: async (): Promise<Food[]> => {
      // Simulation de données d'aliments
      return [];
    }
  });
};

export const useMealEntries = (userId: string, date: string) => {
  return useQuery({
    queryKey: ['meal-entries', userId, date],
    queryFn: async (): Promise<MealEntry[]> => {
      // Simulation de données d'entrées de repas
      return [];
    }
  });
};

export const useMealPlan = (userId: string) => {
  return useQuery({
    queryKey: ['meal-plan', userId],
    queryFn: async (): Promise<MealPlan | null> => {
      // Simulation de plan de repas
      return null;
    }
  });
};

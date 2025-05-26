
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ActivityData {
  name: string;
  séances: number;
  calories: number;
  sommeil: number;
}

interface ProgressData {
  name: string;
  force: number;
  endurance: number;
  récupération: number;
}

export const useUserChartData = () => {
  const { user } = useAuth();
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Pour un nouvel utilisateur : données vides/zéro uniquement
        const emptyActivityData: ActivityData[] = [
          { name: 'Lun', séances: 0, calories: 0, sommeil: 0 },
          { name: 'Mar', séances: 0, calories: 0, sommeil: 0 },
          { name: 'Mer', séances: 0, calories: 0, sommeil: 0 },
          { name: 'Jeu', séances: 0, calories: 0, sommeil: 0 },
          { name: 'Ven', séances: 0, calories: 0, sommeil: 0 },
          { name: 'Sam', séances: 0, calories: 0, sommeil: 0 },
          { name: 'Dim', séances: 0, calories: 0, sommeil: 0 },
        ];

        const emptyProgressData: ProgressData[] = [
          { name: 'Semaine 1', force: 0, endurance: 0, récupération: 0 },
          { name: 'Semaine 2', force: 0, endurance: 0, récupération: 0 },
          { name: 'Semaine 3', force: 0, endurance: 0, récupération: 0 },
          { name: 'Semaine 4', force: 0, endurance: 0, récupération: 0 },
        ];

        // TODO: Remplacer par de vraies données utilisateur depuis la base de données
        setActivityData(emptyActivityData);
        setProgressData(emptyProgressData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        // Garder les données vides en cas d'erreur
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [user]);

  return { activityData, progressData, isLoading };
};

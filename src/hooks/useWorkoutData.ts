
import { useState } from 'react';

// Types
export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  weight: string;
};

export type Workout = {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: string;
  category: string;
  exercises: Exercise[];
};

// Mock data - in a real app this would come from an API
const workoutDataMock = {
  '1': {
    id: '1',
    title: 'Prise de masse - Haut du corps',
    description: 'Programme intense ciblant les pectoraux, épaules et triceps pour maximiser la croissance musculaire',
    duration: 45,
    level: 'intermédiaire',
    category: 'Musculation',
    exercises: [
      { id: '1', name: 'Développé couché', sets: 4, reps: '8-10', rest: 90, weight: '70% 1RM' },
      { id: '2', name: 'Développé incliné haltères', sets: 3, reps: '10-12', rest: 75, weight: '60% 1RM' },
      { id: '3', name: 'Élévations latérales', sets: 3, reps: '12-15', rest: 60, weight: 'Moyen' },
      { id: '4', name: 'Dips', sets: 3, reps: '8-12', rest: 90, weight: 'Poids du corps' },
      { id: '5', name: 'Pushdown triceps', sets: 3, reps: '12-15', rest: 60, weight: 'Moyen' },
      { id: '6', name: 'Curl biceps', sets: 3, reps: '10-12', rest: 60, weight: '60% 1RM' },
      { id: '7', name: 'Planche', sets: 3, reps: '30-60s', rest: 45, weight: 'Poids du corps' },
      { id: '8', name: 'Gainage latéral', sets: 2, reps: '30s/côté', rest: 30, weight: 'Poids du corps' },
    ]
  },
  '2': {
    id: '2',
    title: 'Prise de masse - Bas du corps',
    description: 'Focus sur les quadriceps, ischio-jambiers et mollets pour un développement complet',
    duration: 50,
    level: 'intermédiaire',
    category: 'Musculation',
    exercises: [
      { id: '1', name: 'Squats', sets: 4, reps: '8-10', rest: 120, weight: '75% 1RM' },
      { id: '2', name: 'Leg press', sets: 3, reps: '10-12', rest: 90, weight: '70% 1RM' },
      { id: '3', name: 'Extensions de jambes', sets: 3, reps: '12-15', rest: 60, weight: 'Moyen' },
      { id: '4', name: 'Leg curl', sets: 3, reps: '12-15', rest: 60, weight: 'Moyen' },
      { id: '5', name: 'Fentes', sets: 3, reps: '10/jambe', rest: 60, weight: 'Moyen' },
      { id: '6', name: 'Mollets debout', sets: 4, reps: '15-20', rest: 45, weight: 'Moyen-lourd' },
      { id: '7', name: 'Deadlift roumain', sets: 3, reps: '10-12', rest: 90, weight: '65% 1RM' },
    ]
  },
};

export const useWorkoutData = (workoutId: string | undefined) => {
  // Dans une application réelle, nous ferions un appel API ici
  const [workoutData] = useState(workoutDataMock);
  
  const workout = workoutId ? workoutData[workoutId as keyof typeof workoutData] : undefined;
  
  return { workout };
};

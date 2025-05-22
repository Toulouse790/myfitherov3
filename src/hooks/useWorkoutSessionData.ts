
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

export type WorkoutSession = {
  id: string;
  title: string;
  exercises: Exercise[];
};

// Mock data - in a real app this would come from an API
const workoutDataMock = {
  '1': {
    id: '1',
    title: 'Prise de masse - Haut du corps',
    exercises: [
      { id: '1', name: 'Développé couché', sets: 4, reps: '8-10', rest: 90, weight: '70kg' },
      { id: '2', name: 'Développé incliné haltères', sets: 3, reps: '10-12', rest: 75, weight: '25kg' },
      { id: '3', name: 'Élévations latérales', sets: 3, reps: '12-15', rest: 60, weight: '12kg' },
      { id: '4', name: 'Dips', sets: 3, reps: '8-12', rest: 90, weight: 'Corps' },
      { id: '5', name: 'Pushdown triceps', sets: 3, reps: '12-15', rest: 60, weight: '30kg' },
      { id: '6', name: 'Curl biceps', sets: 3, reps: '10-12', rest: 60, weight: '15kg' },
      { id: '7', name: 'Planche', sets: 3, reps: '30-60s', rest: 45, weight: 'Corps' },
      { id: '8', name: 'Gainage latéral', sets: 2, reps: '30s/côté', rest: 30, weight: 'Corps' },
    ]
  }
};

export const useWorkoutSessionData = (workoutId: string | undefined) => {
  // Dans une application réelle, nous ferions un appel API ici
  const [workoutData] = useState(workoutDataMock);
  
  const workout = workoutId ? workoutData[workoutId as keyof typeof workoutData] : undefined;
  
  return { workout };
};

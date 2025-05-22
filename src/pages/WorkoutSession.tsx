
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft } from 'lucide-react';
import { useWorkoutSessionData } from '@/hooks/useWorkoutSessionData';
import WorkoutSessionHeader from '@/components/workout/session/WorkoutSessionHeader';
import RestTimer from '@/components/workout/session/RestTimer';
import ExerciseCard from '@/components/workout/session/ExerciseCard';
import NextExercisePreview from '@/components/workout/session/NextExercisePreview';

const WorkoutSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workout } = useWorkoutSessionData(id);
  
  // États de l'entraînement
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [workoutStartTime] = useState(Date.now());
  
  // États modifiables par l'utilisateur
  const [userWeights, setUserWeights] = useState<{[key: string]: string}>({});
  const [userReps, setUserReps] = useState<{[key: string]: string}>({});
  const [customRestTime, setCustomRestTime] = useState<{[key: string]: number}>({});
  
  const currentExercise = workout?.exercises[currentExerciseIndex];
  const totalExercises = workout?.exercises.length || 0;
  const progressPercentage = ((currentExerciseIndex + (currentSet / (currentExercise?.sets || 1))) / totalExercises) * 100;
  
  // Initialiser les valeurs par défaut
  useEffect(() => {
    if (workout) {
      const weights: {[key: string]: string} = {};
      const reps: {[key: string]: string} = {};
      const restTimes: {[key: string]: number} = {};
      
      workout.exercises.forEach(exercise => {
        weights[exercise.id] = exercise.weight;
        reps[exercise.id] = exercise.reps;
        restTimes[exercise.id] = exercise.rest;
      });
      
      setUserWeights(weights);
      setUserReps(reps);
      setCustomRestTime(restTimes);
    }
  }, [workout]);
  
  // Timer de repos
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && restTime > 0) {
      interval = setInterval(() => {
        setRestTime(time => {
          if (time <= 1) {
            setIsTimerActive(false);
            setIsResting(false);
            toast.success("Temps de repos terminé !", {
              description: "Prêt pour la prochaine série"
            });
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, restTime]);
  
  if (!workout) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Entraînement non trouvé</h2>
          <Button className="mt-6" onClick={() => navigate('/workout')}>
            Retour aux entraînements
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const handleCompleteSet = () => {
    const setKey = `${currentExercise.id}-${currentSet}`;
    setCompletedSets(prev => [...prev, currentSet]);
    
    if (currentSet < currentExercise.sets) {
      // Pas la dernière série, commencer le repos
      const exerciseRestTime = customRestTime[currentExercise.id] || currentExercise.rest;
      setRestTime(exerciseRestTime);
      setIsResting(true);
      setIsTimerActive(true);
      setCurrentSet(prev => prev + 1);
      
      toast.success("Série terminée !", {
        description: `Repos: ${exerciseRestTime}s`
      });
    } else {
      // Dernière série de l'exercice
      if (currentExerciseIndex < totalExercises - 1) {
        // Passer à l'exercice suivant
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        setCompletedSets([]);
        toast.success("Exercice terminé !", {
          description: "Passage à l'exercice suivant"
        });
      } else {
        // Fin de l'entraînement
        const duration = Math.round((Date.now() - workoutStartTime) / 1000 / 60);
        toast.success("Entraînement terminé !", {
          description: `Durée: ${duration} minutes`
        });
        navigate('/workout');
      }
    }
  };
  
  const handleSkipRest = () => {
    setIsTimerActive(false);
    setIsResting(false);
    setRestTime(0);
    toast.info("Repos interrompu");
  };
  
  const adjustRestTime = (seconds: number) => {
    setRestTime(prev => Math.max(0, prev + seconds));
  };
  
  const updateWeight = (exerciseId: string, weight: string) => {
    setUserWeights(prev => ({ ...prev, [exerciseId]: weight }));
  };
  
  const updateReps = (exerciseId: string, reps: string) => {
    setUserReps(prev => ({ ...prev, [exerciseId]: reps }));
  };
  
  const handleSkipExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setCompletedSets([]);
    }
  };
  
  const handleQuitWorkout = () => {
    if (confirm('Êtes-vous sûr de vouloir quitter cet entraînement ?')) {
      navigate('/workout');
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header avec progression */}
        <WorkoutSessionHeader 
          title={workout.title}
          currentExerciseIndex={currentExerciseIndex}
          totalExercises={totalExercises}
          progressPercentage={progressPercentage}
          onQuit={handleQuitWorkout}
        />
        
        <Progress value={progressPercentage} className="h-2" />
        
        {/* Timer de repos ou exercice actuel */}
        {isResting ? (
          <RestTimer 
            restTime={restTime}
            isTimerActive={isTimerActive}
            onToggleTimer={() => setIsTimerActive(!isTimerActive)}
            onSkip={handleSkipRest}
            onAdjustTime={adjustRestTime}
          />
        ) : (
          <ExerciseCard
            exercise={currentExercise}
            currentSet={currentSet}
            completedSets={completedSets}
            weight={userWeights[currentExercise.id] || ''}
            reps={userReps[currentExercise.id] || ''}
            onUpdateWeight={(weight) => updateWeight(currentExercise.id, weight)}
            onUpdateReps={(reps) => updateReps(currentExercise.id, reps)}
            onCompleteSet={handleCompleteSet}
            onSkipExercise={handleSkipExercise}
            isLastExercise={currentExerciseIndex >= totalExercises - 1}
          />
        )}
        
        {/* Aperçu du prochain exercice */}
        {currentExerciseIndex < totalExercises - 1 && !isResting && (
          <NextExercisePreview 
            exercise={workout.exercises[currentExerciseIndex + 1]} 
          />
        )}
      </div>
    </MainLayout>
  );
};

export default WorkoutSession;

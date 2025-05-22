import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft, Timer, Minus, Plus, Play, Pause, SkipForward } from 'lucide-react';
import { useWorkoutSessionData } from '@/hooks/useWorkoutSessionData';
import WorkoutSessionHeader from '@/components/workout/session/WorkoutSessionHeader';
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
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <Card className="glass-card border-blue-200 relative overflow-hidden">
            <div className="absolute inset-0 gradient-flow opacity-10"></div>
            <CardContent className="pt-6 text-center relative z-10">
              <div className="float">
                <Timer className="mx-auto mb-4 text-blue-600" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-blue-800 mb-2">Temps de repos</h2>
              <div className="text-7xl font-mono font-bold text-blue-600 mb-4 pulse-glow">
                {formatTime(restTime)}
              </div>
              
              {/* Progress Circle */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-blue-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - (restTime / (customRestTime[currentExercise.id] || currentExercise.rest)))}`}
                    className="text-blue-500 transition-all duration-1000 ease-linear"
                  />
                </svg>
              </div>
              
              <div className="flex justify-center gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => adjustRestTime(-15)}
                  className="bg-white/80 hover:bg-white hover-grow"
                >
                  <Minus size={16} className="mr-1" />
                  15s
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => adjustRestTime(15)}
                  className="bg-white/80 hover:bg-white hover-grow"
                >
                  <Plus size={16} className="mr-1" />
                  15s
                </Button>
              </div>
              <div className="flex justify-center gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsTimerActive(!isTimerActive)}
                  className="bg-white/80 hover:bg-white hover-grow"
                >
                  {isTimerActive ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
                  {isTimerActive ? 'Pause' : 'Reprendre'}
                </Button>
                <Button onClick={handleSkipRest} className="bg-blue-600 hover:bg-blue-700 hover-grow">
                  <SkipForward size={16} className="mr-2" />
                  Passer
                </Button>
              </div>
            </CardContent>
          </Card>
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

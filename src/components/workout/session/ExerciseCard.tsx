
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dumbbell, Check, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Exercise } from '@/hooks/useWorkoutSessionData';

type ExerciseCardProps = {
  exercise: Exercise;
  currentSet: number;
  completedSets: number[];
  weight: string;
  reps: string;
  onUpdateWeight: (weight: string) => void;
  onUpdateReps: (reps: string) => void;
  onCompleteSet: () => void;
  onSkipExercise: () => void;
  isLastExercise: boolean;
};

const ExerciseCard = ({
  exercise,
  currentSet,
  completedSets,
  weight,
  reps,
  onUpdateWeight,
  onUpdateReps,
  onCompleteSet,
  onSkipExercise,
  isLastExercise
}: ExerciseCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{exercise.name}</CardTitle>
            <p className="text-muted-foreground">
              Série {currentSet} sur {exercise.sets}
            </p>
          </div>
          <Badge variant="secondary">
            <Dumbbell size={14} className="mr-1" />
            Série {currentSet}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Paramètres modifiables */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Poids</label>
            <Input
              value={weight}
              onChange={(e) => onUpdateWeight(e.target.value)}
              placeholder="Ex: 70kg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Répétitions</label>
            <Input
              value={reps}
              onChange={(e) => onUpdateReps(e.target.value)}
              placeholder="Ex: 8-10"
            />
          </div>
        </div>
        
        {/* Séries completées */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Progression</label>
          <div className="flex gap-2">
            {Array.from({ length: exercise.sets }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-medium",
                  completedSets.includes(i + 1)
                    ? "bg-green-100 border-green-500 text-green-700"
                    : i + 1 === currentSet
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                )}
              >
                {completedSets.includes(i + 1) ? (
                  <Check size={16} />
                ) : (
                  i + 1
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={onCompleteSet}
            className="flex-1"
            size="lg"
          >
            <Check size={20} className="mr-2" />
            Série terminée
          </Button>
          <Button 
            variant="outline" 
            onClick={onSkipExercise}
            disabled={isLastExercise}
          >
            <SkipForward size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;

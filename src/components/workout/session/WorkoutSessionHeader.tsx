
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

type WorkoutSessionHeaderProps = {
  title: string;
  currentExerciseIndex: number;
  totalExercises: number;
  progressPercentage: number;
  onQuit: () => void;
};

const WorkoutSessionHeader = ({
  title,
  currentExerciseIndex,
  totalExercises,
  progressPercentage,
  onQuit
}: WorkoutSessionHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={onQuit} className="pl-0">
        <ArrowLeft size={16} className="mr-2" />
        Quitter
      </Button>
      <div className="text-center flex-1 mx-4">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">
          Exercice {currentExerciseIndex + 1} sur {totalExercises}
        </p>
      </div>
      <Badge variant="outline" className="text-sm">
        {Math.round(progressPercentage)}%
      </Badge>
    </div>
  );
};

export default WorkoutSessionHeader;

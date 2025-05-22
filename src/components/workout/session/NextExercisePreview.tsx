
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Exercise } from '@/hooks/useWorkoutSessionData';

type NextExercisePreviewProps = {
  exercise: Exercise;
};

const NextExercisePreview = ({ exercise }: NextExercisePreviewProps) => {
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-4">
        <h3 className="font-medium text-sm text-muted-foreground mb-2">Prochain exercice</h3>
        <p className="font-medium">{exercise.name}</p>
        <p className="text-sm text-muted-foreground">
          {exercise.sets} séries × {exercise.reps}
        </p>
      </CardContent>
    </Card>
  );
};

export default NextExercisePreview;

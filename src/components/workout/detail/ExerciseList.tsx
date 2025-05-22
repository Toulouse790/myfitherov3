
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Play } from 'lucide-react';

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  weight: string;
};

type ExerciseListProps = {
  exercises: Exercise[];
  isPreviewMode: boolean;
  onStart: () => void;
};

const ExerciseList = ({ exercises, isPreviewMode, onStart }: ExerciseListProps) => {
  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <Card key={exercise.id} className="overflow-hidden">
          <CardHeader className="bg-muted/30 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex items-center justify-center bg-primary/10 w-8 h-8 rounded-full mr-3">
                  <span className="font-medium text-sm">{index + 1}</span>
                </div>
                <CardTitle className="text-lg">{exercise.name}</CardTitle>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Séries</p>
                <p className="font-medium">{exercise.sets}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Répétitions</p>
                <p className="font-medium">{exercise.reps}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Repos</p>
                <p className="font-medium">{exercise.rest}s</p>
              </div>
              <div>
                <p className="text-muted-foreground">Charge</p>
                <p className="font-medium">{exercise.weight}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {!isPreviewMode && (
        <Button onClick={onStart} className="w-full mt-6">
          <Play size={16} className="mr-2" />
          Démarrer l'entraînement
        </Button>
      )}
    </div>
  );
};

export default ExerciseList;

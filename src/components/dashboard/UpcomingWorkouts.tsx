
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface WorkoutItem {
  id: number;
  name: string;
  time: string;
  duration: string;
}

interface UpcomingWorkoutsProps {
  workouts: WorkoutItem[];
}

const UpcomingWorkouts = ({ workouts }: UpcomingWorkoutsProps) => {
  const navigate = useNavigate();

  const handleWorkoutClick = (workoutId: number) => {
    navigate(`/workout/${workoutId}`);
    toast.info("Entraînement sélectionné", {
      description: "Détails de la séance chargés"
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Prochains entraînements</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate('/workout/history')}>
          Voir tous
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workouts.map(workout => (
            <div 
              key={workout.id} 
              className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
              onClick={() => handleWorkoutClick(workout.id)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="text-primary" size={20} />
                </div>
                <div className="ml-4">
                  <p className="font-medium hover:text-primary transition-colors">{workout.name}</p>
                  <p className="text-sm text-muted-foreground">{workout.time}</p>
                </div>
              </div>
              <div className="text-sm font-medium">{workout.duration}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingWorkouts;

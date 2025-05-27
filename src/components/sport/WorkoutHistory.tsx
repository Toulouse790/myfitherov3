
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clock, activity, dumbbell } from 'lucide-react';
import { useWorkoutHistory } from '@/features/sport/tracking/hooks';
import { WorkoutTracking } from '@/features/sport/tracking/types';

const WorkoutHistory = () => {
  const { data: workouts, isLoading } = useWorkoutHistory();

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'extreme': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkoutTypeEmoji = (type: string) => {
    switch (type) {
      case 'strength': return '💪';
      case 'cardio': return '🏃‍♂️';
      case 'flexibility': return '🧘‍♀️';
      case 'sports': return '⚽';
      case 'outdoor': return '🌲';
      default: return '🏋️‍♀️';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des séances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!workouts || workouts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des séances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune séance enregistrée</h3>
            <p className="text-muted-foreground">
              Démarrez votre première séance pour voir vos progrès !
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Historique des séances</CardTitle>
          <Badge variant="outline">
            {workouts.length} séance{workouts.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Séance</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Intensité</TableHead>
              <TableHead>Calories</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workouts.map((workout) => (
              <TableRow key={workout.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getWorkoutTypeEmoji(workout.type)}</span>
                    <span className="font-medium">{workout.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {workout.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <clock className="h-4 w-4 text-muted-foreground" />
                    <span>{workout.duration} min</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getIntensityColor(workout.intensity)}>
                    {workout.intensity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <activity className="h-4 w-4 text-muted-foreground" />
                    <span>{workout.caloriesBurned}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(workout.startTime)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Détails
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WorkoutHistory;

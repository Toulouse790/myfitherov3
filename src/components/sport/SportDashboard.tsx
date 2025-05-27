
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Dumbbell, 
  Clock, 
  TrendingUp, 
  Timer,
  ArrowUp
} from 'lucide-react';
import { useSportStats, useCurrentWorkout, useSportTracking } from '@/features/sport/tracking/hooks';
import { toast } from 'sonner';

const SportDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useSportStats();
  const { data: currentWorkout } = useCurrentWorkout();
  const { startWorkout, completeWorkout, pauseWorkout, resumeWorkout } = useSportTracking();

  const handleQuickStart = (type: string) => {
    startWorkout({
      type: type as any,
      title: `Séance ${type}`,
      intensity: 'moderate'
    });
    toast.success(`Séance ${type} démarrée !`);
  };

  const handleWorkoutAction = () => {
    if (!currentWorkout) return;
    
    if (currentWorkout.status === 'active') {
      pauseWorkout();
      toast.info('Séance mise en pause');
    } else if (currentWorkout.status === 'paused') {
      resumeWorkout();
      toast.info('Séance reprise');
    }
  };

  const handleCompleteWorkout = () => {
    completeWorkout();
    toast.success('Séance terminée ! Bravo ! 🎉');
  };

  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workout actuel */}
      {currentWorkout && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                🏃‍♂️ {currentWorkout.title}
              </CardTitle>
              <Badge variant={currentWorkout.status === 'active' ? 'default' : 'secondary'}>
                {currentWorkout.status === 'active' ? 'En cours' : 'En pause'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{Math.floor(currentWorkout.duration)} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">{currentWorkout.caloriesBurned} cal</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleWorkoutAction}
                >
                  {currentWorkout.status === 'active' ? 'Pause' : 'Reprendre'}
                </Button>
                <Button 
                  size="sm"
                  onClick={handleCompleteWorkout}
                >
                  Terminer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Séances totales</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalWorkouts || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 mr-1" />
              +{stats?.currentStreak || 0} cette semaine
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps total</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor((stats?.totalDuration || 0) / 60)}h</div>
            <div className="text-xs text-muted-foreground">
              {(stats?.totalDuration || 0) % 60}min cette semaine
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories brûlées</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCalories || 0}</div>
            <div className="text-xs text-muted-foreground">
              Objectif: 2000 cal/semaine
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak actuel</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.currentStreak || 0} jours</div>
            <div className="text-xs text-muted-foreground">
              Record: {stats?.longestStreak || 0} jours
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Objectifs hebdomadaires */}
      <Card>
        <CardHeader>
          <CardTitle>Objectifs de la semaine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Séances ({stats?.weeklyGoals.currentWorkouts || 0}/{stats?.weeklyGoals.targetWorkouts || 4})</span>
              <span>{Math.round(((stats?.weeklyGoals.currentWorkouts || 0) / (stats?.weeklyGoals.targetWorkouts || 4)) * 100)}%</span>
            </div>
            <Progress 
              value={((stats?.weeklyGoals.currentWorkouts || 0) / (stats?.weeklyGoals.targetWorkouts || 4)) * 100} 
              className="h-2"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Calories ({stats?.weeklyGoals.currentCalories || 0}/{stats?.weeklyGoals.targetCalories || 2000})</span>
              <span>{Math.round(((stats?.weeklyGoals.currentCalories || 0) / (stats?.weeklyGoals.targetCalories || 2000)) * 100)}%</span>
            </div>
            <Progress 
              value={((stats?.weeklyGoals.currentCalories || 0) / (stats?.weeklyGoals.targetCalories || 2000)) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Démarrage rapide */}
      {!currentWorkout && (
        <Card>
          <CardHeader>
            <CardTitle>Démarrage rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { type: 'strength', label: 'Musculation', emoji: '💪' },
                { type: 'cardio', label: 'Cardio', emoji: '🏃‍♂️' },
                { type: 'flexibility', label: 'Stretching', emoji: '🧘‍♀️' },
                { type: 'sports', label: 'Sport', emoji: '⚽' },
                { type: 'outdoor', label: 'Extérieur', emoji: '🌲' },
              ].map(({ type, label, emoji }) => (
                <Button
                  key={type}
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => handleQuickStart(type)}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SportDashboard;

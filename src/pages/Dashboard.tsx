import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import { Dumbbell, Flame, Timer, Apple, Heart, MoveUp, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const activityData = [
    { name: 'Lun', séances: 1, calories: 450, sommeil: 7.2 },
    { name: 'Mar', séances: 0, calories: 200, sommeil: 6.8 },
    { name: 'Mer', séances: 1, calories: 520, sommeil: 8.1 },
    { name: 'Jeu', séances: 1, calories: 380, sommeil: 7.5 },
    { name: 'Ven', séances: 0, calories: 180, sommeil: 7.0 },
    { name: 'Sam', séances: 1, calories: 600, sommeil: 8.3 },
    { name: 'Dim', séances: 0, calories: 220, sommeil: 8.5 },
  ];

  const progressData = [
    { name: 'Semaine 1', force: 85, endurance: 60, récupération: 70 },
    { name: 'Semaine 2', force: 87, endurance: 65, récupération: 72 },
    { name: 'Semaine 3', force: 90, endurance: 68, récupération: 75 },
    { name: 'Semaine 4', force: 88, endurance: 72, récupération: 80 },
  ];

  // Prochains entraînements
  const upcomingWorkouts = [
    { id: 1, name: 'Musculation - Haut du corps', time: 'Aujourd\'hui, 18:00', duration: '45 min' },
    { id: 2, name: 'Cardio HIIT', time: 'Demain, 07:30', duration: '30 min' },
    { id: 3, name: 'Musculation - Bas du corps', time: 'Mercredi, 18:00', duration: '50 min' },
  ];

  const handleWorkoutClick = (workoutId: number) => {
    navigate(`/workout/${workoutId}`);
    toast.info("Entraînement sélectionné", {
      description: "Détails de la séance chargés"
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">Bonjour Thomas, voici un aperçu de votre progression</p>
          </div>
          <Button>
            <Calendar size={16} className="mr-2" />
            Cette semaine
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Séances complétées"
            value="4"
            description="cette semaine"
            icon={<Dumbbell size={20} className="text-primary" />}
            trend={10}
            trendLabel="vs semaine dernière"
            onClick={() => navigate('/workout')}
            actionLabel="Voir mes séances"
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
          <StatCard 
            title="Calories brûlées"
            value="2,350"
            description="cette semaine"
            icon={<Flame size={20} className="text-fitness-orange" />}
            trend={5}
            trendLabel="vs semaine dernière"
            iconBackground="bg-fitness-orange/10"
            onClick={() => navigate('/nutrition')}
            actionLabel="Voir mon plan nutritionnel"
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
          <StatCard 
            title="Temps d'entraînement"
            value="3h 45m"
            description="cette semaine"
            icon={<Timer size={20} className="text-fitness-blue" />}
            trend={-8}
            trendLabel="vs semaine dernière"
            iconBackground="bg-fitness-blue/10"
            onClick={() => navigate('/workout/history')}
            actionLabel="Voir mon historique"
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
          <StatCard 
            title="Qualité du sommeil"
            value="85%"
            description="moyenne"
            icon={<Heart size={20} className="text-fitness-purple" />}
            trend={12}
            trendLabel="vs semaine dernière"
            iconBackground="bg-fitness-purple/10"
            onClick={() => navigate('/sleep')}
            actionLabel="Analyser mon sommeil"
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProgressChart 
            title="Activité quotidienne"
            data={activityData}
            dataKeys={[
              { key: 'séances', color: '#1E40AF', name: 'Séances' },
              { key: 'calories', color: '#EA580C', name: 'Calories (x10)' },
              { key: 'sommeil', color: '#7E22CE', name: 'Sommeil (h)' },
            ]}
          />
          <ProgressChart 
            title="Progression mensuelle"
            data={progressData}
            dataKeys={[
              { key: 'force', color: '#1E40AF', name: 'Force' },
              { key: 'endurance', color: '#059669', name: 'Endurance' },
              { key: 'récupération', color: '#7E22CE', name: 'Récupération' },
            ]}
          />
        </div>

        {/* Upcoming Workouts & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Prochains entraînements</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/workout/history')}>
                Voir tous
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingWorkouts.map(workout => (
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
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Succès récents</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/achievements')}>
                Tous les succès
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
                  onClick={() => navigate('/achievements/streak')}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Award className="text-secondary" size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium hover:text-primary transition-colors">3 séances consécutives</p>
                      <p className="text-sm text-muted-foreground">Il y a 2 jours</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
                  onClick={() => navigate('/workout/records')}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-fitness-orange/10 flex items-center justify-center">
                      <MoveUp className="text-fitness-orange" size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium hover:text-primary transition-colors">Nouveau record - Développé couché</p>
                      <p className="text-sm text-muted-foreground">Il y a 5 jours</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
                  onClick={() => navigate('/nutrition/goals')}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-fitness-green/10 flex items-center justify-center">
                      <Apple className="text-fitness-green" size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium hover:text-primary transition-colors">5 jours d'objectifs nutritionnels atteints</p>
                      <p className="text-sm text-muted-foreground">Il y a une semaine</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

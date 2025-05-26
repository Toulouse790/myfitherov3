
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/components/dashboard/StatCard';
import { Dumbbell, Flame, Timer, Heart } from 'lucide-react';
import { useUserStats } from '@/hooks/useUserStats';

const DashboardStats = () => {
  const navigate = useNavigate();
  const { stats, isLoading } = useUserStats();
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3"> {/* 2 cartes par ligne sur mobile, gap réduit */}
      <StatCard 
        title="Séances complétées"
        value={isLoading ? "..." : stats.completedWorkouts.toString()}
        description={stats.completedWorkouts === 0 ? "Prêt à commencer ?" : "cette semaine"}
        icon={<Dumbbell className="text-primary" />}
        trend={stats.workoutTrend}
        trendLabel={stats.completedWorkouts > 0 ? "vs semaine dernière" : ""}
        onClick={() => navigate('/workout')}
        actionLabel="Commencer une séance"
        className="cursor-pointer hover:shadow-md transition-shadow"
      />
      <StatCard 
        title="Calories brûlées"
        value={isLoading ? "..." : stats.caloriesBurned.toLocaleString()}
        description={stats.caloriesBurned === 0 ? "Vos efforts compteront ici" : "cette semaine"}
        icon={<Flame className="text-fitness-orange" />}
        trend={stats.caloriesTrend}
        trendLabel={stats.caloriesBurned > 0 ? "vs semaine dernière" : ""}
        iconBackground="bg-fitness-orange/10"
        onClick={() => navigate('/nutrition')}
        actionLabel="Voir mon plan nutritionnel"
        className="cursor-pointer hover:shadow-md transition-shadow"
      />
      <StatCard 
        title="Temps d'entraînement"
        value={isLoading ? "..." : `${Math.floor(stats.workoutTime / 60)}h ${stats.workoutTime % 60}m`}
        description={stats.workoutTime === 0 ? "Chaque minute compte" : "cette semaine"}
        icon={<Timer className="text-fitness-blue" />}
        trend={stats.timeTrend}
        trendLabel={stats.workoutTime > 0 ? "vs semaine dernière" : ""}
        iconBackground="bg-fitness-blue/10"
        onClick={() => navigate('/workout/history')}
        actionLabel="Voir mon historique"
        className="cursor-pointer hover:shadow-md transition-shadow"
      />
      <StatCard 
        title="Qualité du sommeil"
        value={isLoading ? "..." : `${stats.sleepQuality}%`}
        description={stats.sleepQuality === 0 ? "Suivez votre récupération" : "moyenne"}
        icon={<Heart className="text-fitness-purple" />}
        trend={stats.sleepTrend}
        trendLabel={stats.sleepQuality > 0 ? "vs semaine dernière" : ""}
        iconBackground="bg-fitness-purple/10"
        onClick={() => navigate('/sleep')}
        actionLabel="Analyser mon sommeil"
        className="cursor-pointer hover:shadow-md transition-shadow"
      />
    </div>
  );
};

export default DashboardStats;

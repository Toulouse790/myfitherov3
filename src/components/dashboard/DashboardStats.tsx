
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/components/dashboard/StatCard';
import { Dumbbell, Flame, Timer, Heart } from 'lucide-react';
import { useUserStats } from '@/hooks/useUserStats';

const DashboardStats = () => {
  const navigate = useNavigate();
  const { stats, isLoading } = useUserStats();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Séances complétées"
        value={isLoading ? "..." : stats.completedWorkouts.toString()}
        description="cette semaine"
        icon={<Dumbbell size={20} className="text-primary" />}
        trend={stats.workoutTrend}
        trendLabel="vs semaine dernière"
        onClick={() => navigate('/workout')}
        actionLabel="Voir mes séances"
        className="cursor-pointer hover:shadow-md transition-shadow"
      />
      <StatCard 
        title="Calories brûlées"
        value={isLoading ? "..." : stats.caloriesBurned.toLocaleString()}
        description="cette semaine"
        icon={<Flame size={20} className="text-fitness-orange" />}
        trend={stats.caloriesTrend}
        trendLabel="vs semaine dernière"
        iconBackground="bg-fitness-orange/10"
        onClick={() => navigate('/nutrition')}
        actionLabel="Voir mon plan nutritionnel"
        className="cursor-pointer hover:shadow-md transition-shadow"
      />
      <StatCard 
        title="Temps d'entraînement"
        value={isLoading ? "..." : `${Math.floor(stats.workoutTime / 60)}h ${stats.workoutTime % 60}m`}
        description="cette semaine"
        icon={<Timer size={20} className="text-fitness-blue" />}
        trend={stats.timeTrend}
        trendLabel="vs semaine dernière"
        iconBackground="bg-fitness-blue/10"
        onClick={() => navigate('/workout/history')}
        actionLabel="Voir mon historique"
        className="cursor-pointer hover:shadow-md transition-shadow"
      />
      <StatCard 
        title="Qualité du sommeil"
        value={isLoading ? "..." : `${stats.sleepQuality}%`}
        description="moyenne"
        icon={<Heart size={20} className="text-fitness-purple" />}
        trend={stats.sleepTrend}
        trendLabel="vs semaine dernière"
        iconBackground="bg-fitness-purple/10"
        onClick={() => navigate('/sleep')}
        actionLabel="Analyser mon sommeil"
        className="cursor-pointer hover:shadow-md transition-shadow"
      />
    </div>
  );
};

export default DashboardStats;

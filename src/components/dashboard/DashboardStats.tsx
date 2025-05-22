
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/components/dashboard/StatCard';
import StreakCounter from '@/components/dashboard/StreakCounter';
import { Dumbbell, Flame, Timer, Heart } from 'lucide-react';

const DashboardStats = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default DashboardStats;

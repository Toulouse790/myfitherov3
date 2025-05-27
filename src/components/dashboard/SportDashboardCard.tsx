
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Flame } from 'lucide-react';
import { useUserStats } from '@/hooks/useUserStats';

interface SportStats {
  workout: { completed: boolean; duration: number; calories: number };
}

interface SportDashboardCardProps {
  stats: SportStats;
}

export function SportDashboardCard({ stats }: SportDashboardCardProps) {
  const navigate = useNavigate();
  const { stats: userStats } = useUserStats();
  const isNewUser = userStats.completedWorkouts === 0;

  return (
    <Card className="hover:shadow-md transition-all cursor-pointer group border-blue-200 bg-blue-50/30" onClick={() => navigate('/sport-tracker')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">Séances complétées</CardTitle>
        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          <Dumbbell className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">{userStats.completedWorkouts}</div>
        <p className="text-xs text-gray-500">
          {isNewUser ? "Prêt à commencer ?" : "cette semaine"}
        </p>
        
        {!isNewUser && (
          <div className="flex items-center gap-2 pt-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">{stats.workout.calories} cal</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

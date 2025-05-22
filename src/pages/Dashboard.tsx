
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import UpcomingWorkouts from '@/components/dashboard/UpcomingWorkouts';
import RecentAchievements from '@/components/dashboard/RecentAchievements';
import StreakCounter from '@/components/dashboard/StreakCounter';
import { Zap, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  // Prochains entraînements
  const upcomingWorkouts = [
    { id: 1, name: 'Musculation - Haut du corps', time: 'Aujourd\'hui, 18:00', duration: '45 min' },
    { id: 2, name: 'Cardio HIIT', time: 'Demain, 07:30', duration: '30 min' },
    { id: 3, name: 'Musculation - Bas du corps', time: 'Mercredi, 18:00', duration: '50 min' },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <DashboardHeader />
        <DashboardStats />
        
        {/* Gamification Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StreakCounter 
            currentStreak={7} 
            longestStreak={15} 
            title="Série d'entraînements" 
          />
          
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Target className="mr-2 text-blue-500" size={20} />
                Objectif de la semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Séances complétées</span>
                  <span className="font-medium">4/5</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: '80%' }}
                  ></div>
                </div>
                <p className="text-xs text-blue-600 font-medium">
                  Plus qu'une séance pour débloquer le badge "Warrior" ! 💪
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 text-green-500" size={20} />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  +12%
                </div>
                <p className="text-sm text-green-500 font-medium mb-2">
                  vs semaine dernière
                </p>
                <div className="flex justify-center">
                  <Zap className="text-green-500 animate-pulse" size={16} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DashboardCharts />
        
        {/* Upcoming Workouts & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingWorkouts workouts={upcomingWorkouts} />
          <RecentAchievements />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

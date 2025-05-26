
import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { UpcomingWorkouts } from '@/components/dashboard/UpcomingWorkouts';
import { RecentAchievements } from '@/components/dashboard/RecentAchievements';
import { WeatherRecommendations } from '@/components/ui/WeatherRecommendations';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { AICoachCard } from '@/components/coach/AICoachCard';
import { useWeatherRecommendations } from '@/hooks/useWeatherRecommendations';
import { HydrationDashboardCard } from '@/components/dashboard/HydrationDashboardCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { data: weatherRecommendations, isLoading } = useWeatherRecommendations();
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <DashboardHeader />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mt-6">
        {/* Colonne gauche: stats et graphiques */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardStats />
          
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="activity">Activité</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="space-y-4 pt-2">
              <DashboardCharts />
              <UpcomingWorkouts />
            </TabsContent>
            <TabsContent value="nutrition" className="space-y-4 pt-2">
              {/* Cartes Nutrition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HydrationDashboardCard />
                <div className="border border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center">
                  <span className="text-muted-foreground">
                    Macro-nutriments (à venir)
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <RecentAchievements />
        </div>
        
        {/* Colonne droite: coach, météo, etc. */}
        <div className="space-y-6">
          <AICoachCard />
          <StreakCounter />
          
          {weatherRecommendations && !isLoading && (
            <WeatherRecommendations 
              weather={weatherRecommendations.weather}
              recommendations={weatherRecommendations.recommendations}
            />
          )}
          
          <HydrationDashboardCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

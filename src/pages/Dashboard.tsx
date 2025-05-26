
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DashboardStats from '@/components/dashboard/DashboardStats';
import UpcomingWorkouts from '@/components/dashboard/UpcomingWorkouts';
import RecentAchievements from '@/components/dashboard/RecentAchievements';
import WeatherRecommendations from '@/components/ui/WeatherRecommendations';
import StreakCounter from '@/components/dashboard/StreakCounter';
import AICoachCard from '@/components/coach/AICoachCard';
import { useWeatherRecommendations } from '@/hooks/useWeatherRecommendations';
import { HydrationDashboardCard } from '@/components/dashboard/HydrationDashboardCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUpcomingWorkouts } from '@/hooks/useUpcomingWorkouts';

const Dashboard = () => {
  const { data: weatherRecommendations, isLoading } = useWeatherRecommendations();
  const { workouts } = useUpcomingWorkouts();
  
  return (
    <div className="container mx-auto p-3 max-w-7xl"> {/* Padding réduit */}
      <DashboardHeader />
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 mt-4"> {/* Gap et margin réduits */}
        {/* Colonne gauche: stats et graphiques */}
        <div className="lg:col-span-2 space-y-4"> {/* Espacement réduit */}
          <DashboardStats />
          
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-8"> {/* Hauteur réduite */}
              <TabsTrigger value="activity" className="text-xs">Activité</TabsTrigger> {/* Texte plus petit */}
              <TabsTrigger value="nutrition" className="text-xs">Nutrition</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="space-y-3 pt-2"> {/* Espacement réduit */}
              <DashboardCharts />
              <UpcomingWorkouts workouts={workouts} />
            </TabsContent>
            <TabsContent value="nutrition" className="space-y-3 pt-2"> {/* Espacement réduit */}
              {/* Cartes Nutrition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> {/* Gap réduit */}
                <HydrationDashboardCard />
                <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center h-[140px]"> {/* Hauteur et padding réduits */}
                  <span className="text-muted-foreground text-xs"> {/* Texte plus petit */}
                    Macro-nutriments (à venir)
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <RecentAchievements />
        </div>
        
        {/* Colonne droite: coach, météo, etc. */}
        <div className="space-y-4"> {/* Espacement réduit */}
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

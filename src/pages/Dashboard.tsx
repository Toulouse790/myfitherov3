
import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SportDashboardCard } from '@/components/dashboard/SportDashboardCard';
import { HydrationDashboardCard } from '@/components/dashboard/HydrationDashboardCard';
import { NutritionDashboardCard } from '@/components/dashboard/NutritionDashboardCard';
import { SleepDashboardCard } from '@/components/dashboard/SleepDashboardCard';
import { AIDashboardCard } from '@/components/dashboard/AIDashboardCard';
import { QuickActionsDashboardCard } from '@/components/dashboard/QuickActionsDashboardCard';
import { SimpleAI, UserContext } from '@/services/SimpleAI';

const Dashboard = () => {
  // Données simulées pour l'affichage
  const todayStats = {
    workout: { completed: true, duration: 45, calories: 347 },
    hydration: { current: 1800, target: 2500 },
    nutrition: { current: 1247, target: 1800, proteins: true, carbs: false, fats: true },
    sleep: { duration: 7.4, quality: 4 }
  };

  // Context pour l'IA Simple
  const userContext: UserContext = {
    workoutIntensity: 'high',
    weatherTemp: 22,
    sleepHours: 7.4,
    goal: 'weight_loss',
    currentWeight: 70,
    targetWeight: 65
  };

  const aiRecommendations = SimpleAI.generateRecommendations(userContext);
  const mainRecommendation = aiRecommendations[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-4 space-y-6 pb-6">
        <SportDashboardCard stats={{ workout: todayStats.workout }} />
        
        <HydrationDashboardCard />
        
        <NutritionDashboardCard stats={{ nutrition: todayStats.nutrition }} />
        
        <SleepDashboardCard stats={{ sleep: todayStats.sleep }} />
        
        <AIDashboardCard recommendation={mainRecommendation} />
        
        <QuickActionsDashboardCard />
      </main>
    </div>
  );
};

export default Dashboard;

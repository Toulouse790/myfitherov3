
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SportDashboardCard } from '@/components/dashboard/SportDashboardCard';
import { HydrationDashboardCard } from '@/components/dashboard/HydrationDashboardCard';
import { NutritionDashboardCard } from '@/components/dashboard/NutritionDashboardCard';
import { SleepDashboardCard } from '@/components/dashboard/SleepDashboardCard';
import { AIDashboardCard } from '@/components/dashboard/AIDashboardCard';
import { QuickActionsDashboardCard } from '@/components/dashboard/QuickActionsDashboardCard';
import { ResponsiveContainer } from '@/components/layout/ResponsiveContainer';
import { PerformanceOptimizer } from '@/components/ui/PerformanceOptimizer';
import { SimpleAI, UserContext } from '@/services/SimpleAI';
import { useUserStats } from '@/hooks/useUserStats';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { stats: userStats } = useUserStats();

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

  // Vérifier si c'est un nouvel utilisateur
  const isNewUser = userStats.completedWorkouts === 0;

  return (
    <>
      <PerformanceOptimizer />
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />

        <ResponsiveContainer maxWidth="2xl" padding="md">
          <main className="space-y-6 pb-6">
            
            {/* Stats principales - Grid vraiment responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SportDashboardCard stats={{ workout: todayStats.workout }} />
              <div className="sm:col-span-1">
                <HydrationDashboardCard />
              </div>
              <NutritionDashboardCard stats={{ nutrition: todayStats.nutrition }} />
              <SleepDashboardCard stats={{ sleep: todayStats.sleep }} />
            </div>

            {/* Section pour démarrer - Seulement si nouveau utilisateur */}
            {isNewUser && (
              <Card className="text-center py-8 border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent>
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Prêt à commencer votre transformation ?</h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">Votre première séance vous attend ! Commencez dès maintenant votre parcours vers une meilleure forme.</p>
                  <Button onClick={() => navigate('/sport-tracker')} size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                    Commencer ma première séance
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIDashboardCard recommendation={mainRecommendation} />
              <QuickActionsDashboardCard />
            </div>
          </main>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Dashboard;

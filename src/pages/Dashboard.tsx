
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Droplet, Dumbbell, Flame, Timer, Heart, Settings } from 'lucide-react';
import { HydrationDashboardCard } from '@/components/dashboard/HydrationDashboardCard';
import { SimpleAI, UserContext } from '@/services/SimpleAI';

const Dashboard = () => {
  const navigate = useNavigate();
  
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

  const hydrationPercentage = (todayStats.hydration.current / todayStats.hydration.target) * 100;
  const nutritionPercentage = (todayStats.nutrition.current / todayStats.nutrition.target) * 100;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🏠 MyFitHero - Dashboard
              </h1>
              <p className="text-sm text-gray-600">Votre progression du jour</p>
            </div>
            <Button variant="outline" size="sm">
              <Calendar size={16} />
              Aujourd'hui
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Sport Section */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              🏃‍♂️ Sport Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💪</span>
                  <div>
                    <div className="font-semibold">Workout - {todayStats.workout.duration}min</div>
                    <div className="text-sm text-gray-600">Séance complétée</div>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-500">✅</Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-lg">{todayStats.workout.calories} calories</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hydratation Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              💧 Hydratation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {(todayStats.hydration.current / 1000).toFixed(1)}L / {(todayStats.hydration.target / 1000).toFixed(1)}L
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(hydrationPercentage)}%
                </span>
              </div>
              
              <Progress value={hydrationPercentage} className="h-3" />
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => {}}>
                  +200ml
                </Button>
                <Button size="sm" variant="outline" onClick={() => {}}>
                  +500ml
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              🥗 Nutrition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {todayStats.nutrition.current.toLocaleString()} / {todayStats.nutrition.target.toLocaleString()} cal
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(nutritionPercentage)}%
                </span>
              </div>
              
              <Progress value={nutritionPercentage} className="h-3" />
              
              <div className="flex gap-3 mt-3">
                <Badge variant={todayStats.nutrition.proteins ? "default" : "secondary"}>
                  Protéines {todayStats.nutrition.proteins ? "✅" : "⚠️"}
                </Badge>
                <Badge variant={todayStats.nutrition.carbs ? "default" : "destructive"}>
                  Glucides {todayStats.nutrition.carbs ? "✅" : "⚠️"}
                </Badge>
                <Badge variant={todayStats.nutrition.fats ? "default" : "secondary"}>
                  Lipides {todayStats.nutrition.fats ? "✅" : "⚠️"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sommeil Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              😴 Sommeil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-lg">
                  {Math.floor(todayStats.sleep.duration)}h{String(Math.round((todayStats.sleep.duration % 1) * 60)).padStart(2, '0')}
                </span>
                <div className="flex">
                  {renderStars(todayStats.sleep.quality)}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/sleep')}>
                Détails
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conseil IA Section */}
        {mainRecommendation && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                💡 Conseil IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div className="flex-1">
                  <p className="font-medium text-blue-900">
                    "{mainRecommendation.message}"
                  </p>
                  {mainRecommendation.value && (
                    <p className="text-sm text-blue-700 mt-1">
                      Recommandation: {mainRecommendation.value} {mainRecommendation.unit}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <Button size="sm" onClick={() => navigate('/simple-ai')}>
                  Voir tous les conseils
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button variant="outline" onClick={() => navigate('/workout')} className="h-auto py-3 flex-col gap-2">
                <Dumbbell size={20} />
                <span className="text-xs">Nouvelle séance</span>
              </Button>
              <Button variant="outline" onClick={() => navigate('/nutrition')} className="h-auto py-3 flex-col gap-2">
                🍎
                <span className="text-xs">Ajouter repas</span>
              </Button>
              <Button variant="outline" onClick={() => navigate('/sleep')} className="h-auto py-3 flex-col gap-2">
                😴
                <span className="text-xs">Sommeil</span>
              </Button>
              <Button variant="outline" onClick={() => navigate('/simple-ai')} className="h-auto py-3 flex-col gap-2">
                🤖
                <span className="text-xs">Coach IA</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;

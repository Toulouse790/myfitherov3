import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Droplet, Dumbbell, Flame, Timer, Heart, Settings } from 'lucide-react';
import { HydrationDashboardCard } from '@/components/dashboard/HydrationDashboardCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentHydration, setCurrentHydration] = useState(0);
  const dailyGoal = 2500;

  // Données utilisateur (à connecter aux vrais hooks plus tard)
  const userStats = {
    workouts: 0,
    calories: 0,
    workoutTime: 0,
    sleepQuality: 0
  };

  const addWater = (amount: number) => {
    setCurrentHydration(prev => Math.min(prev + amount, dailyGoal));
  };

  const hydrationPercentage = (currentHydration / dailyGoal) * 100;
  const remaining = dailyGoal - currentHydration;

  const agents = [
    { name: 'Expert Sport', icon: '🏃', status: 'online', color: 'bg-red-50 text-red-600' },
    { name: 'Expert Nutrition', icon: '🥗', status: 'online', color: 'bg-green-50 text-green-600' },
    { name: 'Expert Sommeil', icon: '😴', status: 'online', color: 'bg-purple-50 text-purple-600' },
    { name: 'Expert Hydratation', icon: '💧', status: 'standby', color: 'bg-blue-50 text-blue-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
              <p className="text-sm text-gray-600">Bonjour Thomas, voici un aperçu de votre progression</p>
            </div>
            <Button className="w-fit flex items-center gap-2">
              <Calendar size={16} />
              Cette semaine
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* Stats principales - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/workout')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Séances complétées</CardTitle>
              <Dumbbell className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.workouts}</div>
              <p className="text-xs text-gray-600">
                {userStats.workouts === 0 ? "Prêt à commencer ?" : "cette semaine"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/nutrition')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories brûlées</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.calories}</div>
              <p className="text-xs text-gray-600">
                {userStats.calories === 0 ? "Vos efforts compteront ici" : "cette semaine"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps d'entraînement</CardTitle>
              <Timer className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(userStats.workoutTime / 60)}h {userStats.workoutTime % 60}m
              </div>
              <p className="text-xs text-gray-600">
                {userStats.workoutTime === 0 ? "Chaque minute compte" : "cette semaine"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/sleep')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qualité du sommeil</CardTitle>
              <Heart className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.sleepQuality}%</div>
              <p className="text-xs text-gray-600">
                {userStats.sleepQuality === 0 ? "Suivez votre récupération" : "moyenne"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Section pour démarrer */}
        {userStats.workouts === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold mb-2">Prêt à commencer votre transformation ?</h3>
              <p className="text-gray-600 mb-4">Votre première séance vous attend !</p>
              <Button onClick={() => navigate('/workout')} size="lg">
                Commencer ma première séance
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Hydratation - Version simplifiée */}
          <HydrationDashboardCard />

          {/* Agents IA */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  🤖 Agents IA Spécialisés
                </CardTitle>
                <CardDescription>Vos coachs personnels</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Settings size={14} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agents.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${agent.color} flex items-center justify-center`}>
                        {agent.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{agent.name}</div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            agent.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-xs text-gray-600">
                            {agent.status === 'online' ? 'En ligne' : 'Standby'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="text-xs">
                      {agent.status === 'online' ? 'Actif' : 'Standby'}
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Performance collective */}
              <div className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm opacity-90">Performance Collective</div>
                    <div className="text-2xl font-bold">92%</div>
                    <div className="text-xs opacity-90">précision</div>
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1 mb-2">
                  <div className="bg-white h-1 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <div className="flex justify-between text-xs opacity-90">
                  <span>4 agents actifs</span>
                  <span>5 agents total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button variant="outline" onClick={() => navigate('/workout')} className="h-auto py-3 flex-col gap-2">
                <Dumbbell size={20} />
                <span className="text-xs">Démarrer séance</span>
              </Button>
              <Button variant="outline" onClick={() => navigate('/nutrition')} className="h-auto py-3 flex-col gap-2">
                🍎
                <span className="text-xs">Nutrition</span>
              </Button>
              <Button variant="outline" onClick={() => navigate('/sleep')} className="h-auto py-3 flex-col gap-2">
                😴
                <span className="text-xs">Sommeil</span>
              </Button>
              <Button variant="outline" onClick={() => navigate('/coach')} className="h-auto py-3 flex-col gap-2">
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

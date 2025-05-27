
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SportDashboard from '@/components/sport/SportDashboard';
import WorkoutHistory from '@/components/sport/WorkoutHistory';
import SmartSuggestions from '@/components/sport/SmartSuggestions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSportStats } from '@/features/sport/tracking/hooks';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SportTracker = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: stats } = useSportStats();

  // Données mockées pour les graphiques
  const progressData = [
    { name: 'Sem 1', workouts: 3, calories: 1200, duration: 180 },
    { name: 'Sem 2', workouts: 4, calories: 1600, duration: 240 },
    { name: 'Sem 3', workouts: 3, calories: 1400, duration: 210 },
    { name: 'Sem 4', workouts: 5, calories: 2000, duration: 300 },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header avec statistiques rapides */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Sport Tracker</h1>
              <p className="text-muted-foreground">
                Suivez vos performances et atteignez vos objectifs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex">
                🔥 Streak: {stats?.currentStreak || 0} jours
              </Badge>
              <Button>
                Nouvelle séance
              </Button>
            </div>
          </div>

          {/* Métriques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold">{stats?.totalWorkouts || 0}</div>
              <div className="text-xs text-muted-foreground">Séances</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold">{Math.floor((stats?.totalDuration || 0) / 60)}h</div>
              <div className="text-xs text-muted-foreground">Temps total</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold">{stats?.totalCalories || 0}</div>
              <div className="text-xs text-muted-foreground">Calories</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold">{stats?.averageIntensity.toFixed(1) || '0.0'}</div>
              <div className="text-xs text-muted-foreground">Intensité moy.</div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
            <TabsTrigger value="suggestions">IA Coach</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6 mt-6">
            <SportDashboard />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6 mt-6">
            <WorkoutHistory />
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progression des séances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="workouts" 
                          stroke="#3b82f6" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calories brûlées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="calories" 
                          stroke="#ef4444" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Records personnels */}
            <Card>
              <CardHeader>
                <CardTitle>Records personnels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats?.personalRecords.map((record, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{record.exerciseName}</span>
                        <Badge variant="outline">PR</Badge>
                      </div>
                      <div className="text-2xl font-bold">
                        {record.value} {record.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(record.achievedDate).toLocaleDateString()}
                      </div>
                    </div>
                  )) || (
                    <div className="col-span-3 text-center py-8 text-muted-foreground">
                      Aucun record personnel enregistré
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="suggestions" className="space-y-6 mt-6">
            <SmartSuggestions />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SportTracker;

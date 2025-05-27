
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SleepQualityCard from '@/components/sleep/SleepQualityCard';
import SleepTracker from '@/components/sleep/SleepTracker';
import SleepStats from '@/components/sleep/SleepStats';
import SleepRoutines from '@/components/sleep/SleepRoutines';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Moon, TrendingUp, Target, Bell } from 'lucide-react';

const Sleep = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Module Sommeil</h1>
              <p className="text-muted-foreground">
                Optimisez votre récupération et vos performances avec un suivi intelligent du sommeil
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex">
                🌙 Sommeil moyen: 7.4h
              </Badge>
              <Badge variant="outline" className="hidden sm:flex">
                ⭐ Qualité: 3.9/5
              </Badge>
            </div>
          </div>

          {/* Métriques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold">7.4h</div>
              <div className="text-xs text-muted-foreground">Moyenne semaine</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold">85%</div>
              <div className="text-xs text-muted-foreground">Consistance</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold">92%</div>
              <div className="text-xs text-muted-foreground">Récupération</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold">3.9</div>
              <div className="text-xs text-muted-foreground">Qualité moy.</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="tracking" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="routines" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Routines
            </TabsTrigger>
            <TabsTrigger value="recovery" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Récupération
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracking" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <SleepQualityCard 
                  quality={85}
                  restfulness={78}
                  heartRate={58}
                  deepSleepPercentage={25}
                  remSleepPercentage={20}
                  lightSleepPercentage={55}
                />
              </div>
              <div className="lg:col-span-2">
                <SleepTracker />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-6 mt-6">
            <SleepStats />
          </TabsContent>
          
          <TabsContent value="routines" className="space-y-6 mt-6">
            <SleepRoutines />
          </TabsContent>
          
          <TabsContent value="recovery" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Conseils récupération selon sport */}
              <Card>
                <CardHeader>
                  <CardTitle>Conseils récupération sport</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">🏃‍♂️ Après cardio intense</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Sommeil minimum 8h requis</li>
                      <li>• Éviter caféine 6h avant coucher</li>
                      <li>• Douche tiède pour détente</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">💪 Après musculation</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Sommeil profond crucial pour récupération musculaire</li>
                      <li>• Protéines 30min avant coucher</li>
                      <li>• Étirements doux recommandés</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Optimisation nutrition */}
              <Card>
                <CardHeader>
                  <CardTitle>Optimisation nutrition</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium mb-2">🥗 Aliments pro-sommeil</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Cerise (mélatonine naturelle)</li>
                      <li>• Amandes (magnésium)</li>
                      <li>• Poisson gras (oméga-3)</li>
                      <li>• Tisanes camomille/verveine</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium mb-2">❌ À éviter le soir</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Caféine après 14h</li>
                      <li>• Alcool 3h avant coucher</li>
                      <li>• Repas copieux 2h avant</li>
                      <li>• Sucres rapides</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Intégration avec entraînements */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Intégration avec vos entraînements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-center mb-3">
                        <div className="text-2xl mb-1">🌅</div>
                        <h4 className="font-medium">Entraînement matin</h4>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Coucher: 22h30</li>
                        <li>• Lever: 6h00</li>
                        <li>• Pré-workout: 6h15</li>
                        <li>• Parfait pour métabolisme</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="text-center mb-3">
                        <div className="text-2xl mb-1">☀️</div>
                        <h4 className="font-medium">Entraînement midi</h4>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Sieste power 20min possible</li>
                        <li>• Récupération optimale</li>
                        <li>• Sommeil nocturne préservé</li>
                        <li>• Hydratation importante</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="text-center mb-3">
                        <div className="text-2xl mb-1">🌆</div>
                        <h4 className="font-medium">Entraînement soir</h4>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Finir minimum 3h avant coucher</li>
                        <li>• Étirements post-workout</li>
                        <li>• Douche tiède relaxante</li>
                        <li>• Peut retarder endormissement</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Sleep;

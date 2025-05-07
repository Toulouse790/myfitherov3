
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SleepQualityCard from '@/components/sleep/SleepQualityCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import { ArrowRight, Moon, Sun, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Sleep = () => {
  // Données de sommeil pour la semaine
  const weeklyData = [
    { day: 'Lun', heures: 7.2, qualité: 76, couché: '23:15', levé: '06:25' },
    { day: 'Mar', heures: 6.8, qualité: 68, couché: '23:45', levé: '06:30' },
    { day: 'Mer', heures: 8.1, qualité: 85, couché: '22:30', levé: '06:35' },
    { day: 'Jeu', heures: 7.5, qualité: 79, couché: '23:00', levé: '06:30' },
    { day: 'Ven', heures: 7.0, qualité: 72, couché: '23:30', levé: '06:30' },
    { day: 'Sam', heures: 8.3, qualité: 88, couché: '23:00', levé: '07:15' },
    { day: 'Dim', heures: 8.5, qualité: 90, couché: '22:45', levé: '07:15' },
  ];

  // Données pour les phases de sommeil
  const sleepPhaseData = [
    { time: '23:00', phase: 'Éveil' },
    { time: '23:30', phase: 'Léger' },
    { time: '00:00', phase: 'Profond' },
    { time: '00:30', phase: 'Profond' },
    { time: '01:00', phase: 'Paradoxal' },
    { time: '01:30', phase: 'Léger' },
    { time: '02:00', phase: 'Profond' },
    { time: '02:30', phase: 'Profond' },
    { time: '03:00', phase: 'Paradoxal' },
    { time: '03:30', phase: 'Léger' },
    { time: '04:00', phase: 'Léger' },
    { time: '04:30', phase: 'Profond' },
    { time: '05:00', phase: 'Paradoxal' },
    { time: '05:30', phase: 'Léger' },
    { time: '06:00', phase: 'Léger' },
    { time: '06:30', phase: 'Éveil' },
  ];

  // Conseils de sommeil
  const sleepTips = [
    {
      title: "Maintenir un horaire régulier",
      description: "Se coucher et se lever à la même heure chaque jour, même le week-end."
    },
    {
      title: "Créer un environnement propice au sommeil",
      description: "Chambre sombre, silencieuse et fraîche (16-18°C)."
    },
    {
      title: "Limiter l'exposition à la lumière bleue",
      description: "Éviter les écrans 1-2 heures avant le coucher."
    },
    {
      title: "Éviter les stimulants",
      description: "Pas de caféine après 14h et d'alcool avant le coucher."
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Suivi du sommeil</h1>
          <p className="text-muted-foreground">Analysez vos cycles et obtenez des recommandations pour améliorer la qualité de votre sommeil</p>
        </div>

        <Tabs defaultValue="aperçu" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="aperçu">Aperçu</TabsTrigger>
            <TabsTrigger value="analyse">Analyse détaillée</TabsTrigger>
            <TabsTrigger value="recommandations">Recommandations</TabsTrigger>
            <TabsTrigger value="tendances">Tendances</TabsTrigger>
          </TabsList>

          <TabsContent value="aperçu" className="space-y-6 mt-0">
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
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Durée et qualité du sommeil</CardTitle>
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Info size={16} />
                              <span className="sr-only">Information</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Barres: durée du sommeil en heures<br/>
                            Ligne: qualité du sommeil sur 100</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </div>
                    <CardDescription>Aperçu de votre sommeil sur les 7 derniers jours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={weeklyData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
                          <XAxis dataKey="day" />
                          <YAxis yAxisId="left" orientation="left" stroke="var(--muted-foreground)" />
                          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="var(--fitness-purple)" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "var(--card)",
                              borderColor: "var(--border)",
                              borderRadius: "var(--radius)",
                              color: "var(--card-foreground)"
                            }}
                          />
                          <Legend />
                          <Bar yAxisId="left" dataKey="heures" name="Heures de sommeil" fill="var(--fitness-blue)" radius={[4, 4, 0, 0]} />
                          <Line yAxisId="right" type="monotone" dataKey="qualité" name="Qualité du sommeil" stroke="var(--fitness-purple)" strokeWidth={2} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Journal de sommeil</CardTitle>
                  <Button variant="outline" size="sm">Voir plus</Button>
                </div>
                <CardDescription>Vos derniers enregistrements de sommeil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left font-medium">Date</th>
                        <th className="py-3 text-left font-medium">Couché</th>
                        <th className="py-3 text-left font-medium">Levé</th>
                        <th className="py-3 text-left font-medium">Durée</th>
                        <th className="py-3 text-left font-medium">Qualité</th>
                        <th className="py-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyData.map((day, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-3">{day.day}</td>
                          <td className="py-3">{day.couché}</td>
                          <td className="py-3">{day.levé}</td>
                          <td className="py-3">{day.heures}h</td>
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-16 h-2 bg-muted overflow-hidden rounded-full mr-2">
                                <div 
                                  className={cn("h-full", 
                                    day.qualité > 80 ? "bg-green-500" : 
                                    day.qualité > 60 ? "bg-blue-500" : 
                                    day.qualité > 40 ? "bg-yellow-500" : "bg-red-500"
                                  )}
                                  style={{ width: `${day.qualité}%` }}
                                ></div>
                              </div>
                              <span>{day.qualité}%</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <Button variant="ghost" size="sm">
                              <ArrowRight size={16} />
                              <span className="sr-only">Voir détails</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analyse" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cycles de sommeil</CardTitle>
                  <CardDescription>Analyse détaillée des phases de votre sommeil hier soir</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={sleepPhaseData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
                        <XAxis dataKey="time" />
                        <YAxis 
                          type="category" 
                          dataKey="phase"
                          ticks={["Éveil", "Léger", "Profond", "Paradoxal"]} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            borderRadius: "var(--radius)",
                            color: "var(--card-foreground)"
                          }}
                        />
                        <Line type="stepAfter" dataKey="phase" stroke="var(--fitness-purple)" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Résumé de la nuit</CardTitle>
                  <CardDescription>Statistiques détaillées de votre sommeil</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Moon className="text-blue-400 mr-2" size={20} />
                        <span>Heure de coucher</span>
                      </div>
                      <span className="font-medium">22:45</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Sun className="text-yellow-400 mr-2" size={20} />
                        <span>Heure de réveil</span>
                      </div>
                      <span className="font-medium">07:15</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span>Durée de sommeil</span>
                      </div>
                      <span className="font-medium">8h 30min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span>Sommeil profond</span>
                      </div>
                      <span className="font-medium">2h 07min (25%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span>Sommeil paradoxal</span>
                      </div>
                      <span className="font-medium">1h 42min (20%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span>Sommeil léger</span>
                      </div>
                      <span className="font-medium">4h 41min (55%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span>Éveils nocturnes</span>
                      </div>
                      <span className="font-medium">2 (total 12min)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span>Fréquence cardiaque moyenne</span>
                      </div>
                      <span className="font-medium">58 bpm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommandations" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sleepTips.map((tip, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p>{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Votre plan de sommeil personnalisé</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">En fonction de vos données, voici les horaires recommandés pour optimiser votre sommeil:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Moon className="text-blue-400 mr-2" size={20} />
                        <h3 className="font-semibold">Heure idéale de coucher</h3>
                      </div>
                      <p className="text-2xl font-medium">22:30 - 23:00</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Sun className="text-yellow-400 mr-2" size={20} />
                        <h3 className="font-semibold">Heure idéale de réveil</h3>
                      </div>
                      <p className="text-2xl font-medium">06:30 - 07:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tendances" className="mt-0">
            <div className="text-center p-12">
              <h3 className="text-xl font-medium text-muted-foreground">
                Les tendances seront disponibles après 4 semaines de suivi du sommeil
              </h3>
              <p className="mt-2 text-muted-foreground">
                Continuez à enregistrer votre sommeil pour débloquer cette fonctionnalité
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Sleep;

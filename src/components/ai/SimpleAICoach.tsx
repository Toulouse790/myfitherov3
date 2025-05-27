
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SimpleAI, UserContext, SimpleRecommendation } from '@/services/SimpleAI';
import { Droplets, Apple, Dumbbell, Moon, Target } from 'lucide-react';

const SimpleAICoach = () => {
  const [context, setContext] = useState<UserContext>({
    workoutIntensity: 'medium',
    weatherTemp: 22,
    sleepHours: 7,
    goal: 'maintenance',
    currentWeight: 70,
    targetWeight: undefined
  });
  
  const [recommendations, setRecommendations] = useState<SimpleRecommendation[]>([]);

  const generateRecommendations = () => {
    const recs = SimpleAI.generateRecommendations(context);
    setRecommendations(recs);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hydration': return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'nutrition': return <Apple className="h-4 w-4 text-green-500" />;
      case 'workout': return <Dumbbell className="h-4 w-4 text-orange-500" />;
      case 'sleep': return <Moon className="h-4 w-4 text-purple-500" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>IA Coach Simple</CardTitle>
          <p className="text-muted-foreground">
            Recommandations intelligentes basées sur vos données
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Intensité sport</label>
              <select 
                className="w-full p-2 border rounded"
                value={context.workoutIntensity}
                onChange={(e) => setContext({...context, workoutIntensity: e.target.value as any})}
              >
                <option value="low">Léger</option>
                <option value="medium">Modéré</option>
                <option value="high">Intense</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Température (°C)</label>
              <input 
                type="number"
                className="w-full p-2 border rounded"
                value={context.weatherTemp}
                onChange={(e) => setContext({...context, weatherTemp: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Sommeil (h)</label>
              <input 
                type="number"
                step="0.5"
                className="w-full p-2 border rounded"
                value={context.sleepHours}
                onChange={(e) => setContext({...context, sleepHours: parseFloat(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Objectif</label>
              <select 
                className="w-full p-2 border rounded"
                value={context.goal}
                onChange={(e) => setContext({...context, goal: e.target.value as any})}
              >
                <option value="weight_loss">Perte poids</option>
                <option value="muscle_gain">Prise masse</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Poids actuel (kg)</label>
              <input 
                type="number"
                className="w-full p-2 border rounded"
                value={context.currentWeight}
                onChange={(e) => setContext({...context, currentWeight: parseInt(e.target.value)})}
              />
            </div>
            
            {context.goal === 'weight_loss' && (
              <div>
                <label className="text-sm font-medium">Poids cible (kg)</label>
                <input 
                  type="number"
                  className="w-full p-2 border rounded"
                  value={context.targetWeight || ''}
                  onChange={(e) => setContext({...context, targetWeight: parseInt(e.target.value)})}
                />
              </div>
            )}
          </div>

          <Button onClick={generateRecommendations} className="w-full">
            Générer les recommandations IA
          </Button>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommandations personnalisées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                {getTypeIcon(rec.type)}
                <div className="flex-1">
                  <p className="font-medium">{rec.message}</p>
                  {rec.value && (
                    <Badge variant="outline" className="mt-1">
                      {rec.value} {rec.unit}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Objectifs calculés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">
              {SimpleAI.getHydrationTarget(context)}L
            </div>
            <div className="text-sm text-muted-foreground">Hydratation cible</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Apple className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">
              {SimpleAI.getCalorieTarget(context)}
            </div>
            <div className="text-sm text-muted-foreground">Calories/jour</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Dumbbell className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-sm font-medium text-center">
              {SimpleAI.getWorkoutRecommendation(context)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleAICoach;

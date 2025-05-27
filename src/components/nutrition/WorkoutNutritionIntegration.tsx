
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Dumbbell, Zap, Droplets, Activity } from 'lucide-react';
import { useCurrentWorkout } from '@/features/sport/tracking/hooks';

interface WorkoutNutritionPlan {
  phase: 'pre' | 'during' | 'post';
  timeframe: string;
  recommendations: {
    type: 'food' | 'drink' | 'supplement';
    item: string;
    quantity: string;
    reason: string;
    timing: string;
  }[];
}

const WorkoutNutritionIntegration = () => {
  const { data: currentWorkout } = useCurrentWorkout();
  const [selectedPhase, setSelectedPhase] = useState<'pre' | 'during' | 'post'>('pre');

  // Plan nutritionnel basé sur le type d'entraînement
  const getWorkoutNutritionPlan = (): WorkoutNutritionPlan[] => {
    const workoutType = currentWorkout?.type || 'strength';
    
    const plans: Record<string, WorkoutNutritionPlan[]> = {
      strength: [
        {
          phase: 'pre',
          timeframe: '1-2h avant',
          recommendations: [
            {
              type: 'food',
              item: 'Banane + 30g amandes',
              quantity: '1 portion',
              reason: 'Glucides rapides + graisses saines pour énergie soutenue',
              timing: '1h avant'
            },
            {
              type: 'drink',
              item: 'Eau',
              quantity: '500ml',
              reason: 'Hydratation optimale avant effort',
              timing: '30min avant'
            }
          ]
        },
        {
          phase: 'during',
          timeframe: 'Pendant l\'entraînement',
          recommendations: [
            {
              type: 'drink',
              item: 'Eau + électrolytes',
              quantity: '150-200ml/15min',
              reason: 'Maintien hydratation et équilibre électrolytique',
              timing: 'Toutes les 15min'
            }
          ]
        },
        {
          phase: 'post',
          timeframe: '0-2h après',
          recommendations: [
            {
              type: 'food',
              item: 'Whey + banane',
              quantity: '30g protéines',
              reason: 'Fenêtre anabolique - synthèse protéique maximale',
              timing: '30min après'
            },
            {
              type: 'drink',
              item: 'Eau',
              quantity: '750ml',
              reason: 'Réhydratation complète',
              timing: '2h après'
            }
          ]
        }
      ],
      cardio: [
        {
          phase: 'pre',
          timeframe: '1-2h avant',
          recommendations: [
            {
              type: 'food',
              item: 'Flocons d\'avoine + miel',
              quantity: '40g',
              reason: 'Glucides complexes pour endurance',
              timing: '2h avant'
            },
            {
              type: 'drink',
              item: 'Café',
              quantity: '1 tasse',
              reason: 'Boost performance et oxydation graisses',
              timing: '45min avant'
            }
          ]
        },
        {
          phase: 'during',
          timeframe: 'Pendant l\'effort',
          recommendations: [
            {
              type: 'drink',
              item: 'Boisson isotonique',
              quantity: '200ml/20min',
              reason: 'Maintien glycémie et hydratation',
              timing: 'Toutes les 20min'
            }
          ]
        },
        {
          phase: 'post',
          timeframe: '0-1h après',
          recommendations: [
            {
              type: 'food',
              item: 'Smoothie fruits + protéines',
              quantity: '250ml',
              reason: 'Récupération glycogène + réparation musculaire',
              timing: '30min après'
            }
          ]
        }
      ]
    };

    return plans[workoutType] || plans.strength;
  };

  const nutritionPlan = getWorkoutNutritionPlan();
  const currentPlan = nutritionPlan.find(p => p.phase === selectedPhase);

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'pre': return <Clock className="h-4 w-4" />;
      case 'during': return <Activity className="h-4 w-4" />;
      case 'post': return <Zap className="h-4 w-4" />;
      default: return <Dumbbell className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'food': return '🍎';
      case 'drink': return '🥤';
      case 'supplement': return '💊';
      default: return '🍽️';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête intégration */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Dumbbell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Nutrition × Entraînement</CardTitle>
                <p className="text-muted-foreground">
                  Plan nutritionnel adapté à votre séance
                </p>
              </div>
            </div>
            {currentWorkout && (
              <Badge className="bg-green-100 text-green-800">
                {currentWorkout.title} en cours
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentWorkout?.type === 'cardio' ? '65%' : '85%'}
              </div>
              <div className="text-sm text-muted-foreground">Énergie optimisée</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+22%</div>
              <div className="text-sm text-muted-foreground">Récupération</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3.2L</div>
              <div className="text-sm text-muted-foreground">Hydratation cible</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sélecteur de phase */}
      <Card>
        <CardHeader>
          <CardTitle>Plan nutritionnel par phase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            {['pre', 'during', 'post'].map((phase) => (
              <Button
                key={phase}
                variant={selectedPhase === phase ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPhase(phase as any)}
                className="flex items-center gap-2"
              >
                {getPhaseIcon(phase)}
                {phase === 'pre' ? 'Pré-workout' : 
                 phase === 'during' ? 'Pendant' : 'Post-workout'}
              </Button>
            ))}
          </div>

          {currentPlan && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{currentPlan.timeframe}</Badge>
                <span className="text-sm text-muted-foreground">
                  Entraînement : {currentWorkout?.type || 'Musculation'}
                </span>
              </div>

              {currentPlan.recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getTypeIcon(rec.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{rec.item}</h4>
                        <Badge variant="secondary">{rec.quantity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.reason}
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {rec.timing}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suivi en temps réel */}
      {currentWorkout && (
        <Card>
          <CardHeader>
            <CardTitle>Suivi nutritionnel en temps réel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Hydratation</span>
                </div>
                <Progress value={68} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  1.4L / 2.1L cible pendant l'effort
                </p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Énergie</span>
                </div>
                <Progress value={82} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  Niveau optimal maintenu
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Droplets className="h-4 w-4 mr-2" />
                Boire maintenant
              </Button>
              <Button variant="outline" size="sm">
                Ajuster plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutNutritionIntegration;

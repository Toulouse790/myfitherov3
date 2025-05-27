
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Sparkles, Target, TrendingUp, Zap, Apple } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface NutritionRecommendation {
  id: string;
  type: 'meal' | 'hydration' | 'supplement' | 'timing';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  reason: string;
}

const NutritionAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<NutritionRecommendation[]>([
    {
      id: '1',
      type: 'meal',
      title: 'Collation pré-entraînement optimisée',
      description: 'Banane + 30g d\'amandes 1h avant votre séance de musculation',
      priority: 'high',
      confidence: 92,
      reason: 'Basé sur votre entraînement de musculation à 18h et votre objectif de prise de masse'
    },
    {
      id: '2',
      type: 'hydration',
      title: 'Hydratation renforcée',
      description: 'Augmentez à 3.2L aujourd\'hui (temps chaud + cardio intense)',
      priority: 'high',
      confidence: 88,
      reason: 'Température 28°C + séance cardio 60min prévue'
    },
    {
      id: '3',
      type: 'timing',
      title: 'Fenêtre anabolique optimale',
      description: 'Protéines dans les 30min post-workout pour maximiser la récupération',
      priority: 'medium',
      confidence: 85,
      reason: 'Séance jambes intense + objectif développement musculaire'
    }
  ]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Analyse IA terminée !', {
        description: '3 nouvelles recommandations personnalisées générées'
      });
    } catch (error) {
      toast.error('Erreur lors de l\'analyse IA');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Apple className="h-4 w-4" />;
      case 'hydration': return <span className="text-blue-500">💧</span>;
      case 'supplement': return <Zap className="h-4 w-4" />;
      case 'timing': return <Target className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête IA */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Coach IA Nutrition</CardTitle>
                <p className="text-muted-foreground">Recommandations personnalisées en temps réel</p>
              </div>
            </div>
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-pulse" />
                  Analyse...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyser
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <div className="text-sm text-muted-foreground">Précision IA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-muted-foreground">Données analysées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-muted-foreground">Recommandations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations IA */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations personnalisées</CardTitle>
          <p className="text-sm text-muted-foreground">
            Basées sur vos entraînements, objectifs et données biométriques
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(rec.type)}
                  <div>
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority === 'high' ? 'Priorité haute' : 
                     rec.priority === 'medium' ? 'Priorité moyenne' : 'Priorité faible'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Confiance IA</span>
                  <span className="font-medium">{rec.confidence}%</span>
                </div>
                <Progress value={rec.confidence} className="h-2" />
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  <strong>Pourquoi cette recommandation :</strong> {rec.reason}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Appliquer
                </Button>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
                <Button variant="ghost" size="sm">
                  Ignorer
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Apprentissage IA */}
      <Card>
        <CardHeader>
          <CardTitle>Apprentissage continu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">Améliorations détectées</span>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Énergie +15% avec timing optimisé</li>
                <li>• Récupération +22% avec protéines post-workout</li>
                <li>• Hydratation +8% avec rappels intelligents</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Prochaines analyses</span>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Optimisation horaires repas</li>
                <li>• Ajustement portions selon activité</li>
                <li>• Suggestions micronutriments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionAI;

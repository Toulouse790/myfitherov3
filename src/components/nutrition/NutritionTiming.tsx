
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Zap, 
  Target, 
  Activity,
  Calendar,
  Timer,
  TrendingUp,
  Bell
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface NutritionWindow {
  id: string;
  name: string;
  timeRange: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  foods: string[];
  benefits: string[];
  nextOccurrence: Date;
  completed: boolean;
}

const NutritionTiming: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [completedWindows, setCompletedWindows] = useState<Set<string>>(new Set());

  const nutritionWindows: NutritionWindow[] = [
    {
      id: 'wake-up',
      name: 'Réveil Hydratation',
      timeRange: '06:30 - 07:00',
      description: 'Réhydratation après la nuit de jeûne',
      priority: 'high',
      foods: ['Eau (500ml)', 'Citron pressé', 'Sel de mer (pincée)'],
      benefits: ['Réhydratation', 'Réveil métabolique', 'Détox'],
      nextOccurrence: new Date(Date.now() + 30 * 60 * 1000), // Dans 30 min
      completed: false
    },
    {
      id: 'pre-workout',
      name: 'Pré-Entraînement',
      timeRange: '08:00 - 08:30',
      description: 'Optimisation de l\'énergie avant l\'effort',
      priority: 'high',
      foods: ['Banane', 'Café noir', 'Miel (1 cs)', 'Amandes (10)'],
      benefits: ['Énergie rapide', 'Concentration', 'Performance'],
      nextOccurrence: new Date(Date.now() + 2 * 60 * 60 * 1000), // Dans 2h
      completed: false
    },
    {
      id: 'post-workout',
      name: 'Fenêtre Anabolique',
      timeRange: '10:00 - 10:30',
      description: 'Récupération et construction musculaire',
      priority: 'high',
      foods: ['Whey (25g)', 'Banane', 'Lait d\'amande', 'Épinards'],
      benefits: ['Récupération', 'Synthèse protéique', 'Réparation'],
      nextOccurrence: new Date(Date.now() + 4 * 60 * 60 * 1000), // Dans 4h
      completed: false
    },
    {
      id: 'lunch-timing',
      name: 'Déjeuner Équilibré',
      timeRange: '12:30 - 13:30',
      description: 'Repas principal pour soutenir l\'énergie',
      priority: 'medium',
      foods: ['Protéine (120g)', 'Glucides complexes', 'Légumes', 'Huile olive'],
      benefits: ['Satiété', 'Énergie soutenue', 'Nutriments essentiels'],
      nextOccurrence: new Date(Date.now() + 6 * 60 * 60 * 1000), // Dans 6h
      completed: false
    },
    {
      id: 'afternoon-snack',
      name: 'Collation Après-Midi',
      timeRange: '16:00 - 16:30',
      description: 'Maintien de l\'énergie et prévention fringales',
      priority: 'medium',
      foods: ['Noix mélangées', 'Pomme', 'Thé vert'],
      benefits: ['Énergie stable', 'Antioxydants', 'Concentration'],
      nextOccurrence: new Date(Date.now() + 9 * 60 * 60 * 1000), // Dans 9h
      completed: false
    },
    {
      id: 'dinner-timing',
      name: 'Dîner Récupération',
      timeRange: '19:30 - 20:30',
      description: 'Repas favorisant la récupération nocturne',
      priority: 'medium',
      foods: ['Poisson gras', 'Légumes verts', 'Quinoa', 'Avocat'],
      benefits: ['Récupération nocturne', 'Oméga-3', 'Micronutriments'],
      nextOccurrence: new Date(Date.now() + 12 * 60 * 60 * 1000), // Dans 12h
      completed: false
    },
    {
      id: 'bedtime',
      name: 'Avant Coucher',
      timeRange: '22:00 - 22:30',
      description: 'Nutrition pour optimiser le sommeil',
      priority: 'low',
      foods: ['Tisane camomille', 'Magnésium', 'Amandes (5)', 'Cerise'],
      benefits: ['Qualité sommeil', 'Relaxation', 'Récupération'],
      nextOccurrence: new Date(Date.now() + 15 * 60 * 60 * 1000), // Dans 15h
      completed: false
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff < 0) return 'Passé';
    if (hours > 0) return `Dans ${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    return `Dans ${minutes}min`;
  };

  const markCompleted = (windowId: string) => {
    setCompletedWindows(prev => new Set([...prev, windowId]));
    toast.success('Fenêtre nutritionnelle complétée !', {
      description: 'Excellent timing pour votre nutrition'
    });
  };

  const completionRate = (completedWindows.size / nutritionWindows.length) * 100;

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timing Nutritionnel Optimisé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression du jour</span>
                <span>{completedWindows.size}/{nutritionWindows.length}</span>
              </div>
              <Progress value={completionRate} className="h-3" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {nutritionWindows.filter(w => w.priority === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">Fenêtres critiques</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(completionRate)}%
              </div>
              <div className="text-sm text-muted-foreground">Taux de réussite</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fenêtres nutritionnelles */}
      <div className="space-y-4">
        {nutritionWindows.map(window => {
          const isCompleted = completedWindows.has(window.id);
          const timeUntil = getTimeUntil(window.nextOccurrence);
          const isUpcoming = timeUntil !== 'Passé' && !timeUntil.includes('h');
          
          return (
            <Card 
              key={window.id} 
              className={`transition-all ${isCompleted ? 'opacity-75 border-green-200' : ''} ${isUpcoming ? 'ring-2 ring-blue-200' : ''}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {isCompleted && <span className="text-green-500">✓</span>}
                      {window.name}
                      {isUpcoming && <Bell className="h-4 w-4 text-blue-500" />}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{window.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getPriorityColor(window.priority)}>
                      {window.priority}
                    </Badge>
                    <div className="text-sm font-medium">{window.timeRange}</div>
                    <div className="text-xs text-muted-foreground">{timeUntil}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Aliments recommandés */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Aliments recommandés :</h4>
                  <div className="flex flex-wrap gap-1">
                    {window.foods.map((food, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {food}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bénéfices */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Bénéfices :</h4>
                  <div className="flex flex-wrap gap-1">
                    {window.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {!isCompleted ? (
                    <>
                      <Button 
                        onClick={() => markCompleted(window.id)}
                        className="flex-1"
                        disabled={timeUntil === 'Passé'}
                      >
                        <Target className="h-4 w-4 mr-1" />
                        Marquer comme fait
                      </Button>
                      <Button variant="outline" size="sm">
                        <Timer className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" className="flex-1" disabled>
                      <span className="text-green-600">✓ Complété</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Conseils timing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Conseils de timing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
              <span><strong>Pré-entraînement :</strong> Consommez des glucides rapides 30-60min avant pour maximiser l'énergie.</span>
            </div>
            <div className="flex items-start gap-2">
              <Activity className="h-4 w-4 text-green-500 mt-0.5" />
              <span><strong>Post-entraînement :</strong> Protéines + glucides dans les 30min pour optimiser la récupération.</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
              <span><strong>Hydratation :</strong> Buvez régulièrement, surtout au réveil et avant les repas.</span>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-purple-500 mt-0.5" />
              <span><strong>Régularité :</strong> Respectez des horaires fixes pour optimiser votre métabolisme.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionTiming;

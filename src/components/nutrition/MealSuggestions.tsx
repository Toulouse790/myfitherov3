
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Utensils, 
  Clock, 
  Zap, 
  Target,
  ChefHat,
  Timer,
  Activity
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface MealSuggestion {
  id: string;
  name: string;
  description: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  prepTime: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  timing: 'pre-workout' | 'post-workout' | 'recovery' | 'general';
  workoutType?: string;
  benefits: string[];
  ingredients: string[];
  instructions: string[];
}

const MealSuggestions: React.FC = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<string>('strength');
  const [selectedTiming, setSelectedTiming] = useState<string>('pre-workout');

  const mealSuggestions: MealSuggestion[] = [
    {
      id: '1',
      name: 'Bowl Énergétique Pré-Workout',
      description: 'Parfait pour charger avant un entraînement intense',
      calories: 380,
      proteins: 15,
      carbs: 65,
      fats: 8,
      prepTime: 10,
      difficulty: 'easy',
      timing: 'pre-workout',
      workoutType: 'strength',
      benefits: ['Énergie rapide', 'Endurance', 'Concentration'],
      ingredients: ['Avoine (60g)', 'Banane (1)', 'Miel (1 cs)', 'Amandes (15g)', 'Cannelle'],
      instructions: [
        'Mélanger l\'avoine avec de l\'eau chaude',
        'Ajouter la banane coupée en rondelles',
        'Incorporer le miel et les amandes',
        'Saupoudrer de cannelle'
      ]
    },
    {
      id: '2',
      name: 'Smoothie Récupération Express',
      description: 'Optimal dans les 30min post-entraînement',
      calories: 320,
      proteins: 25,
      carbs: 35,
      fats: 8,
      prepTime: 5,
      difficulty: 'easy',
      timing: 'post-workout',
      workoutType: 'strength',
      benefits: ['Récupération musculaire', 'Réhydratation', 'Anti-inflammatoire'],
      ingredients: ['Whey vanille (30g)', 'Lait d\'amande (250ml)', 'Myrtilles (100g)', 'Épinards (30g)'],
      instructions: [
        'Mixer tous les ingrédients',
        'Ajuster la consistance avec du lait',
        'Servir immédiatement'
      ]
    },
    {
      id: '3',
      name: 'Salade Power Cardio',
      description: 'Léger et énergisant pour les séances cardio',
      calories: 280,
      proteins: 20,
      carbs: 25,
      fats: 12,
      prepTime: 15,
      difficulty: 'medium',
      timing: 'pre-workout',
      workoutType: 'cardio',
      benefits: ['Digestion facile', 'Hydratation', 'Énergie soutenue'],
      ingredients: ['Quinoa (50g)', 'Avocat (1/2)', 'Tomates cerises (150g)', 'Concombre (100g)', 'Feta (30g)'],
      instructions: [
        'Cuire le quinoa et laisser refroidir',
        'Couper tous les légumes',
        'Mélanger avec une vinaigrette légère',
        'Ajouter la feta émiettée'
      ]
    },
    {
      id: '4',
      name: 'Bol de Récupération Complète',
      description: 'Repas complet pour une récupération optimale',
      calories: 520,
      proteins: 35,
      carbs: 45,
      fats: 20,
      prepTime: 25,
      difficulty: 'medium',
      timing: 'recovery',
      workoutType: 'strength',
      benefits: ['Réparation musculaire', 'Glycogène', 'Anti-oxydants'],
      ingredients: ['Saumon (120g)', 'Patate douce (150g)', 'Brocolis (100g)', 'Huile d\'olive (1 cs)'],
      instructions: [
        'Cuire la patate douce au four',
        'Griller le saumon à la poêle',
        'Cuire les brocolis à la vapeur',
        'Assembler et arroser d\'huile d\'olive'
      ]
    }
  ];

  const workoutTypes = [
    { id: 'strength', label: 'Musculation', icon: '💪' },
    { id: 'cardio', label: 'Cardio', icon: '🏃‍♂️' },
    { id: 'hiit', label: 'HIIT', icon: '⚡' },
    { id: 'endurance', label: 'Endurance', icon: '🚴‍♂️' }
  ];

  const timings = [
    { id: 'pre-workout', label: 'Pré-entraînement', icon: '🕐' },
    { id: 'post-workout', label: 'Post-entraînement', icon: '🕕' },
    { id: 'recovery', label: 'Récupération', icon: '🌙' },
    { id: 'general', label: 'Général', icon: '🍽️' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimingColor = (timing: string) => {
    switch (timing) {
      case 'pre-workout': return 'bg-blue-100 text-blue-800';
      case 'post-workout': return 'bg-green-100 text-green-800';
      case 'recovery': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSuggestions = mealSuggestions.filter(meal => 
    (!selectedWorkout || meal.workoutType === selectedWorkout) &&
    (!selectedTiming || meal.timing === selectedTiming || meal.timing === 'general')
  );

  const addToJournal = (meal: MealSuggestion) => {
    toast.success('Repas ajouté !', {
      description: `${meal.name} ajouté à votre journal alimentaire`,
      action: {
        label: "Voir",
        onClick: () => console.log('Navigate to journal')
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Suggestions de repas personnalisées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type d'entraînement</label>
                <div className="flex flex-wrap gap-2">
                  {workoutTypes.map(type => (
                    <Button
                      key={type.id}
                      size="sm"
                      variant={selectedWorkout === type.id ? "default" : "outline"}
                      onClick={() => setSelectedWorkout(type.id)}
                    >
                      <span className="mr-1">{type.icon}</span>
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Timing nutritionnel</label>
                <div className="flex flex-wrap gap-2">
                  {timings.map(timing => (
                    <Button
                      key={timing.id}
                      size="sm"
                      variant={selectedTiming === timing.id ? "default" : "outline"}
                      onClick={() => setSelectedTiming(timing.id)}
                    >
                      <span className="mr-1">{timing.icon}</span>
                      {timing.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSuggestions.map(meal => (
          <Card key={meal.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{meal.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(meal.difficulty)}>
                    {meal.difficulty}
                  </Badge>
                  <Badge className={getTimingColor(meal.timing)}>
                    {meal.timing}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Macros */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-muted rounded">
                  <div className="text-lg font-bold text-primary">{meal.calories}</div>
                  <div className="text-xs text-muted-foreground">kcal</div>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div className="text-lg font-bold text-blue-600">{meal.proteins}g</div>
                  <div className="text-xs text-muted-foreground">protéines</div>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div className="text-lg font-bold text-green-600">{meal.carbs}g</div>
                  <div className="text-xs text-muted-foreground">glucides</div>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div className="text-lg font-bold text-orange-600">{meal.fats}g</div>
                  <div className="text-xs text-muted-foreground">lipides</div>
                </div>
              </div>

              {/* Info pratique */}
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  <span>{meal.prepTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span>{meal.workoutType}</span>
                </div>
              </div>

              {/* Bénéfices */}
              <div>
                <h4 className="text-sm font-medium mb-2">Bénéfices :</h4>
                <div className="flex flex-wrap gap-1">
                  {meal.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1"
                  onClick={() => addToJournal(meal)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
                <Button variant="outline" size="sm">
                  <Utensils className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuggestions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune suggestion trouvée</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos filtres pour voir plus d'options
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MealSuggestions;

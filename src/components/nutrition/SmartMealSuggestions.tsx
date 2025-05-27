
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChefHat, Clock, Target, Sparkles, Search, Filter } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface SmartMeal {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
  ingredients: string[];
  difficulty: 'facile' | 'moyen' | 'difficile';
  workoutTiming: 'pre' | 'post' | 'rest-day';
  aiScore: number;
  reason: string;
}

const SmartMealSuggestions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pre' | 'post' | 'rest-day'>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const smartMeals: SmartMeal[] = [
    {
      id: '1',
      name: 'Bowl Quinoa Power',
      description: 'Quinoa, avocat, saumon grillé, édamame et vinaigrette tahini',
      prepTime: 25,
      calories: 620,
      macros: { protein: 35, carbs: 45, fat: 25 },
      tags: ['riche-protéines', 'oméga-3', 'post-workout'],
      ingredients: ['quinoa', 'saumon', 'avocat', 'édamame', 'tahini'],
      difficulty: 'moyen',
      workoutTiming: 'post',
      aiScore: 94,
      reason: 'Parfait après musculation - ratio protéines/glucides optimal pour récupération'
    },
    {
      id: '2',
      name: 'Smoothie Boost Pré-Training',
      description: 'Banane, avoine, beurre d\'amande, épinards, protéine végétale',
      prepTime: 5,
      calories: 380,
      macros: { protein: 25, carbs: 40, fat: 15 },
      tags: ['rapide', 'énergisant', 'pré-workout'],
      ingredients: ['banane', 'avoine', 'beurre amande', 'épinards', 'protéine'],
      difficulty: 'facile',
      workoutTiming: 'pre',
      aiScore: 91,
      reason: 'Digestion rapide, énergie soutenue - idéal 1h avant cardio'
    },
    {
      id: '3',
      name: 'Salade Buddha Récup',
      description: 'Patate douce rôtie, pois chiches, kale, graines de tournesol',
      prepTime: 35,
      calories: 510,
      macros: { protein: 18, carbs: 55, fat: 22 },
      tags: ['anti-inflammatoire', 'fibres', 'récupération'],
      ingredients: ['patate douce', 'pois chiches', 'kale', 'graines tournesol'],
      difficulty: 'moyen',
      workoutTiming: 'post',
      aiScore: 88,
      reason: 'Anti-inflammatoire naturel - excellent pour récupération après HIIT'
    },
    {
      id: '4',
      name: 'Wrap Protéiné Express',
      description: 'Tortilla complète, poulet grillé, hummus, légumes croquants',
      prepTime: 10,
      calories: 450,
      macros: { protein: 32, carbs: 35, fat: 18 },
      tags: ['rapide', 'portable', 'équilibré'],
      ingredients: ['tortilla', 'poulet', 'hummus', 'légumes'],
      difficulty: 'facile',
      workoutTiming: 'rest-day',
      aiScore: 85,
      reason: 'Repas équilibré parfait pour les jours de repos - maintien masse musculaire'
    }
  ];

  const filteredMeals = smartMeals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || meal.workoutTiming === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleGenerateNew = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Nouvelles suggestions générées !', {
        description: '5 repas personnalisés selon vos préférences'
      });
    } catch (error) {
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-100 text-green-800';
      case 'moyen': return 'bg-yellow-100 text-yellow-800';
      case 'difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimingColor = (timing: string) => {
    switch (timing) {
      case 'pre': return 'bg-blue-100 text-blue-800';
      case 'post': return 'bg-purple-100 text-purple-800';
      case 'rest-day': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête suggestions intelligentes */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ChefHat className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>Suggestions IA Repas</CardTitle>
                <p className="text-muted-foreground">
                  Repas personnalisés selon vos entraînements et objectifs
                </p>
              </div>
            </div>
            <Button 
              onClick={handleGenerateNew}
              disabled={isGenerating}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Nouvelles suggestions
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par nom ou tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tous' },
            { value: 'pre', label: 'Pré-workout' },
            { value: 'post', label: 'Post-workout' },
            { value: 'rest-day', label: 'Repos' }
          ].map(filter => (
            <Button
              key={filter.value}
              variant={selectedFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter.value as any)}
            >
              <Filter className="h-3 w-3 mr-1" />
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Liste des suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMeals.map((meal) => (
          <Card key={meal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{meal.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {meal.description}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {meal.aiScore}% IA
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className={getDifficultyColor(meal.difficulty)}>
                  {meal.difficulty}
                </Badge>
                <Badge className={getTimingColor(meal.workoutTiming)}>
                  {meal.workoutTiming === 'pre' ? 'Pré-workout' :
                   meal.workoutTiming === 'post' ? 'Post-workout' : 'Jour de repos'}
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {meal.prepTime}min
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Macros */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold">{meal.calories}</div>
                  <div className="text-xs text-muted-foreground">kcal</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">{meal.macros.protein}g</div>
                  <div className="text-xs text-muted-foreground">Prot.</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{meal.macros.carbs}g</div>
                  <div className="text-xs text-muted-foreground">Gluc.</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600">{meal.macros.fat}g</div>
                  <div className="text-xs text-muted-foreground">Lip.</div>
                </div>
              </div>

              {/* Raison IA */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800">{meal.reason}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {meal.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Voir recette
                </Button>
                <Button variant="outline" size="sm">
                  Ajouter au plan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeals.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Aucune suggestion trouvée</p>
          <p className="text-muted-foreground">
            Essayez de modifier vos filtres ou générez de nouvelles suggestions
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartMealSuggestions;

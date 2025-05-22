
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft, Share2, Heart, Flame, Apple, Clock, Check, ListChecks } from 'lucide-react';

// Mock data - in a real app this would come from an API
const nutritionPlans = {
  '1': {
    id: '1',
    title: 'Plan nutrition prise de masse',
    description: 'Plan nutritionnel équilibré pour favoriser la prise de masse musculaire',
    calories: 3200,
    protein: 180,
    carbs: 350,
    fat: 90,
    meals: [
      {
        name: 'Petit-déjeuner',
        time: '7:00',
        foods: [
          { name: 'Flocons d\'avoine', quantity: '100g', calories: 350, protein: 12, carbs: 60, fat: 7 },
          { name: 'Blanc d\'œuf', quantity: '4 unités', calories: 120, protein: 24, carbs: 0, fat: 0 },
          { name: 'Beurre d\'amande', quantity: '30g', calories: 190, protein: 7, carbs: 6, fat: 17 },
          { name: 'Banane', quantity: '1 unité', calories: 105, protein: 1, carbs: 27, fat: 0 },
        ]
      },
      {
        name: 'Collation matin',
        time: '10:00',
        foods: [
          { name: 'Yaourt grec', quantity: '200g', calories: 130, protein: 22, carbs: 9, fat: 0 },
          { name: 'Fruits rouges', quantity: '150g', calories: 75, protein: 1, carbs: 16, fat: 0 },
          { name: 'Noix', quantity: '20g', calories: 130, protein: 3, carbs: 1, fat: 12 },
        ]
      },
      {
        name: 'Déjeuner',
        time: '13:00',
        foods: [
          { name: 'Blanc de poulet', quantity: '200g', calories: 300, protein: 54, carbs: 0, fat: 9 },
          { name: 'Riz brun', quantity: '100g (cru)', calories: 350, protein: 7, carbs: 75, fat: 3 },
          { name: 'Huile d\'olive', quantity: '1 cuillère à soupe', calories: 120, protein: 0, carbs: 0, fat: 14 },
          { name: 'Légumes verts', quantity: '200g', calories: 70, protein: 4, carbs: 14, fat: 0 },
        ]
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Plan nutrition perte de poids',
    description: 'Plan nutritionnel équilibré pour favoriser la perte de graisse tout en préservant la masse musculaire',
    calories: 1800,
    protein: 150,
    carbs: 170,
    fat: 55,
    meals: [
      {
        name: 'Petit-déjeuner',
        time: '7:30',
        foods: [
          { name: 'Œufs entiers', quantity: '2 unités', calories: 140, protein: 12, carbs: 0, fat: 10 },
          { name: 'Blanc d\'œuf', quantity: '2 unités', calories: 60, protein: 12, carbs: 0, fat: 0 },
          { name: 'Pain complet', quantity: '1 tranche', calories: 80, protein: 4, carbs: 15, fat: 1 },
          { name: 'Avocat', quantity: '1/4 unité', calories: 80, protein: 1, carbs: 3, fat: 7 },
        ]
      },
      {
        name: 'Collation matin',
        time: '10:30',
        foods: [
          { name: 'Skyr', quantity: '150g', calories: 90, protein: 15, carbs: 6, fat: 0 },
          { name: 'Myrtilles', quantity: '100g', calories: 50, protein: 0, carbs: 12, fat: 0 },
        ]
      },
      {
        name: 'Déjeuner',
        time: '13:00',
        foods: [
          { name: 'Filet de colin', quantity: '150g', calories: 150, protein: 30, carbs: 0, fat: 2 },
          { name: 'Patate douce', quantity: '150g', calories: 150, protein: 2, carbs: 35, fat: 0 },
          { name: 'Légumes vapeur', quantity: '250g', calories: 80, protein: 5, carbs: 16, fat: 0 },
        ]
      }
    ]
  }
};

const NutritionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get nutrition plan data
  const plan = nutritionPlans[id as keyof typeof nutritionPlans];
  
  if (!plan) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Plan nutritionnel non trouvé</h2>
          <p className="text-muted-foreground mt-2">Le plan que vous recherchez n'existe pas.</p>
          <Button className="mt-6" onClick={() => navigate('/nutrition')}>
            Retour aux plans
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const handleSaveToFavorites = () => {
    toast.success("Ajouté aux favoris !", {
      description: plan.title,
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié !", {
      description: "Vous pouvez maintenant partager ce plan nutritionnel"
    });
  };

  const handleActivate = () => {
    toast.success("Plan activé !", {
      description: `${plan.title} est maintenant votre plan nutritionnel actif`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header avec retour et actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/nutrition')} className="pl-0">
            <ArrowLeft size={16} className="mr-2" />
            Retour aux plans
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 size={16} className="mr-2" />
              Partager
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveToFavorites}>
              <Heart size={16} className="mr-2" />
              Favoris
            </Button>
            <Button size="sm" onClick={handleActivate}>
              <Check size={16} className="mr-2" />
              Activer ce plan
            </Button>
          </div>
        </div>

        {/* En-tête du plan */}
        <div>
          <h1 className="text-3xl font-bold">{plan.title}</h1>
          <p className="text-muted-foreground mt-1">{plan.description}</p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="outline" className="flex items-center">
              <Flame size={14} className="mr-1 text-red-500" />
              {plan.calories} calories
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
              Protéines: {plan.protein}g
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
              Glucides: {plan.carbs}g
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Lipides: {plan.fat}g
            </Badge>
          </div>
        </div>

        {/* Macros summary card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListChecks size={18} className="mr-2" />
              Répartition des macronutriments
            </CardTitle>
            <CardDescription>
              Distribution journalière recommandée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col">
                <div className="flex justify-between text-sm mb-1">
                  <span>Protéines ({Math.round((plan.protein * 4 / plan.calories) * 100)}%)</span>
                  <span>{plan.protein}g</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.round((plan.protein * 4 / plan.calories) * 100)}%` }}></div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between text-sm mb-1">
                  <span>Glucides ({Math.round((plan.carbs * 4 / plan.calories) * 100)}%)</span>
                  <span>{plan.carbs}g</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.round((plan.carbs * 4 / plan.calories) * 100)}%` }}></div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between text-sm mb-1">
                  <span>Lipides ({Math.round((plan.fat * 9 / plan.calories) * 100)}%)</span>
                  <span>{plan.fat}g</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.round((plan.fat * 9 / plan.calories) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repas */}
        <h2 className="text-xl font-semibold mt-8">Repas de la journée</h2>
        <div className="space-y-4">
          {plan.meals.map((meal, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{meal.name}</CardTitle>
                  <Badge variant="outline" className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {meal.time}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meal.foods.map((food, foodIndex) => (
                    <div key={foodIndex} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{food.name}</p>
                        <p className="text-sm text-muted-foreground">{food.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{food.calories} kcal</p>
                        <p className="text-xs text-muted-foreground">
                          P: {food.protein}g · G: {food.carbs}g · L: {food.fat}g
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Button onClick={handleActivate} className="w-full mt-6">
          <Check size={16} className="mr-2" />
          Activer ce plan nutritionnel
        </Button>
      </div>
    </MainLayout>
  );
};

export default NutritionDetail;

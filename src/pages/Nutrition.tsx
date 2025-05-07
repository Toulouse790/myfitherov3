
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MealPlanCard, { MealPlanProps } from '@/components/nutrition/MealPlanCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sliders } from 'lucide-react';

const Nutrition = () => {
  const mealPlans: MealPlanProps[] = [
    {
      id: '1',
      title: 'Prise de masse',
      description: 'Plan riche en protéines et en calories pour favoriser la croissance musculaire',
      calories: 3200,
      macros: { protein: 30, carbs: 50, fat: 20 },
      mealsPerDay: 5,
      category: 'Prise de masse',
    },
    {
      id: '2',
      title: 'Perte de poids',
      description: 'Plan équilibré avec déficit calorique modéré pour une perte de poids saine',
      calories: 2000,
      macros: { protein: 40, carbs: 30, fat: 30 },
      mealsPerDay: 4,
      category: 'Perte de poids',
    },
    {
      id: '3',
      title: 'Performance sportive',
      description: 'Optimisé pour les athlètes avec focus sur l\'énergie et la récupération',
      calories: 2800,
      macros: { protein: 25, carbs: 55, fat: 20 },
      mealsPerDay: 6,
      category: 'Performance',
    },
    {
      id: '4',
      title: 'Cétogène',
      description: 'Plan faible en glucides et riche en graisses pour induire la cétose',
      calories: 2300,
      macros: { protein: 30, carbs: 5, fat: 65 },
      mealsPerDay: 3,
      category: 'Cétogène',
    },
    {
      id: '5',
      title: 'Végétarien',
      description: 'Plan à base de plantes avec des substituts de protéines de haute qualité',
      calories: 2400,
      macros: { protein: 25, carbs: 55, fat: 20 },
      mealsPerDay: 4,
      category: 'Végétarien',
    },
    {
      id: '6',
      title: 'Maintenance',
      description: 'Plan équilibré pour maintenir votre poids et optimiser votre santé',
      calories: 2500,
      macros: { protein: 25, carbs: 45, fat: 30 },
      mealsPerDay: 4,
      category: 'Maintenance',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Nutrition</h1>
          <p className="text-muted-foreground">Des plans nutritionnels adaptés à vos objectifs avec calcul précis des macronutriments</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input placeholder="Rechercher un plan nutritionnel..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Sliders size={16} className="mr-2" />
              Filtres
            </Button>
            <Button>Mon plan personnalisé</Button>
          </div>
        </div>

        <Tabs defaultValue="recommandé" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="recommandé">Recommandés</TabsTrigger>
            <TabsTrigger value="objectifs">Par objectif</TabsTrigger>
            <TabsTrigger value="régimes">Régimes spéciaux</TabsTrigger>
            <TabsTrigger value="favoris">Mes favoris</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommandé" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealPlans.map((plan) => (
                <MealPlanCard key={plan.id} {...plan} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="objectifs" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealPlans.filter(p => ["Prise de masse", "Perte de poids", "Performance"].includes(p.category)).map((plan) => (
                <MealPlanCard key={plan.id} {...plan} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="régimes" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealPlans.filter(p => ["Cétogène", "Végétarien"].includes(p.category)).map((plan) => (
                <MealPlanCard key={plan.id} {...plan} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="favoris" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealPlans.slice(0, 2).map((plan) => (
                <MealPlanCard key={plan.id} {...plan} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Nutrition;

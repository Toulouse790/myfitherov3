
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MealPlanCard, { MealPlanProps } from '@/components/nutrition/MealPlanCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sliders, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Nutrition = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
    toast.info(showFilters ? "Filtres masqués" : "Filtres affichés", {
      description: showFilters ? "Les filtres ont été masqués" : "Sélectionnez vos critères de filtrage"
    });
  };
  
  const handleCreatePlan = async () => {
    setIsLoading(true);
    try {
      // Simuler un chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Plan nutritionnel créé", {
        description: "Votre plan nutritionnel personnalisé est prêt"
      });
      // Ici, on pourrait rediriger vers une page de création de plan
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de créer un nouveau plan nutritionnel"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les plans nutritionnels en fonction de la recherche
  const filteredMealPlans = mealPlans.filter(plan => 
    plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Input 
              placeholder="Rechercher un plan nutritionnel..." 
              className="pl-10" 
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleFilterClick}>
              <Sliders size={16} className="mr-2" />
              Filtres
            </Button>
            <Button onClick={handleCreatePlan} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Mon plan personnalisé"
              )}
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
            <h3 className="font-medium">Filtres avancés</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Calories</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Toutes les calories</option>
                  <option value="low">Faible (&lt; 2000 kcal)</option>
                  <option value="medium">Moyen (2000-2500 kcal)</option>
                  <option value="high">Élevé (&gt; 2500 kcal)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de régime</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Tous les régimes</option>
                  <option value="standard">Standard</option>
                  <option value="vegetarien">Végétarien</option>
                  <option value="cetogene">Cétogène</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Repas par jour</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Tous</option>
                  <option value="3">3 repas</option>
                  <option value="4">4 repas</option>
                  <option value="5">5 repas</option>
                  <option value="6">6 repas</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="recommandé" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="recommandé">Recommandés</TabsTrigger>
            <TabsTrigger value="objectifs">Par objectif</TabsTrigger>
            <TabsTrigger value="régimes">Régimes spéciaux</TabsTrigger>
            <TabsTrigger value="favoris">Mes favoris</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommandé" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMealPlans.map((plan) => (
                <MealPlanCard key={plan.id} {...plan} />
              ))}
            </div>
            {filteredMealPlans.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg font-medium">Aucun plan nutritionnel ne correspond à votre recherche</p>
                <p className="text-muted-foreground">Essayez avec d'autres termes ou filtres</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="objectifs" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMealPlans.filter(p => ["Prise de masse", "Perte de poids", "Performance"].includes(p.category)).map((plan) => (
                <MealPlanCard key={plan.id} {...plan} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="régimes" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMealPlans.filter(p => ["Cétogène", "Végétarien"].includes(p.category)).map((plan) => (
                <MealPlanCard key={plan.id} {...plan} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="favoris" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMealPlans.slice(0, 2).map((plan) => (
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

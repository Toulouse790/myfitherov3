
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarcodeScanner from '@/components/nutrition/BarcodeScanner';
import FoodJournal from '@/components/nutrition/FoodJournal';
import MealSuggestions from '@/components/nutrition/MealSuggestions';
import NutritionTiming from '@/components/nutrition/NutritionTiming';
import NutritionAI from '@/components/nutrition/NutritionAI';
import WorkoutNutritionIntegration from '@/components/nutrition/WorkoutNutritionIntegration';
import SmartMealSuggestions from '@/components/nutrition/SmartMealSuggestions';
import { 
  Scan, 
  BookOpen, 
  ChefHat, 
  Clock,
  Target,
  TrendingUp,
  Brain,
  Dumbbell,
  Sparkles
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ScannedProduct {
  barcode: string;
  name: string;
  brand?: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  servingSize: number;
  servingUnit: string;
}

const NutritionHub = () => {
  const handleProductFound = (product: ScannedProduct) => {
    console.log('Produit scanné:', product);
    toast.success('Produit trouvé !', {
      description: `${product.name} - ${product.calories} kcal`,
      action: {
        label: "Ajouter",
        onClick: () => {
          // Logic to add to food journal
          toast.success('Ajouté au journal !');
        }
      }
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Nutrition Hub Pro</h1>
          <p className="text-muted-foreground">
            Module nutrition compétitif avec IA, scan avancé et intégration sport
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="text-2xl font-bold">1,847</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Protéines</p>
                  <p className="text-2xl font-bold">127g</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hydratation</p>
                  <p className="text-2xl font-bold">1.8L</p>
                </div>
                <div className="h-8 w-8 text-blue-400">💧</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">IA Score</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sync Sport</p>
                  <p className="text-2xl font-bold">✓</p>
                </div>
                <Dumbbell className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              IA Coach
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Sport
            </TabsTrigger>
            <TabsTrigger value="smart-suggestions" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Smart Repas
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="timing" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="mt-6">
            <NutritionAI />
          </TabsContent>

          <TabsContent value="integration" className="mt-6">
            <WorkoutNutritionIntegration />
          </TabsContent>

          <TabsContent value="smart-suggestions" className="mt-6">
            <SmartMealSuggestions />
          </TabsContent>

          <TabsContent value="journal" className="mt-6">
            <FoodJournal />
          </TabsContent>

          <TabsContent value="scanner" className="mt-6">
            <div className="space-y-6">
              <BarcodeScanner onProductFound={handleProductFound} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Base de données nutritionnelles avancée</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">🔍 Fonctionnalités Pro :</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Scan codes-barres temps réel avec IA</li>
                        <li>• Base 500k+ produits + marques locales</li>
                        <li>• Reconnaissance étiquettes nutritionnelles</li>
                        <li>• Suggestions portions sport-optimisées</li>
                        <li>• Calcul automatique timing repas</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">📊 Analyses avancées :</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Profil micronutriments complet</li>
                        <li>• Index glycémique et charge</li>
                        <li>• Score inflammatoire</li>
                        <li>• Nutri-Score + Nova classification</li>
                        <li>• Impact environnemental</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timing" className="mt-6">
            <NutritionTiming />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default NutritionHub;

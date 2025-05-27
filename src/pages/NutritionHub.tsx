
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarcodeScanner from '@/components/nutrition/BarcodeScanner';
import FoodJournal from '@/components/nutrition/FoodJournal';
import MealSuggestions from '@/components/nutrition/MealSuggestions';
import NutritionTiming from '@/components/nutrition/NutritionTiming';
import { 
  Scan, 
  BookOpen, 
  ChefHat, 
  Clock,
  Target,
  TrendingUp
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
          <h1 className="text-3xl font-bold mb-2">Nutrition Hub</h1>
          <p className="text-muted-foreground">
            Module nutrition compétitif avec scan, tracking et timing optimisé
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Calories aujourd'hui</p>
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
                  <p className="text-sm text-muted-foreground">Timing Score</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="journal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="timing" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="mt-6">
            <FoodJournal />
          </TabsContent>

          <TabsContent value="scanner" className="mt-6">
            <div className="space-y-6">
              <BarcodeScanner onProductFound={handleProductFound} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Base de données nutritionnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">🔍 Fonctionnalités avancées :</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Scan de codes-barres en temps réel</li>
                        <li>• Base de données de 500k+ produits</li>
                        <li>• Reconnaissance d'étiquettes nutritionnelles</li>
                        <li>• Suggestions de portions optimales</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">📊 Calculs précis :</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Macronutriments détaillés</li>
                        <li>• Micronutriments essentiels</li>
                        <li>• Index glycémique</li>
                        <li>• Score nutritionnel Nutri-Score</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="mt-6">
            <MealSuggestions />
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

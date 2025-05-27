
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Coffee, 
  Utensils, 
  Sun, 
  Moon, 
  Trash2,
  Target,
  Droplets
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  quantity: number;
  unit: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: Date;
}

interface DailyTargets {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  water: number; // en ml
}

const FoodJournal: React.FC = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Objectifs journaliers par défaut
  const dailyTargets: DailyTargets = {
    calories: 2200,
    proteins: 165, // g
    carbs: 275, // g
    fats: 73, // g
    water: 2500 // ml
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="h-4 w-4" />;
      case 'lunch': return <Sun className="h-4 w-4" />;
      case 'dinner': return <Moon className="h-4 w-4" />;
      default: return <Utensils className="h-4 w-4" />;
    }
  };

  const getMealLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Petit-déjeuner';
      case 'lunch': return 'Déjeuner';
      case 'dinner': return 'Dîner';
      default: return 'Collation';
    }
  };

  const calculateTotals = () => {
    return entries.reduce((totals, entry) => ({
      calories: totals.calories + (entry.calories * entry.quantity / 100),
      proteins: totals.proteins + (entry.proteins * entry.quantity / 100),
      carbs: totals.carbs + (entry.carbs * entry.quantity / 100),
      fats: totals.fats + (entry.fats * entry.quantity / 100)
    }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });
  };

  const totals = calculateTotals();

  const addQuickFood = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const quickFoods = {
      breakfast: { name: 'Avoine avec banane', calories: 350, proteins: 12, carbs: 58, fats: 8 },
      lunch: { name: 'Salade de poulet', calories: 420, proteins: 35, carbs: 15, fats: 24 },
      dinner: { name: 'Saumon grillé', calories: 280, proteins: 40, carbs: 2, fats: 12 },
      snack: { name: 'Pomme + amandes', calories: 200, proteins: 6, carbs: 25, fats: 10 }
    };

    const food = quickFoods[mealType];
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      ...food,
      quantity: 100,
      unit: 'g',
      mealType,
      time: new Date()
    };

    setEntries([...entries, newEntry]);
    toast.success('Aliment ajouté', {
      description: `${food.name} ajouté à votre journal`
    });
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    toast.success('Aliment supprimé');
  };

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, dailyTargets.water));
    toast.success(`+${amount}ml d'eau ajoutés`);
  };

  const groupedEntries = entries.reduce((groups, entry) => {
    if (!groups[entry.mealType]) groups[entry.mealType] = [];
    groups[entry.mealType].push(entry);
    return groups;
  }, {} as Record<string, FoodEntry[]>);

  return (
    <div className="space-y-6">
      {/* Résumé nutritionnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Objectifs du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Calories</span>
                <span>{Math.round(totals.calories)}/{dailyTargets.calories}</span>
              </div>
              <Progress value={(totals.calories / dailyTargets.calories) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Protéines</span>
                <span>{Math.round(totals.proteins)}g/{dailyTargets.proteins}g</span>
              </div>
              <Progress value={(totals.proteins / dailyTargets.proteins) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Glucides</span>
                <span>{Math.round(totals.carbs)}g/{dailyTargets.carbs}g</span>
              </div>
              <Progress value={(totals.carbs / dailyTargets.carbs) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Lipides</span>
                <span>{Math.round(totals.fats)}g/{dailyTargets.fats}g</span>
              </div>
              <Progress value={(totals.fats / dailyTargets.fats) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hydratation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            Hydratation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Eau consommée</span>
              <span>{waterIntake}ml / {dailyTargets.water}ml</span>
            </div>
            <Progress value={(waterIntake / dailyTargets.water) * 100} className="h-3" />
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => addWater(250)}>
                +250ml
              </Button>
              <Button size="sm" variant="outline" onClick={() => addWater(500)}>
                +500ml
              </Button>
              <Button size="sm" variant="outline" onClick={() => addWater(750)}>
                +750ml
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal alimentaire */}
      <Card>
        <CardHeader>
          <CardTitle>Journal alimentaire</CardTitle>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="breakfast" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="breakfast">
                <Coffee className="h-4 w-4 mr-1" />
                Matin
              </TabsTrigger>
              <TabsTrigger value="lunch">
                <Sun className="h-4 w-4 mr-1" />
                Midi
              </TabsTrigger>
              <TabsTrigger value="dinner">
                <Moon className="h-4 w-4 mr-1" />
                Soir
              </TabsTrigger>
              <TabsTrigger value="snack">
                <Utensils className="h-4 w-4 mr-1" />
                Collation
              </TabsTrigger>
            </TabsList>

            {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => (
              <TabsContent key={mealType} value={mealType} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {getMealLabel(mealType)}
                  </h3>
                  <Button 
                    size="sm" 
                    onClick={() => addQuickFood(mealType as any)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>

                <div className="space-y-2">
                  {groupedEntries[mealType]?.map(entry => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.quantity}{entry.unit} • {Math.round(entry.calories * entry.quantity / 100)} kcal
                        </div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            P: {Math.round(entry.proteins * entry.quantity / 100)}g
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            G: {Math.round(entry.carbs * entry.quantity / 100)}g
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            L: {Math.round(entry.fats * entry.quantity / 100)}g
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removeEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun aliment ajouté pour ce repas
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodJournal;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplet, Plus, Minus, Target, TrendingUp } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const HydrationModule = () => {
  const [currentHydration, setCurrentHydration] = useState(1800);
  const [targetHydration] = useState(2500);
  const progressPercentage = (currentHydration / targetHydration) * 100;

  const addWater = (amount: number) => {
    setCurrentHydration(prev => Math.min(prev + amount, targetHydration + 500));
    
    // Feedback visuel immédiat avec toast
    toast.success(`💧 +${amount}ml ajoutés !`, {
      description: `Total: ${((currentHydration + amount) / 1000).toFixed(1)}L`,
      duration: 2000
    });
  };

  const removeWater = (amount: number) => {
    setCurrentHydration(prev => Math.max(prev - amount, 0));
    
    toast.success(`Correction: -${amount}ml`, {
      description: `Total: ${((currentHydration - amount) / 1000).toFixed(1)}L`,
      duration: 2000
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      <header className="bg-white border-b border-gray-200 px-4 py-4 mb-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            💧 Hydratation
          </h1>
          <p className="text-sm text-gray-600">Objectif quotidien</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-4">
        {/* Hydratation principale - Mobile optimized */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {(currentHydration / 1000).toFixed(1)}L
              </div>
              <div className="text-gray-600 text-lg">
                / {(targetHydration / 1000).toFixed(1)}L objectif
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-4 mb-4" />
            
            <div className="text-center text-lg font-medium text-gray-700 mb-6">
              {progressPercentage >= 100 ? "🎉 Objectif atteint !" : `${Math.round(100 - progressPercentage)}% restant`}
            </div>

            {/* Actions rapides - Boutons larges pour mobile */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => addWater(250)} 
                  size="lg"
                  className="h-16 text-lg font-semibold bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all duration-150"
                >
                  <Plus size={24} className="mr-2" />
                  250ml
                </Button>
                <Button 
                  onClick={() => addWater(500)} 
                  size="lg"
                  className="h-16 text-lg font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-150"
                >
                  <Plus size={24} className="mr-2" />
                  500ml
                </Button>
              </div>
              
              <Button 
                onClick={() => addWater(200)} 
                variant="outline" 
                size="lg"
                className="w-full h-14 text-lg border-2 border-blue-300 hover:bg-blue-50 active:scale-95 transition-all duration-150"
              >
                <Droplet size={20} className="mr-2 text-blue-500" />
                Verre d'eau (200ml)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions de correction */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Correction rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => removeWater(250)} 
                size="lg"
                className="h-12 border-red-200 hover:bg-red-50 active:scale-95 transition-all duration-150"
              >
                <Minus size={20} className="mr-1 text-red-500" />
                -250ml
              </Button>
              <Button 
                variant="outline" 
                onClick={() => removeWater(500)} 
                size="lg"
                className="h-12 border-red-200 hover:bg-red-50 active:scale-95 transition-all duration-150"
              >
                <Minus size={20} className="mr-1 text-red-500" />
                -500ml
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Motivation mobile-friendly */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl mb-3">
                {progressPercentage >= 100 ? "🏆" : progressPercentage >= 75 ? "🔥" : "💪"}
              </div>
              <div className="font-medium text-blue-800 text-lg mb-2">
                {progressPercentage >= 100 
                  ? "Bravo ! Objectif atteint !" 
                  : progressPercentage >= 75 
                  ? "Excellent rythme !"
                  : "Continuez, vous y êtes presque !"}
              </div>
              <div className="text-sm text-blue-600">
                Votre corps vous remerciera
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conseils tactiles */}
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-200 active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <div className="font-medium text-gray-900">Rappel intelligent</div>
                <div className="text-sm text-gray-600">Buvez toutes les heures</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200 active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏃‍♂️</span>
              <div>
                <div className="font-medium text-gray-900">Après l'effort</div>
                <div className="text-sm text-gray-600">+500ml recommandés</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HydrationModule;

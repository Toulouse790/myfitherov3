
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplet, Plus, Minus, Target, TrendingUp, Award } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const HydrationModule = () => {
  const [currentHydration, setCurrentHydration] = useState(1800);
  const [targetHydration] = useState(2500);
  const progressPercentage = (currentHydration / targetHydration) * 100;

  const addWater = (amount: number) => {
    setCurrentHydration(prev => Math.min(prev + amount, targetHydration + 500));
    
    // Feedback tactile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
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

  const getMotivationMessage = () => {
    if (progressPercentage >= 100) return "🏆 Champion de l'hydratation !";
    if (progressPercentage >= 80) return "🔥 Excellente progression !";
    if (progressPercentage >= 60) return "💪 Vous êtes sur la bonne voie !";
    if (progressPercentage >= 40) return "⭐ Continuez comme ça !";
    return "🚀 C'est parti pour une journée hydratée !";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pb-safe">
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 px-4 py-4 mb-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-hydration rounded-xl shadow-sm">
              <Droplet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-fitness-hydration">Hydratation</h1>
              <p className="text-sm text-muted-foreground">Objectif quotidien</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-4">
        {/* Hydratation principale - Mobile optimized */}
        <Card className="modern-card gradient-card fitness-hydration relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-hydration/10 rounded-full -translate-y-16 translate-x-16" />
          
          <CardContent className="pt-6 relative z-10">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-6 w-6 text-fitness-hydration" />
                <span className="text-sm font-medium text-fitness-hydration">
                  {getMotivationMessage()}
                </span>
              </div>
              
              <div className="text-5xl font-bold text-fitness-hydration mb-2">
                {(currentHydration / 1000).toFixed(1)}L
              </div>
              <div className="text-muted-foreground text-lg">
                / {(targetHydration / 1000).toFixed(1)}L objectif
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <Progress 
                value={progressPercentage} 
                className="h-4 bg-fitness-hydration/15"
              />
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Progression</span>
                </div>
                <span className="font-bold text-fitness-hydration">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>

            {/* Actions rapides - Boutons larges pour mobile */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => addWater(250)} 
                  size="lg"
                  className="h-16 text-lg font-semibold btn-hydration active:scale-95 transition-all duration-150 flex-col gap-1"
                >
                  <Plus size={24} />
                  <span>250ml</span>
                </Button>
                <Button 
                  onClick={() => addWater(500)} 
                  size="lg"
                  className="h-16 text-lg font-semibold btn-hydration active:scale-95 transition-all duration-150 flex-col gap-1"
                >
                  <Plus size={24} />
                  <span>500ml</span>
                </Button>
              </div>
              
              <Button 
                onClick={() => addWater(200)} 
                variant="outline" 
                size="lg"
                className="w-full h-14 text-lg border-2 border-fitness-hydration/30 hover:bg-fitness-hydration/10 hover:border-fitness-hydration active:scale-95 transition-all duration-150"
              >
                <Droplet size={20} className="mr-2 text-fitness-hydration" />
                Verre d'eau (200ml)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions de correction */}
        <Card className="modern-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-fitness-hydration" />
              Correction rapide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => removeWater(250)} 
                size="lg"
                className="h-12 border-red-200 hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all duration-150"
              >
                <Minus size={20} className="mr-1 text-red-500" />
                -250ml
              </Button>
              <Button 
                variant="outline" 
                onClick={() => removeWater(500)} 
                size="lg"
                className="h-12 border-red-200 hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all duration-150"
              >
                <Minus size={20} className="mr-1 text-red-500" />
                -500ml
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Motivation mobile-friendly */}
        <Card className="modern-card bg-gradient-to-r from-fitness-hydration/10 to-blue-100/50 border-fitness-hydration/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl mb-3">
                {progressPercentage >= 100 ? "🏆" : progressPercentage >= 75 ? "🔥" : "💪"}
              </div>
              <div className="font-bold text-fitness-hydration text-lg mb-2">
                {progressPercentage >= 100 
                  ? "Objectif dépassé ! Fantastique !" 
                  : progressPercentage >= 75 
                  ? "Presque au bout, continuez !"
                  : "Chaque gorgée compte !"}
              </div>
              <div className="text-sm text-fitness-hydration/80">
                L'hydratation optimise vos performances
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conseils tactiles avec design moderne */}
        <div className="grid grid-cols-1 gap-3">
          <Card className="modern-card hover:bg-fitness-hydration/5 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-hydration rounded-lg">
                  <span className="text-white text-lg">💡</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Rappel intelligent</div>
                  <div className="text-sm text-muted-foreground">Buvez toutes les heures</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="modern-card hover:bg-fitness-sport/5 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-sport rounded-lg">
                  <span className="text-white text-lg">🏃‍♂️</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Après l'effort</div>
                  <div className="text-sm text-muted-foreground">+500ml recommandés</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HydrationModule;

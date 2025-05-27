
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Droplet, Sun } from 'lucide-react';
import { useHydration } from '@/features/hydratation/hooks';
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';

export function HydrationDashboardCard() {
  const { stats, addHydration } = useHydration();
  
  const percentage = Math.min(100, stats.percentageComplete);
  const remaining = stats.dailyTarget - stats.dailyIntake;
  
  const quickAddWater = async (amount: number) => {
    const success = await addHydration(amount);
    if (success) {
      // Feedback tactile et visuel immédiat
      if (navigator.vibrate) {
        navigator.vibrate(50); // Vibration légère
      }
      
      if (percentage >= 100) {
        toast.success(`🎯 Objectif dépassé ! +${amount}ml`, {
          description: 'Vous êtes au top de votre forme !',
          duration: 3000
        });
      } else {
        toast.success(`💧 +${amount}ml ajoutés`, {
          description: `Plus que ${Math.round((remaining - amount) / 100) * 100}ml pour votre objectif`,
          duration: 2000
        });
      }
    }
  };

  const getMessage = () => {
    if (percentage >= 100) return "🎉 Objectif atteint ! Bravo !";
    if (percentage >= 80) return "🔥 Presque au but, continuez !";
    if (percentage >= 60) return "💪 Bon rythme, restez motivé !";
    if (percentage >= 40) return "⭐ En bonne voie, continuez !";
    return `💧 Plus que ${Math.round(remaining/1000*10)/10}L à boire aujourd'hui`;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          Hydratation
        </CardTitle>
        <CardDescription>Votre progression du jour</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{getMessage()}</span>
            <span className="font-bold text-blue-600">
              {stats.dailyIntake} / {stats.dailyTarget} ml
            </span>
          </div>
          
          <Progress value={percentage} className="h-3" />
        </div>
        
        {/* Boutons tactiles optimisés */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => quickAddWater(200)} 
            size="lg"
            className="h-12 bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all duration-150 font-semibold"
          >
            <Droplet className="h-5 w-5 mr-2" />
            +200ml
          </Button>
          <Button 
            onClick={() => quickAddWater(500)} 
            size="lg"
            className="h-12 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-150 font-semibold"
          >
            <Droplet className="h-5 w-5 mr-2" />
            +500ml
          </Button>
        </div>
        
        {percentage < 40 && (
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <Sun className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-blue-700 font-medium mb-1">
              Pensez à vous hydrater régulièrement
            </p>
            <p className="text-xs text-blue-600">
              Votre corps vous remerciera !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

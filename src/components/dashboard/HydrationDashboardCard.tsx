
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Droplet, Sun, Target } from 'lucide-react';
import { useHydration } from '@/features/hydratation/hooks';
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

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
    <Card className="modern-card gradient-card fitness-hydration hover:glow-effect transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-hydration rounded-xl shadow-sm">
            <Droplet className="h-5 w-5 text-white" />
          </div>
          <span className="text-fitness-hydration font-semibold">Hydratation</span>
        </CardTitle>
        <CardDescription>Votre progression du jour</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-700">{getMessage()}</span>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-fitness-hydration" />
                <span className="text-lg font-bold text-fitness-hydration">
                  {stats.dailyIntake}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {stats.dailyTarget} ml
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-fitness-hydration">
                {Math.round(percentage)}%
              </div>
              <div className="text-xs text-muted-foreground">complété</div>
            </div>
          </div>
          
          <Progress 
            value={percentage} 
            className="h-4 bg-fitness-hydration/10"
          />
        </div>
        
        {/* Boutons tactiles optimisés */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => quickAddWater(200)} 
            size="lg"
            className="h-14 btn-hydration font-semibold flex-col gap-1 active:scale-95 transition-all duration-150"
          >
            <Droplet className="h-5 w-5" />
            <span>+200ml</span>
          </Button>
          <Button 
            onClick={() => quickAddWater(500)} 
            size="lg"
            className="h-14 btn-hydration font-semibold flex-col gap-1 active:scale-95 transition-all duration-150"
          >
            <Droplet className="h-5 w-5" />
            <span>+500ml</span>
          </Button>
        </div>
        
        {percentage < 40 && (
          <div className="text-center p-4 bg-gradient-to-r from-fitness-hydration/5 to-fitness-hydration/10 rounded-xl border border-fitness-hydration/20">
            <Sun className="h-6 w-6 text-fitness-hydration mx-auto mb-2" />
            <p className="text-sm text-fitness-hydration font-medium mb-1">
              Pensez à vous hydrater régulièrement
            </p>
            <p className="text-xs text-fitness-hydration/80">
              Votre corps vous remerciera !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

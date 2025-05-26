
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Droplet } from 'lucide-react';
import { useHydration } from '@/features/hydratation/hooks';
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { HydrationSafetyCard } from '@/components/hydration/HydrationSafetyCard';

export function HydrationDashboardCard() {
  const { stats, recommendation, addHydration } = useHydration();
  const [showSafetyCard, setShowSafetyCard] = useState(false);
  
  // Formatage du pourcentage pour affichage
  const percentage = Math.min(100, stats.percentageComplete);
  
  // Couleur dynamique basée sur le pourcentage d'hydratation
  const getProgressColor = () => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-orange-500';
    if (percentage < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Déterminer le prochain palier recommandé
  const nextMilestone = () => {
    if (stats.dailyIntake >= stats.dailyTarget) {
      return "Objectif atteint !";
    }
    
    const remaining = stats.dailyTarget - stats.dailyIntake;
    if (remaining > 1000) {
      return `Encore ${Math.round(remaining / 100) / 10}L à boire`;
    }
    return `Encore ${remaining}ml à boire`;
  };
  
  const quickAddWater = async (amount: number) => {
    const success = await addHydration(amount);
    if (success) {
      toast.success(`${amount}ml d'eau ajoutés`);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            Hydratation
          </CardTitle>
          <CardDescription>Suivi quotidien</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{nextMilestone()}</span>
              <span className="font-medium">
                {stats.dailyIntake} / {stats.dailyTarget} ml
              </span>
            </div>
            
            <div className="relative">
              <Progress
                value={percentage}
                className={`h-2 ${getProgressColor()}`}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => quickAddWater(200)} variant="outline" size="sm">
              <Droplet className="h-4 w-4 mr-1 text-blue-500" />+200ml
            </Button>
            <Button onClick={() => quickAddWater(500)} variant="outline" size="sm">
              <Droplet className="h-4 w-4 mr-1 text-blue-500" />+500ml
            </Button>
          </div>
          
          {recommendation && recommendation.alertLevel !== 'safe' && (
            <Button 
              onClick={() => setShowSafetyCard(true)} 
              variant="secondary"
              size="sm"
              className="w-full text-xs"
            >
              Voir les recommandations de sécurité
            </Button>
          )}
        </CardContent>
      </Card>
      
      {showSafetyCard && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <HydrationSafetyCard />
            <Button 
              onClick={() => setShowSafetyCard(false)}
              className="w-full mt-3"
              variant="secondary"
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

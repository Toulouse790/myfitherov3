
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplet, AlertTriangle, Thermometer } from 'lucide-react';
import { useHydration } from '@/features/hydratation/hooks';
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { HydrationSafetyCard } from '@/components/hydration/HydrationSafetyCard';

export function HydrationDashboardCard() {
  const { stats, recommendation, addHydration, weatherData } = useHydration();
  const [showSafetyCard, setShowSafetyCard] = useState(false);
  
  // Formatage du pourcentage pour affichage
  const percentage = Math.min(100, stats.percentageComplete);
  
  // Couleur dynamique basée sur le pourcentage + conditions critiques
  const getProgressColor = () => {
    const temp = weatherData?.main.temp || 20;
    const isCriticalTemp = temp > 25;
    
    if (percentage < 25 && isCriticalTemp) return 'bg-red-600'; // Critique + chaleur
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50 && isCriticalTemp) return 'bg-orange-600'; // Prudence + chaleur
    if (percentage < 50) return 'bg-orange-500';
    if (percentage < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Déterminer le prochain palier recommandé avec contexte
  const nextMilestone = () => {
    const temp = weatherData?.main.temp || 20;
    
    if (stats.dailyIntake >= stats.dailyTarget) {
      return temp > 25 ? "Objectif atteint - Surveillez la température" : "Objectif atteint !";
    }
    
    const remaining = stats.dailyTarget - stats.dailyIntake;
    if (remaining > 1000) {
      const tempWarning = temp > 25 ? ` (${temp}°C!)` : '';
      return `Encore ${Math.round(remaining / 100) / 10}L à boire${tempWarning}`;
    }
    return `Encore ${remaining}ml à boire`;
  };
  
  const quickAddWater = async (amount: number) => {
    const success = await addHydration(amount);
    if (success) {
      toast.success(`${amount}ml d'eau ajoutés`);
    }
  };

  // Alerte température
  const getTemperatureAlert = () => {
    const temp = weatherData?.main.temp || 20;
    if (temp > 30) return { level: 'critical', message: `${temp}°C - CHALEUR EXTRÊME` };
    if (temp > 25) return { level: 'warning', message: `${temp}°C - Forte chaleur` };
    return null;
  };

  const tempAlert = getTemperatureAlert();

  return (
    <>
      <Card className="relative">
        {tempAlert && (
          <div className={`absolute top-0 left-0 right-0 h-1 ${
            tempAlert.level === 'critical' ? 'bg-red-600' : 'bg-orange-500'
          } rounded-t`} />
        )}
        
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            Hydratation
            {tempAlert && (
              <Badge variant="destructive" className="ml-auto animate-pulse">
                <Thermometer className="h-3 w-3 mr-1" />
                {tempAlert.message}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {tempAlert ? 'Surveillance renforcée' : 'Suivi quotidien'}
          </CardDescription>
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
                className={`h-3 ${getProgressColor()}`}
              />
              {/* Indicateur seuil critique à 30% */}
              <div 
                className="absolute top-0 h-3 w-0.5 bg-red-800"
                style={{ left: '30%' }}
                title="Seuil critique 30%"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => quickAddWater(200)} 
              variant="outline" 
              size="sm"
              className={tempAlert ? 'border-red-300 hover:bg-red-50' : ''}
            >
              <Droplet className="h-4 w-4 mr-1 text-blue-500" />+200ml
            </Button>
            <Button 
              onClick={() => quickAddWater(500)} 
              variant="outline" 
              size="sm"
              className={tempAlert ? 'border-red-300 hover:bg-red-50' : ''}
            >
              <Droplet className="h-4 w-4 mr-1 text-blue-500" />+500ml
            </Button>
          </div>
          
          {/* Actions urgence si conditions critiques */}
          {(tempAlert?.level === 'critical' || percentage < 30) && (
            <Button 
              onClick={() => quickAddWater(750)}
              variant="destructive"
              size="sm"
              className="w-full animate-pulse"
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              HYDRATATION URGENTE +750ml
            </Button>
          )}
          
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


import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplet, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useHydration } from '@/features/hydratation/hooks';
import { toast } from '@/components/ui/sonner';
import { HydrationAlert } from '@/ai/HydrationAIExpert';

const alertLevelColors = {
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
  emergency: 'bg-red-700'
};

const alertLevelIconSizes = {
  info: 'h-5 w-5',
  warning: 'h-6 w-6',
  critical: 'h-7 w-7',
  emergency: 'h-8 w-8'
};

export const HydrationSafetyCard = () => {
  const { stats, recommendation, alert, addHydration } = useHydration();
  const [expanded, setExpanded] = useState(false);
  
  if (!recommendation) {
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <p className="text-muted-foreground">Calcul des recommandations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const quickAddWater = async (amount: number) => {
    const success = await addHydration(amount);
    if (success) {
      toast.success(`${amount}ml d'eau ajoutés`);
    }
  };
  
  const alertLevel = recommendation.alertLevel;
  const alertColorClass = 
    alertLevel === 'emergency' ? 'border-l-red-700' :
    alertLevel === 'critical' ? 'border-l-red-500' :
    alertLevel === 'warning' ? 'border-l-amber-500' :
    alertLevel === 'caution' ? 'border-l-amber-300' :
    'border-l-green-500';
  
  return (
    <Card className={`border-l-4 ${alertColorClass} shadow-md`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              Sécurité Hydratation
            </CardTitle>
            <CardDescription>
              {alertLevel === 'safe' && "Hydratation sécurisée"}
              {alertLevel === 'caution' && "Légère prudence recommandée"}
              {alertLevel === 'warning' && "Vigilance hydratation requise"}
              {alertLevel === 'critical' && "Risque déshydratation important"}
              {alertLevel === 'emergency' && "DANGER DÉSHYDRATATION CRITIQUE"}
            </CardDescription>
          </div>
          
          <Badge variant={alertLevel === 'safe' ? 'outline' : 'default'} 
            className={alertLevel !== 'safe' ? 'animate-pulse' : ''}>
            {alertLevel === 'safe' && "Sécurisé"}
            {alertLevel === 'caution' && "Prudence"}
            {alertLevel === 'warning' && "Alerte"}
            {alertLevel === 'critical' && "Critique"}
            {alertLevel === 'emergency' && "URGENCE"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Hydratation actuelle</span>
            <span className="font-medium">
              {stats.dailyIntake} / {recommendation.totalDailyNeed} ml
            </span>
          </div>
          <Progress value={Math.min(100, stats.dailyIntake / recommendation.totalDailyNeed * 100)} 
            className="h-2" />
        </div>
        
        {alert && (
          <div className={`p-3 rounded-md ${alertLevelColors[alert.level]} bg-opacity-20 border 
            ${alert.level === 'emergency' ? 'border-red-700 animate-pulse' : 
              alert.level === 'critical' ? 'border-red-500' : 'border-amber-500'}`}>
            <div className="flex gap-2 items-start">
              <div className="shrink-0 mt-0.5">
                <AlertTriangle className={`${alertLevelIconSizes[alert.level]} 
                  ${alert.level === 'emergency' ? 'text-red-700' : 
                    alert.level === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
              </div>
              <div>
                <h4 className="font-medium">{alert.title}</h4>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              </div>
            </div>
            
            {alert.actions.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm">
                {alert.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="shrink-0 select-none">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {alert.seekMedicalAttention && (
              <p className="mt-2 text-sm font-medium text-red-700 bg-red-100 p-1 rounded">
                ⚕️ CONSULTEZ UN MÉDECIN EN CAS DE SYMPTÔMES
              </p>
            )}
          </div>
        )}
        
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex gap-2">
            <Button onClick={() => quickAddWater(200)} variant="outline" size="sm" className="flex-1">
              <Droplet className="h-4 w-4 mr-1 text-blue-500" /> +200ml
            </Button>
            <Button onClick={() => quickAddWater(500)} variant="outline" size="sm" className="flex-1">
              <Droplet className="h-4 w-4 mr-1 text-blue-500" /> +500ml
            </Button>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-3 space-y-3">
            <div className="text-sm">
              <h4 className="font-medium">Recommandations personnalisées</h4>
              <ul className="space-y-2 mt-2">
                {recommendation.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="shrink-0 select-none">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {recommendation.contraindications.length > 0 && (
              <div className="text-sm">
                <h4 className="font-medium text-red-600">Contre-indications médicales</h4>
                <ul className="space-y-1 mt-1">
                  {recommendation.contraindications.map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="shrink-0 select-none">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {recommendation.medicalAlerts.length > 0 && (
              <div className="text-sm">
                <h4 className="font-medium text-red-600">Alertes médicales</h4>
                <ul className="space-y-1 mt-1">
                  {recommendation.medicalAlerts.map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="shrink-0 select-none">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="w-full text-xs"
        >
          {expanded ? "Afficher moins" : "Voir toutes les recommandations"}
        </Button>
      </CardFooter>
    </Card>
  );
};

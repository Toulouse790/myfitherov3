
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Droplet } from 'lucide-react';
import { useHydration } from '@/features/hydratation/hooks';
import { toast } from '@/components/ui/sonner';

export function SimpleHydrationCard() {
  const { stats, addHydration } = useHydration();
  
  const percentage = Math.min(100, stats.percentageComplete);
  const remaining = stats.dailyTarget - stats.dailyIntake;
  
  const quickAddWater = async (amount: number) => {
    const success = await addHydration(amount);
    if (success) {
      toast.success(`Bien joué ! +${amount}ml ajoutés 💧`);
    }
  };

  const getMessage = () => {
    if (percentage >= 100) return "Objectif atteint ! Bravo ! 🎉";
    if (percentage >= 80) return "Presque au but, continuez !";
    if (percentage >= 50) return "Bon rythme, restez motivé !";
    return `Plus que ${Math.round(remaining/1000*10)/10}L, vous pouvez le faire !`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          Hydratation
        </CardTitle>
        <CardDescription>Votre progression du jour</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{getMessage()}</span>
            <span className="font-medium">
              {stats.dailyIntake} / {stats.dailyTarget} ml
            </span>
          </div>
          
          <Progress value={percentage} className="h-3" />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => quickAddWater(200)} 
            variant="outline" 
            size="sm"
          >
            <Droplet className="h-4 w-4 mr-1 text-blue-500" />
            +200ml
          </Button>
          <Button 
            onClick={() => quickAddWater(500)} 
            variant="outline" 
            size="sm"
          >
            <Droplet className="h-4 w-4 mr-1 text-blue-500" />
            +500ml
          </Button>
        </div>
        
        {percentage < 30 && (
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 Petit rappel : votre corps a besoin d'eau pour bien fonctionner !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

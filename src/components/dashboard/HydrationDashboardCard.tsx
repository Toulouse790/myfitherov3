
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Droplet } from 'lucide-react';
import { useHydration } from '@/features/hydratation/hooks';
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
        navigator.vibrate(30);
      }
      
      toast.success(`💧 +${amount}ml ajoutés`, {
        description: remaining <= amount ? 'Objectif atteint !' : `Plus que ${Math.round((remaining - amount) / 100) * 100}ml`,
        duration: 2000
      });
    }
  };

  return (
    <Card className="hover:shadow-md transition-all border-blue-200 bg-blue-50/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">Hydratation</CardTitle>
        <div className="p-2 bg-blue-50 rounded-lg">
          <Droplet className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">{stats.dailyIntake}</div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {remaining > 0 
                ? `${(remaining/1000).toFixed(1)}L restant` 
                : 'Objectif atteint !'
              }
            </span>
            <span>{stats.dailyTarget} ml</span>
          </div>
          
          <Progress value={percentage} className="h-2 bg-blue-100" />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => quickAddWater(200)} 
            variant="outline" 
            size="sm"
            className="text-xs h-8"
          >
            +200ml
          </Button>
          <Button 
            onClick={() => quickAddWater(500)} 
            variant="outline" 
            size="sm"
            className="text-xs h-8"
          >
            +500ml
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

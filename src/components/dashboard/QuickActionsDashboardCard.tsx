
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Plus } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export function QuickActionsDashboardCard() {
  const navigate = useNavigate();

  const handleQuickAction = (path: string, action: string) => {
    // Feedback tactile immédiat
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    
    toast.success(`Navigation vers ${action}`, {
      duration: 1500
    });
    
    navigate(path);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={() => handleQuickAction('/workout', 'Entraînement')}
            size="lg"
            className="h-16 flex-col gap-2 border-2 hover:border-primary active:scale-95 transition-all duration-150"
          >
            <Dumbbell size={24} />
            <span className="text-sm font-medium">Nouvelle séance</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleQuickAction('/nutrition', 'Nutrition')}
            size="lg"
            className="h-16 flex-col gap-2 border-2 hover:border-primary active:scale-95 transition-all duration-150"
          >
            <span className="text-2xl">🍎</span>
            <span className="text-sm font-medium">Ajouter repas</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleQuickAction('/sleep', 'Sommeil')}
            size="lg"
            className="h-16 flex-col gap-2 border-2 hover:border-primary active:scale-95 transition-all duration-150"
          >
            <span className="text-2xl">😴</span>
            <span className="text-sm font-medium">Sommeil</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleQuickAction('/simple-ai', 'Coach IA')}
            size="lg"
            className="h-16 flex-col gap-2 border-2 hover:border-primary active:scale-95 transition-all duration-150"
          >
            <span className="text-2xl">🤖</span>
            <span className="text-sm font-medium">Coach IA</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

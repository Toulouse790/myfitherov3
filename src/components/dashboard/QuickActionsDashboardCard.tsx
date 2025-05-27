
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Zap } from 'lucide-react';
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

  const quickActions = [
    {
      id: 'workout',
      label: 'Démarrer séance',
      path: '/sport-tracker',
      icon: Dumbbell,
      emoji: '🏋️‍♂️',
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-600'
    },
    {
      id: 'nutrition',
      label: 'Nutrition',
      path: '/nutrition',
      emoji: '🍎',
      color: 'bg-green-50 hover:bg-green-100 text-green-600'
    },
    {
      id: 'sleep',
      label: 'Sommeil',
      path: '/sleep',
      emoji: '😴',
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-600'
    },
    {
      id: 'ai-coach',
      label: 'Coach IA',
      path: '/coach',
      icon: Zap,
      emoji: '🤖',
      color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
    }
  ];

  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            
            return (
              <Button 
                key={action.id}
                variant="outline" 
                onClick={() => handleQuickAction(action.path, action.label)}
                className={`h-20 flex-col gap-2 border transition-all duration-200 active:scale-95 ${action.color}`}
              >
                <div className="flex flex-col items-center gap-1">
                  {Icon ? (
                    <Icon size={20} className="transition-transform group-hover:scale-110" />
                  ) : (
                    <span className="text-xl transition-transform group-hover:scale-110">
                      {action.emoji}
                    </span>
                  )}
                  <span className="text-xs font-medium text-center leading-tight">
                    {action.label}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

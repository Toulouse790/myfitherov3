
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Plus, Zap } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export function QuickActionsDashboardCard() {
  const navigate = useNavigate();

  const handleQuickAction = (path: string, action: string, color: string) => {
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
      label: 'Nouvelle séance',
      path: '/workout',
      icon: Dumbbell,
      emoji: '🏋️‍♂️',
      gradient: 'bg-gradient-sport',
      color: 'fitness-sport'
    },
    {
      id: 'nutrition',
      label: 'Ajouter repas',
      path: '/nutrition',
      emoji: '🍎',
      gradient: 'bg-gradient-nutrition',
      color: 'fitness-nutrition'
    },
    {
      id: 'sleep',
      label: 'Sommeil',
      path: '/sleep',
      emoji: '😴',
      gradient: 'bg-gradient-sleep',
      color: 'fitness-sleep'
    },
    {
      id: 'ai-coach',
      label: 'Coach IA',
      path: '/simple-ai',
      icon: Zap,
      emoji: '🤖',
      gradient: 'bg-gradient-primary',
      color: 'fitness-primary'
    }
  ];

  return (
    <Card className="modern-card hover:glow-effect transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-xl shadow-sm">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <span className="gradient-text font-semibold">Actions rapides</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            
            return (
              <Button 
                key={action.id}
                variant="outline" 
                onClick={() => handleQuickAction(action.path, action.label, action.color)}
                size="lg"
                className={`h-20 flex-col gap-2 border-2 hover:border-transparent active:scale-95 transition-all duration-300 ${action.gradient} hover:text-white hover:shadow-lg group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 flex flex-col items-center gap-2">
                  {Icon ? (
                    <Icon size={24} className="group-hover:scale-110 transition-transform" />
                  ) : (
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {action.emoji}
                    </span>
                  )}
                  <span className="text-sm font-medium text-center leading-tight">
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

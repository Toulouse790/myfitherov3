
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Apple, Target, TrendingUp } from 'lucide-react';

interface NutritionStats {
  nutrition: { 
    current: number; 
    target: number; 
    proteins: boolean; 
    carbs: boolean; 
    fats: boolean; 
  };
}

interface NutritionDashboardCardProps {
  stats: NutritionStats;
}

export function NutritionDashboardCard({ stats }: NutritionDashboardCardProps) {
  const nutritionPercentage = (stats.nutrition.current / stats.nutrition.target) * 100;

  return (
    <Card className="modern-card gradient-card fitness-nutrition hover:glow-effect transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-gradient-nutrition rounded-xl shadow-sm">
            <Apple className="h-5 w-5 text-white" />
          </div>
          <span className="text-fitness-nutrition font-semibold">Nutrition</span>
          <div className="ml-auto">
            <TrendingUp className="h-4 w-4 text-fitness-nutrition" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-fitness-nutrition">
                {stats.nutrition.current.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                / {stats.nutrition.target.toLocaleString()} cal
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-fitness-nutrition">
                {Math.round(nutritionPercentage)}%
              </div>
              <div className="text-xs text-muted-foreground">objectif</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={nutritionPercentage} 
              className="h-3 bg-fitness-nutrition/10" 
            />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Target className="h-3 w-3" />
              <span>Progression quotidienne</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Badge 
              variant={stats.nutrition.proteins ? "default" : "secondary"}
              className={cn(
                "text-xs font-medium justify-center py-1",
                stats.nutrition.proteins 
                  ? "bg-fitness-nutrition/15 text-fitness-nutrition border-fitness-nutrition/30" 
                  : "bg-gray-100 text-gray-600"
              )}
            >
              Protéines {stats.nutrition.proteins ? "✅" : "⚠️"}
            </Badge>
            <Badge 
              variant={stats.nutrition.carbs ? "default" : "secondary"}
              className={cn(
                "text-xs font-medium justify-center py-1",
                stats.nutrition.carbs 
                  ? "bg-fitness-nutrition/15 text-fitness-nutrition border-fitness-nutrition/30" 
                  : "bg-gray-100 text-gray-600"
              )}
            >
              Glucides {stats.nutrition.carbs ? "✅" : "⚠️"}
            </Badge>
            <Badge 
              variant={stats.nutrition.fats ? "default" : "secondary"}
              className={cn(
                "text-xs font-medium justify-center py-1",
                stats.nutrition.fats 
                  ? "bg-fitness-nutrition/15 text-fitness-nutrition border-fitness-nutrition/30" 
                  : "bg-gray-100 text-gray-600"
              )}
            >
              Lipides {stats.nutrition.fats ? "✅" : "⚠️"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

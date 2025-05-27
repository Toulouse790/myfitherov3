
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          🥗 Nutrition
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold">
              {stats.nutrition.current.toLocaleString()} / {stats.nutrition.target.toLocaleString()} cal
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(nutritionPercentage)}%
            </span>
          </div>
          
          <Progress value={nutritionPercentage} className="h-3" />
          
          <div className="flex gap-3 mt-3">
            <Badge variant={stats.nutrition.proteins ? "default" : "secondary"}>
              Protéines {stats.nutrition.proteins ? "✅" : "⚠️"}
            </Badge>
            <Badge variant={stats.nutrition.carbs ? "default" : "destructive"}>
              Glucides {stats.nutrition.carbs ? "✅" : "⚠️"}
            </Badge>
            <Badge variant={stats.nutrition.fats ? "default" : "secondary"}>
              Lipides {stats.nutrition.fats ? "✅" : "⚠️"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

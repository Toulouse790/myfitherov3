
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppleIcon, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface MealPlanProps {
  id: string;
  title: string;
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealsPerDay: number;
  category: string;
  imageUrl?: string;
}

const MealPlanCard: React.FC<MealPlanProps> = ({ 
  title, description, calories, macros, mealsPerDay, category, imageUrl 
}) => {
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className={cn("h-40 relative overflow-hidden", !imageUrl && "bg-gradient-to-r from-fitness-green/20 to-fitness-teal/20")}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <AppleIcon size={64} className="text-fitness-green/40" />
          </div>
        )}
        <div className="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700 border border-teal-200">
          {category}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <div>
            <div className="text-muted-foreground">Calories</div>
            <div className="font-medium">{calories} kcal</div>
          </div>
          <div>
            <div className="text-muted-foreground">Repas/jour</div>
            <div className="font-medium">{mealsPerDay}</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Macros</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info size={12} />
                    <span className="sr-only">Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Répartition des macronutriments en %</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-1 h-2">
            <div 
              className="bg-fitness-teal rounded-l-full" 
              style={{ width: `${macros.protein}%` }}
              title={`Protéines: ${macros.protein}%`}
            />
            <div 
              className="bg-fitness-blue" 
              style={{ width: `${macros.carbs}%` }}
              title={`Glucides: ${macros.carbs}%`}
            />
            <div 
              className="bg-fitness-orange rounded-r-full" 
              style={{ width: `${macros.fat}%` }}
              title={`Lipides: ${macros.fat}%`}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>{macros.protein}% P</span>
            <span>{macros.carbs}% G</span>
            <span>{macros.fat}% L</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="sm">
          <span>Voir le plan</span>
          <ChevronRight size={16} className="ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MealPlanCard;

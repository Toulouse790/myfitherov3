
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  title?: string;
}

const StreakCounter = ({ currentStreak, longestStreak, title = "Série actuelle" }: StreakCounterProps) => {
  const showFireAnimation = currentStreak >= 5;
  
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Flame className={cn(
            "mr-2 text-orange-500",
            showFireAnimation && "animate-pulse"
          )} size={20} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className={cn(
              "text-4xl font-bold text-orange-600 transition-all duration-500",
              showFireAnimation && "animate-bounce"
            )}>
              {currentStreak}
            </div>
            <p className="text-sm text-orange-500 font-medium">
              {currentStreak === 1 ? 'jour' : 'jours'}
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-muted-foreground">
              <Award size={16} className="mr-1" />
              <span className="text-sm">Record</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">
              {longestStreak}
            </div>
          </div>
        </div>
        
        {showFireAnimation && (
          <div className="mt-3 p-2 bg-orange-100 rounded-lg text-center">
            <p className="text-xs font-medium text-orange-700">
              🔥 Série de feu ! Continuez comme ça !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakCounter;

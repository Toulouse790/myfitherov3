
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { useUserStreak } from '@/hooks/useUserStreak';

interface StreakCounterProps {
  currentStreak?: number;
  longestStreak?: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ 
  currentStreak: propCurrentStreak, 
  longestStreak: propLongestStreak 
}) => {
  const { currentStreak, longestStreak, isLoading } = useUserStreak();
  
  // Use props as fallback if hook data is not available
  const displayCurrentStreak = isLoading ? 0 : (currentStreak ?? propCurrentStreak ?? 0);
  const displayLongestStreak = isLoading ? 0 : (longestStreak ?? propLongestStreak ?? 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Séries d'entraînement</CardTitle>
        <Flame className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-orange-500">
              {displayCurrentStreak} {displayCurrentStreak <= 1 ? 'jour' : 'jours'}
            </div>
            <p className="text-xs text-muted-foreground">Série actuelle</p>
          </div>
          <div>
            <div className="text-lg font-semibold">
              {displayLongestStreak} {displayLongestStreak <= 1 ? 'jour' : 'jours'}
            </div>
            <p className="text-xs text-muted-foreground">Record personnel</p>
          </div>
          {displayCurrentStreak === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Commencez votre première séance pour démarrer votre série !
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCounter;

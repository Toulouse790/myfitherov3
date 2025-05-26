
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
    <Card className="h-[140px]"> {/* Hauteur fixe réduite */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 p-3"> {/* Padding réduit */}
        <CardTitle className="text-xs font-medium">Séries d'entraînement</CardTitle> {/* Titre plus petit */}
        <Flame className="h-3 w-3 text-orange-500" /> {/* Icône plus petite */}
      </CardHeader>
      <CardContent className="p-3 pt-0"> {/* Padding réduit */}
        <div className="space-y-2"> {/* Espacement réduit */}
          <div>
            <div className="text-lg font-bold text-orange-500"> {/* Taille réduite */}
              {displayCurrentStreak} {displayCurrentStreak <= 1 ? 'jour' : 'jours'}
            </div>
            <p className="text-xs text-muted-foreground leading-tight">
              {displayCurrentStreak === 0 ? "Prêt à commencer ?" : "Série actuelle"}
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold"> {/* Taille réduite */}
              {displayLongestStreak} {displayLongestStreak <= 1 ? 'jour' : 'jours'}
            </div>
            <p className="text-xs text-muted-foreground leading-tight">
              {displayLongestStreak === 0 ? "Votre futur record" : "Record personnel"}
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 mt-2"> {/* Padding et margin réduits */}
            <p className="text-xs text-muted-foreground leading-tight">
              💡 Commencez votre première séance pour démarrer votre série !
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCounter;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Moon, Zap, Heart } from 'lucide-react';

interface SleepQualityCardProps {
  quality: number;
  restfulness: number;
  heartRate: number;
  deepSleepPercentage: number;
  remSleepPercentage: number;
  lightSleepPercentage: number;
}

const SleepQualityCard: React.FC<SleepQualityCardProps> = ({
  quality,
  restfulness,
  heartRate,
  deepSleepPercentage,
  remSleepPercentage,
  lightSleepPercentage,
}) => {
  const getQualityColor = (value: number) => {
    if (value >= 80) return "text-green-500";
    if (value >= 60) return "text-blue-500";
    if (value >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getQualityLabel = (value: number) => {
    if (value >= 80) return "Excellent";
    if (value >= 60) return "Bon";
    if (value >= 40) return "Moyen";
    return "Faible";
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Qualité du sommeil</CardTitle>
        <Moon className="text-blue-400" size={20} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-bold">{quality}/100</span>
          <span className={`font-medium ${getQualityColor(quality)}`}>
            {getQualityLabel(quality)}
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Récupération</span>
              <span className="font-medium">{restfulness}%</span>
            </div>
            <Progress value={restfulness} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Heart className="mr-2 text-red-400" size={16} />
              <div>
                <div className="text-xs text-muted-foreground">Rythme cardiaque</div>
                <div className="font-medium">{heartRate} bpm</div>
              </div>
            </div>
            <div className="flex items-center">
              <Zap className="mr-2 text-yellow-400" size={16} />
              <div>
                <div className="text-xs text-muted-foreground">Cycles</div>
                <div className="font-medium">4 cycles</div>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Phases de sommeil</span>
              <span className="text-xs text-muted-foreground">8h06</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full">
              <div
                className="bg-indigo-600"
                style={{ width: `${deepSleepPercentage}%` }}
                title="Sommeil profond"
              />
              <div
                className="bg-purple-400"
                style={{ width: `${remSleepPercentage}%` }}
                title="Sommeil paradoxal"
              />
              <div
                className="bg-blue-300"
                style={{ width: `${lightSleepPercentage}%` }}
                title="Sommeil léger"
              />
            </div>
            <div className="mt-1 flex justify-between text-xs">
              <span>{deepSleepPercentage}% profond</span>
              <span>{remSleepPercentage}% paradoxal</span>
              <span>{lightSleepPercentage}% léger</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepQualityCard;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

interface SportStats {
  workout: { completed: boolean; duration: number; calories: number };
}

interface SportDashboardCardProps {
  stats: SportStats;
}

export function SportDashboardCard({ stats }: SportDashboardCardProps) {
  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          🏃‍♂️ Sport Aujourd'hui
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💪</span>
              <div>
                <div className="font-semibold">Workout - {stats.workout.duration}min</div>
                <div className="text-sm text-gray-600">Séance complétée</div>
              </div>
            </div>
            <Badge variant="default" className="bg-green-500">✅</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-semibold text-lg">{stats.workout.calories} calories</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

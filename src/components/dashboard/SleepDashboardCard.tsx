
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SleepStats {
  sleep: { duration: number; quality: number };
}

interface SleepDashboardCardProps {
  stats: SleepStats;
}

export function SleepDashboardCard({ stats }: SleepDashboardCardProps) {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
        ⭐
      </span>
    ));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          😴 Sommeil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">
              {Math.floor(stats.sleep.duration)}h{String(Math.round((stats.sleep.duration % 1) * 60)).padStart(2, '0')}
            </span>
            <div className="flex">
              {renderStars(stats.sleep.quality)}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/sleep')}>
            Détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

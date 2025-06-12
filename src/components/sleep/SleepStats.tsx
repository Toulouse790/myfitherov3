
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Clock, Target, Award } from 'lucide-react';

const SleepStats = () => {
  // Données statiques pour éviter la roue qui tourne
  const stats = {
    average_duration_minutes: 450, // 7h30
    average_sleep_score: 85,
    sleep_efficiency_percentage: 92,
    consistency_score: 78
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Durée moyenne</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.floor(stats.average_duration_minutes / 60)}h{String(stats.average_duration_minutes % 60).padStart(2, '0')}
          </div>
          <p className="text-xs text-muted-foreground">
            +12min vs semaine dernière
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Score de sommeil</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.average_sleep_score}/100</div>
          <p className="text-xs text-muted-foreground">
            +3 points vs semaine dernière
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Efficacité</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.sleep_efficiency_percentage}%</div>
          <p className="text-xs text-muted-foreground">
            +2% vs semaine dernière
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consistance</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.consistency_score}%</div>
          <p className="text-xs text-muted-foreground">
            Très bon niveau
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepStats;

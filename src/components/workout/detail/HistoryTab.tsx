
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

type HistoryTabProps = {
  onStartWorkout: () => void;
};

const HistoryTab = ({ onStartWorkout }: HistoryTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des performances</CardTitle>
        <CardDescription>Suivez vos progrès sur cet entraînement</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Pas encore d'historique disponible</p>
            <p className="text-sm text-muted-foreground">Commencez cet entraînement pour voir vos progrès</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline" size="sm" onClick={onStartWorkout}>
          Démarrer un entraînement
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HistoryTab;

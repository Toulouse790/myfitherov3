
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';

export function QuickActionsDashboardCard() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button variant="outline" onClick={() => navigate('/workout')} className="h-auto py-3 flex-col gap-2">
            <Dumbbell size={20} />
            <span className="text-xs">Nouvelle séance</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/nutrition')} className="h-auto py-3 flex-col gap-2">
            🍎
            <span className="text-xs">Ajouter repas</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/sleep')} className="h-auto py-3 flex-col gap-2">
            😴
            <span className="text-xs">Sommeil</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/simple-ai')} className="h-auto py-3 flex-col gap-2">
            🤖
            <span className="text-xs">Coach IA</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, MoveUp, Apple } from 'lucide-react';

const RecentAchievements = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Succès récents</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate('/achievements')}>
          Tous les succès
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
            onClick={() => navigate('/achievements/streak')}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Award className="text-secondary" size={20} />
              </div>
              <div className="ml-4">
                <p className="font-medium hover:text-primary transition-colors">3 séances consécutives</p>
                <p className="text-sm text-muted-foreground">Il y a 2 jours</p>
              </div>
            </div>
          </div>
          
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
            onClick={() => navigate('/workout/records')}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-fitness-orange/10 flex items-center justify-center">
                <MoveUp className="text-fitness-orange" size={20} />
              </div>
              <div className="ml-4">
                <p className="font-medium hover:text-primary transition-colors">Nouveau record - Développé couché</p>
                <p className="text-sm text-muted-foreground">Il y a 5 jours</p>
              </div>
            </div>
          </div>
          
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
            onClick={() => navigate('/nutrition/goals')}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-fitness-green/10 flex items-center justify-center">
                <Apple className="text-fitness-green" size={20} />
              </div>
              <div className="ml-4">
                <p className="font-medium hover:text-primary transition-colors">5 jours d'objectifs nutritionnels atteints</p>
                <p className="text-sm text-muted-foreground">Il y a une semaine</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAchievements;

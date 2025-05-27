
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplet, Plus, Minus, Target } from 'lucide-react';

const HydrationModule = () => {
  const [currentHydration, setCurrentHydration] = useState(1800);
  const [targetHydration] = useState(2500);
  const progressPercentage = (currentHydration / targetHydration) * 100;

  const addWater = (amount: number) => {
    setCurrentHydration(prev => Math.min(prev + amount, targetHydration + 500));
  };

  const removeWater = (amount: number) => {
    setCurrentHydration(prev => Math.max(prev - amount, 0));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            💧 Module Hydratation
          </h1>
          <p className="text-sm text-gray-600">Suivez votre consommation d'eau quotidienne</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Hydratation principale */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-6 w-6 text-blue-500" />
              Hydratation du jour
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {(currentHydration / 1000).toFixed(1)}L
              </div>
              <div className="text-gray-600">
                / {(targetHydration / 1000).toFixed(1)}L objectif
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-3" />
            
            <div className="text-center text-sm text-gray-600">
              {progressPercentage >= 100 ? "🎉 Objectif atteint !" : `${Math.round(100 - progressPercentage)}% restant`}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Ajouter</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => addWater(250)} className="flex-col h-auto py-3">
                    <Plus size={16} />
                    <span className="text-xs">250ml</span>
                  </Button>
                  <Button variant="outline" onClick={() => addWater(500)} className="flex-col h-auto py-3">
                    <Plus size={16} />
                    <span className="text-xs">500ml</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Retirer</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => removeWater(250)} className="flex-col h-auto py-3">
                    <Minus size={16} />
                    <span className="text-xs">250ml</span>
                  </Button>
                  <Button variant="outline" onClick={() => removeWater(500)} className="flex-col h-auto py-3">
                    <Minus size={16} />
                    <span className="text-xs">500ml</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conseils */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Conseils hydratation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl">💡</span>
                <div>
                  <div className="font-medium">Buvez régulièrement</div>
                  <div className="text-sm text-gray-600">Répartissez votre consommation tout au long de la journée</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-2xl">🏃‍♂️</span>
                <div>
                  <div className="font-medium">Après l'effort</div>
                  <div className="text-sm text-gray-600">Hydratez-vous davantage après un entraînement</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HydrationModule;

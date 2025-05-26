
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HydrationSection = () => {
  const [currentHydration, setCurrentHydration] = useState(0);
  const dailyGoal = 2500;

  const addWater = (amount: number) => {
    setCurrentHydration(prev => Math.min(prev + amount, dailyGoal));
  };

  const percentage = (currentHydration / dailyGoal) * 100;
  const remaining = dailyGoal - currentHydration;

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (percentage >= 75) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-r from-red-500 to-red-600';
  };

  return (
    <Card className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">💧</span>
        <h2 className="text-lg font-semibold text-slate-900">Hydratation</h2>
      </div>
      
      <div className="text-sm text-slate-600 mb-4">Suivi quotidien</div>
      
      <div className="mb-4">
        <div className="text-lg font-semibold text-slate-900 mb-1">
          {remaining > 0 ? `Encore ${(remaining/1000).toFixed(1)}L à boire` : 'Objectif atteint !'}
        </div>
        <div className="text-2xl font-bold text-red-600">
          {currentHydration} / {dailyGoal} ml
        </div>
      </div>
      
      <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden mb-4">
        <div 
          className={`h-full transition-all duration-300 rounded-full ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button 
          variant="outline" 
          onClick={() => addWater(200)}
          className="flex items-center justify-center gap-1 py-3 bg-slate-50 hover:bg-slate-100 border-slate-200"
        >
          💧 +200ml
        </Button>
        <Button 
          variant="outline" 
          onClick={() => addWater(500)}
          className="flex items-center justify-center gap-1 py-3 bg-slate-50 hover:bg-slate-100 border-slate-200"
        >
          💧 +500ml
        </Button>
      </div>
      
      <Button 
        onClick={() => addWater(750)}
        className="w-full bg-red-200 hover:bg-red-300 text-red-800 border-red-300 py-3 font-medium"
        variant="outline"
      >
        ⚠️ HYDRATATION URGENTE +750ml
      </Button>
    </Card>
  );
};

export default HydrationSection;

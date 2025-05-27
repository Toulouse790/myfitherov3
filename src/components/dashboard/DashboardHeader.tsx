
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useUserStats } from '@/hooks/useUserStats';

export function DashboardHeader() {
  const { stats } = useUserStats();
  
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Tableau de bord</h1>
            <p className="text-sm text-gray-600">
              {stats.completedWorkouts === 0 
                ? "Bienvenue ! Commencez votre transformation dès aujourd'hui"
                : "Voici un aperçu de votre progression"
              }
            </p>
          </div>
          <Button variant="outline" className="w-fit self-start sm:self-auto flex items-center gap-2 text-sm">
            <Calendar size={16} />
            Cette semaine
          </Button>
        </div>
      </div>
    </header>
  );
}

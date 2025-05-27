
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 mb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              🏠 MyFitHero - Dashboard
            </h1>
            <p className="text-sm text-gray-600">Votre progression du jour</p>
          </div>
          <Button variant="outline" size="sm">
            <Calendar size={16} />
            Aujourd'hui
          </Button>
        </div>
      </div>
    </header>
  );
}

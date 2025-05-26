
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  userName?: string;
}

const DashboardHeader = ({ userName = "Thomas" }: DashboardHeaderProps) => {
  return (
    <header className="bg-white border-b border-slate-200 py-3 sm:py-4 mb-4 sm:mb-6">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Tableau de bord</h1>
            <p className="text-xs sm:text-sm text-slate-600">Bonjour {userName}, voici un aperçu de votre progression</p>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 w-fit self-start sm:self-auto">
            <Calendar size={14} className="sm:w-4 sm:h-4" />
            Cette semaine
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

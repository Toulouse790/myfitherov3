
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  userName?: string;
}

const DashboardHeader = ({ userName = "Thomas" }: DashboardHeaderProps) => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 mb-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Tableau de bord</h1>
            <p className="text-sm text-slate-600">Bonjour {userName}, voici un aperçu de votre progression</p>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-fit">
            <Calendar size={16} />
            Cette semaine
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

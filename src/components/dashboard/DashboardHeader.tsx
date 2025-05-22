
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  userName?: string;
}

const DashboardHeader = ({ userName = "Thomas" }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">Bonjour {userName}, voici un aperçu de votre progression</p>
      </div>
      <Button>
        <Calendar size={16} className="mr-2" />
        Cette semaine
      </Button>
    </div>
  );
};

export default DashboardHeader;

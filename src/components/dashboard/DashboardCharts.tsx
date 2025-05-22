
import React from 'react';
import ProgressChart from '@/components/dashboard/ProgressChart';

const DashboardCharts = () => {
  const activityData = [
    { name: 'Lun', séances: 1, calories: 450, sommeil: 7.2 },
    { name: 'Mar', séances: 0, calories: 200, sommeil: 6.8 },
    { name: 'Mer', séances: 1, calories: 520, sommeil: 8.1 },
    { name: 'Jeu', séances: 1, calories: 380, sommeil: 7.5 },
    { name: 'Ven', séances: 0, calories: 180, sommeil: 7.0 },
    { name: 'Sam', séances: 1, calories: 600, sommeil: 8.3 },
    { name: 'Dim', séances: 0, calories: 220, sommeil: 8.5 },
  ];

  const progressData = [
    { name: 'Semaine 1', force: 85, endurance: 60, récupération: 70 },
    { name: 'Semaine 2', force: 87, endurance: 65, récupération: 72 },
    { name: 'Semaine 3', force: 90, endurance: 68, récupération: 75 },
    { name: 'Semaine 4', force: 88, endurance: 72, récupération: 80 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProgressChart 
        title="Activité quotidienne"
        data={activityData}
        dataKeys={[
          { key: 'séances', color: '#1E40AF', name: 'Séances' },
          { key: 'calories', color: '#EA580C', name: 'Calories (x10)' },
          { key: 'sommeil', color: '#7E22CE', name: 'Sommeil (h)' },
        ]}
      />
      <ProgressChart 
        title="Progression mensuelle"
        data={progressData}
        dataKeys={[
          { key: 'force', color: '#1E40AF', name: 'Force' },
          { key: 'endurance', color: '#059669', name: 'Endurance' },
          { key: 'récupération', color: '#7E22CE', name: 'Récupération' },
        ]}
      />
    </div>
  );
};

export default DashboardCharts;

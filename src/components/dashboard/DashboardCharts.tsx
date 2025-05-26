
import React from 'react';
import ProgressChart from '@/components/dashboard/ProgressChart';
import { useUserChartData } from '@/hooks/useUserChartData';

const DashboardCharts = () => {
  const { activityData, progressData, isLoading } = useUserChartData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

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

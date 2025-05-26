
import React from 'react';
import { Card } from '@/components/ui/card';

const DashboardStatsGrid = () => {
  const stats = [
    {
      icon: '🏃',
      title: 'Séances complétées',
      value: '0',
      label: 'cette semaine',
      secondary: '0'
    },
    {
      icon: '🔥',
      title: 'Calories brûlées',
      value: '0',
      label: 'cette semaine',
      secondary: '0'
    },
    {
      icon: '💜',
      title: 'Qualité du sommeil',
      value: '0%',
      label: 'Suivez votre récupération',
      secondary: '0'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white border border-slate-200 rounded-xl p-3 sm:p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center gap-2 mb-2 sm:mb-4">
            <span className="text-base sm:text-lg">{stat.icon}</span>
            <h3 className="text-xs sm:text-sm font-medium text-slate-600">{stat.title}</h3>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
          <div className="text-xs sm:text-sm text-slate-500 mb-1 sm:mb-2">{stat.label}</div>
          <div className="text-lg sm:text-xl font-semibold text-slate-900">{stat.secondary}</div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStatsGrid;

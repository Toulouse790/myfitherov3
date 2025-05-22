
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import UpcomingWorkouts from '@/components/dashboard/UpcomingWorkouts';
import RecentAchievements from '@/components/dashboard/RecentAchievements';

const Dashboard = () => {
  // Prochains entraînements
  const upcomingWorkouts = [
    { id: 1, name: 'Musculation - Haut du corps', time: 'Aujourd\'hui, 18:00', duration: '45 min' },
    { id: 2, name: 'Cardio HIIT', time: 'Demain, 07:30', duration: '30 min' },
    { id: 3, name: 'Musculation - Bas du corps', time: 'Mercredi, 18:00', duration: '50 min' },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <DashboardHeader />
        <DashboardStats />
        <DashboardCharts />
        
        {/* Upcoming Workouts & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingWorkouts workouts={upcomingWorkouts} />
          <RecentAchievements />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

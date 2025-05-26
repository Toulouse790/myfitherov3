
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatsGrid from '@/components/dashboard/DashboardStatsGrid';
import StarterSection from '@/components/dashboard/StarterSection';
import AIAgentsSection from '@/components/dashboard/AIAgentsSection';
import HydrationSection from '@/components/dashboard/HydrationSection';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-3 sm:px-4 max-w-6xl">
        <DashboardStatsGrid />
        <StarterSection />
        <AIAgentsSection />
        <HydrationSection />
      </main>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import AdminTabsSection from '@/components/admin/AdminTabsSection';
import { AdminStats, LogEntry } from '@/services/admin';

interface AdminDashboardContentProps {
  stats: AdminStats;
  logs: LogEntry[];
  dashboardLoading: boolean;
  onLogout: () => void;
}

const AdminDashboardContent = ({ 
  stats,
  logs,
  dashboardLoading,
  onLogout
}: AdminDashboardContentProps) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminHeader onLogout={onLogout} />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Gestion du système et des intégrations MyFitHero
            </p>
          </div>
        </div>

        <AdminDashboardStats stats={stats} isLoading={dashboardLoading} />
        <AdminTabsSection logs={logs} />
      </main>
    </div>
  );
};

export default AdminDashboardContent;

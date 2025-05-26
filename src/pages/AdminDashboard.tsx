
import React from 'react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminLoadingScreen from '@/components/admin/AdminLoadingScreen';
import AdminDashboardContent from '@/components/admin/AdminDashboardContent';

const AdminDashboard = () => {
  const { 
    stats, 
    logs,
    dashboardLoading, 
    fetchDashboardData 
  } = useAdminDashboard();

  const {
    isAuthenticated,
    isLoading,
    handleLogin,
    handleLogout
  } = useAdminAuth(fetchDashboardData);

  // Affichage pendant le chargement
  if (isLoading) {
    return <AdminLoadingScreen />;
  }

  // Affichage du formulaire de connexion si non authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AdminLoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminDashboardContent
          stats={stats}
          logs={logs}
          dashboardLoading={dashboardLoading}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

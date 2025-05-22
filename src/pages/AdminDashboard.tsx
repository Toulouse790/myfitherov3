
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
    return <AdminLoginForm onLogin={handleLogin} />;
  }

  return (
    <AdminDashboardContent
      stats={stats}
      logs={logs}
      dashboardLoading={dashboardLoading}
      onLogout={handleLogout}
    />
  );
};

export default AdminDashboard;

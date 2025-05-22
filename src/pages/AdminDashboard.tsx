
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Users, 
  Brain, 
  Workflow, 
  Activity, 
  Settings,
  Clock,
  CheckCircle2
} from 'lucide-react';

import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminAgentTable from '@/components/admin/AdminAgentTable';
import AdminIntegrationPanel from '@/components/admin/AdminIntegrationPanel';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminActivityCharts from '@/components/admin/AdminActivityCharts';
import AdminOpenAIConfig from '@/components/admin/AdminOpenAIConfig';
import AdminSystemLogs from '@/components/admin/AdminSystemLogs';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import AgentManagement from '@/components/admin/AgentManagement';

const AdminDashboard = () => {
  const { 
    isAuthenticated, 
    setIsAuthenticated,
    stats, 
    logs,
    dashboardLoading, 
    fetchDashboardData 
  } = useAdminDashboard();

  const handleLogout = () => {
    import('@/services/admin').then(({ AdminService }) => {
      AdminService.logout();
      setIsAuthenticated(false);
    });
  };

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Gestion du système et des intégrations MyFitHero
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard 
            title="Utilisateurs"
            value={stats.users}
            icon={<Users className="text-blue-500" />}
            trend={12.5}
            description="Total des comptes"
            className={dashboardLoading ? "animate-pulse" : ""}
          />
          <AdminStatCard 
            title="Conversations"
            value={stats.conversations}
            icon={<Brain className="text-purple-500" />}
            trend={8.3}
            description="Interactions IA"
            className={dashboardLoading ? "animate-pulse" : ""}
          />
          <AdminStatCard 
            title="Taux de réussite"
            value={`${stats.successRate}%`}
            icon={<CheckCircle2 className="text-green-500" />}
            trend={-1.2}
            description="Réponses valides"
            className={dashboardLoading ? "animate-pulse" : ""}
          />
          <AdminStatCard 
            title="Temps de réponse"
            value={`${stats.responseTime}s`}
            icon={<Clock className="text-orange-500" />}
            trend={-5.7}
            trendDirection="down"
            description="Moyenne"
            className={dashboardLoading ? "animate-pulse" : ""}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid md:grid-cols-6 grid-cols-2 md:grid-rows-1 grid-rows-3 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Vue d'ensemble</span>
              <span className="md:hidden">Aperçu</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Agents IA</span>
            </TabsTrigger>
            <TabsTrigger value="agents-ia" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Gestion Agents</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              <span>Intégrations</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Configuration</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Logs</span>
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-4">
            <AdminActivityCharts />
          </TabsContent>

          {/* Agents IA */}
          <TabsContent value="agents" className="space-y-4">
            <AdminAgentTable />
          </TabsContent>

          {/* Gestion des agents */}
          <TabsContent value="agents-ia" className="space-y-4">
            <AgentManagement />
          </TabsContent>

          {/* Intégrations */}
          <TabsContent value="integrations" className="space-y-4">
            <AdminIntegrationPanel />
          </TabsContent>

          {/* Configuration */}
          <TabsContent value="config" className="space-y-4">
            <AdminOpenAIConfig />
          </TabsContent>

          {/* Logs système */}
          <TabsContent value="logs" className="space-y-4">
            <AdminSystemLogs initialLogs={logs} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;

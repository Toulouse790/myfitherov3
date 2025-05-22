
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Users, 
  Brain, 
  Workflow, 
  Activity, 
  Settings
} from 'lucide-react';
import AdminActivityCharts from '@/components/admin/AdminActivityCharts';
import AdminAgentTable from '@/components/admin/AdminAgentTable';
import AgentManagement from '@/components/admin/AgentManagement';
import AdminIntegrationPanel from '@/components/admin/AdminIntegrationPanel';
import AdminOpenAIConfig from '@/components/admin/AdminOpenAIConfig';
import AdminSystemLogs from '@/components/admin/AdminSystemLogs';
import { LogEntry } from '@/services/admin';

interface AdminTabsSectionProps {
  logs: LogEntry[];
}

const AdminTabsSection = ({ logs }: AdminTabsSectionProps) => {
  return (
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
  );
};

export default AdminTabsSection;

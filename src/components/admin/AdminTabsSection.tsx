
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Brain, 
  Workflow, 
  Activity, 
  Settings
} from 'lucide-react';
import { LogEntry } from '@/services/admin';

// Import tab content components
import AdminOverviewTab from './tabs/AdminOverviewTab';
import AdminAgentsTab from './tabs/AdminAgentsTab';
import AdminAgentManagementTab from './tabs/AdminAgentManagementTab';
import AdminIntegrationsTab from './tabs/AdminIntegrationsTab';
import AdminConfigTab from './tabs/AdminConfigTab';
import AdminLogsTab from './tabs/AdminLogsTab';

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

      {/* Tab contents using the separate components */}
      <TabsContent value="overview">
        <AdminOverviewTab />
      </TabsContent>

      <TabsContent value="agents">
        <AdminAgentsTab />
      </TabsContent>

      <TabsContent value="agents-ia">
        <AdminAgentManagementTab />
      </TabsContent>

      <TabsContent value="integrations">
        <AdminIntegrationsTab />
      </TabsContent>

      <TabsContent value="config">
        <AdminConfigTab />
      </TabsContent>

      <TabsContent value="logs">
        <AdminLogsTab initialLogs={logs} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabsSection;

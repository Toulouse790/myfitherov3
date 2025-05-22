
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useN8nConfig } from '@/hooks/useN8nConfig';
import { useWebhooks } from '@/hooks/useWebhooks';
import SystemStatusCard from './SystemStatusCard';
import N8nConfigPanel from './N8nConfigPanel';
import WebhooksPanel from './WebhooksPanel';
import ApiConfigPanel from './ApiConfigPanel';
import N8nConnectionTest from './N8nConnectionTest';
import AISystemMonitor from './AISystemMonitor';

const AdminIntegrationPanel: React.FC = () => {
  const {
    n8nUrl,
    setN8nUrl,
    n8nTestLoading,
    n8nConnectionStatus,
    loading,
    errorMessage,
    fetchN8nConfig,
    testN8nConnection
  } = useN8nConfig();
  
  const { webhooks } = useWebhooks();
  
  useEffect(() => {
    fetchN8nConfig();
  }, [fetchN8nConfig]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <Tabs defaultValue="n8n">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Intégrations externes</CardTitle>
                <TabsList>
                  <TabsTrigger value="n8n" className="text-sm">n8n</TabsTrigger>
                  <TabsTrigger value="webhooks" className="text-sm">Webhooks</TabsTrigger>
                  <TabsTrigger value="api" className="text-sm">API</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>Configuration des services connectés</CardDescription>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="n8n" className="space-y-4 mt-0">
                <N8nConfigPanel 
                  n8nUrl={n8nUrl}
                  setN8nUrl={setN8nUrl}
                  n8nConnectionStatus={n8nConnectionStatus}
                  n8nTestLoading={n8nTestLoading}
                  loading={loading}
                  errorMessage={errorMessage}
                  testConnection={testN8nConnection}
                />
                
                {/* Ajout du composant de test de connexion n8n */}
                <N8nConnectionTest />
              </TabsContent>
              
              <TabsContent value="webhooks" className="mt-0">
                <WebhooksPanel webhooks={webhooks} />
              </TabsContent>
              
              <TabsContent value="api" className="mt-0">
                <ApiConfigPanel />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
      
      <div className="space-y-4">
        <SystemStatusCard 
          n8nStatus={n8nConnectionStatus}
          loading={loading}
          errorMessage={errorMessage}
          onRefresh={fetchN8nConfig}
        />
        
        {/* Ajout du moniteur système IA */}
        <AISystemMonitor />
      </div>
    </div>
  );
};

export default AdminIntegrationPanel;


import React from 'react';
import { Button } from "@/components/ui/button";
import { Webhook, Play, ExternalLink } from 'lucide-react';

interface WebhookData {
  id: string;
  name: string;
  url: string;
  status: string;
  lastUsed: string;
}

interface WebhooksPanelProps {
  webhooks: WebhookData[];
}

const WebhooksPanel: React.FC<WebhooksPanelProps> = ({ webhooks }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Webhook className="h-5 w-5 text-green-500" />
          <h3 className="font-medium">Webhooks configurés</h3>
        </div>
        <Button size="sm">
          Nouveau webhook
        </Button>
      </div>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4 font-medium text-sm">Nom</th>
            <th className="text-left py-2 px-4 font-medium text-sm">URL</th>
            <th className="text-center py-2 px-4 font-medium text-sm">Statut</th>
            <th className="text-center py-2 px-4 font-medium text-sm">Dernière utilisation</th>
            <th className="text-right py-2 px-4 font-medium text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {webhooks.map(webhook => (
            <tr key={webhook.id} className="border-b hover:bg-muted/50">
              <td className="py-2 px-4">{webhook.name}</td>
              <td className="py-2 px-4">
                <div className="font-mono text-xs truncate max-w-[180px]">
                  {webhook.url}
                </div>
              </td>
              <td className="py-2 px-4 text-center">
                <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                  webhook.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}>
                  {webhook.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="py-2 px-4 text-center text-xs text-muted-foreground">
                {new Date(webhook.lastUsed).toLocaleString(undefined, {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </td>
              <td className="py-2 px-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Play className="h-3 w-3" />
                    <span className="sr-only">Tester</span>
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <ExternalLink className="h-3 w-3" />
                    <span className="sr-only">Ouvrir</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WebhooksPanel;

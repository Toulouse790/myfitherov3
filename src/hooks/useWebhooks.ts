
import { useState } from 'react';

export interface Webhook {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive';
  lastUsed: string;
}

export const useWebhooks = () => {
  // For demo purposes, initialize with some example webhooks
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: 'webhook-1',
      name: 'Agent Traitement',
      url: 'https://n8n.example.com/webhook/agent-processing',
      status: 'active',
      lastUsed: '2025-05-21T10:15:30Z'
    },
    {
      id: 'webhook-2',
      name: 'Notification Utilisateur',
      url: 'https://n8n.example.com/webhook/user-notification',
      status: 'active',
      lastUsed: '2025-05-21T11:05:12Z'
    },
    {
      id: 'webhook-3',
      name: 'Traitement Feedback',
      url: 'https://n8n.example.com/webhook/feedback-processing',
      status: 'inactive',
      lastUsed: '2025-05-20T15:32:18Z'
    }
  ]);

  return {
    webhooks,
    setWebhooks
  };
};

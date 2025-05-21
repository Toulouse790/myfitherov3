
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Données fictives des agents
const initialAgents = [
  { 
    id: 'nutrition-agent', 
    name: 'Agent Nutrition', 
    type: 'nutrition',
    status: 'active', 
    responseTime: 1.2,
    successRate: 97.8,
    lastActive: '2025-05-21T10:23:15Z',
    model: 'gpt-4o'
  },
  { 
    id: 'sommeil-agent', 
    name: 'Agent Sommeil', 
    type: 'sommeil',
    status: 'active', 
    responseTime: 1.5,
    successRate: 95.2,
    lastActive: '2025-05-21T09:47:31Z',
    model: 'gpt-4o'
  },
  { 
    id: 'muscu-agent', 
    name: 'Agent Musculation', 
    type: 'muscu',
    status: 'active', 
    responseTime: 1.8,
    successRate: 96.5,
    lastActive: '2025-05-21T11:05:44Z',
    model: 'gpt-4o'
  },
  { 
    id: 'hydratation-agent', 
    name: 'Agent Hydratation', 
    type: 'hydratation',
    status: 'inactive', 
    responseTime: 1.4,
    successRate: 94.7,
    lastActive: '2025-05-20T15:35:22Z',
    model: 'gpt-4o-mini'
  },
  { 
    id: 'synthese-agent', 
    name: 'Agent Synthèse', 
    type: 'synthese',
    status: 'active', 
    responseTime: 2.5,
    successRate: 98.3,
    lastActive: '2025-05-21T11:12:09Z',
    model: 'gpt-4o'
  },
];

const AdminAgentTable = () => {
  const [agents, setAgents] = useState(initialAgents);
  const [loading, setLoading] = useState<string | null>(null);

  const toggleAgentStatus = (id: string) => {
    setLoading(id);
    
    // Simuler un délai d'API
    setTimeout(() => {
      setAgents(agents.map(agent => 
        agent.id === id 
          ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
          : agent
      ));
      
      const agent = agents.find(a => a.id === id);
      const newStatus = agent?.status === 'active' ? 'inactive' : 'active';
      
      toast(
        newStatus === 'active' ? "Agent activé" : "Agent désactivé",
        { 
          description: `L'agent ${agent?.name} a été ${newStatus === 'active' ? 'activé' : 'désactivé'}` 
        }
      );
      
      setLoading(null);
    }, 800);
  };

  // Obtenir la couleur pour le taux de réussite
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return "text-green-600 dark:text-green-400";
    if (rate >= 90) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-muted-foreground">Agents disponibles: {agents.filter(a => a.status === 'active').length}/{agents.length}</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-sm">
            <RefreshCw className="h-3 w-3 mr-2" />
            Actualiser
          </Button>
          <Button size="sm" className="text-sm">
            Nouvel agent
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Agent</TableHead>
              <TableHead>Modèle</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-center">Temps réponse</TableHead>
              <TableHead className="text-center">Taux réussite</TableHead>
              <TableHead className="text-center">Dernière activité</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map(agent => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-xs text-muted-foreground">ID: {agent.id}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {agent.model}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Switch
                      checked={agent.status === 'active'}
                      onCheckedChange={() => toggleAgentStatus(agent.id)}
                      disabled={loading === agent.id}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {agent.responseTime} sec
                </TableCell>
                <TableCell className="text-center">
                  <span className={getSuccessRateColor(agent.successRate)}>
                    {agent.successRate.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {new Date(agent.lastActive).toLocaleString(undefined, {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Configurer</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAgentTable;

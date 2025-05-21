
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { AdminService, AgentStats } from '@/services/admin';

const AdminAgentTable = () => {
  const [agents, setAgents] = useState<AgentStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const agentData = await AdminService.getAgents();
      setAgents(agentData);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      toast.error('Erreur', { 
        description: 'Impossible de charger les agents' 
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAgentStatus = async (id: string) => {
    setUpdateLoading(id);
    
    const agent = agents.find(a => a.id === id);
    if (!agent) return;
    
    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    
    try {
      const success = await AdminService.updateAgentStatus(id, newStatus);
      
      if (success) {
        setAgents(agents.map(agent => 
          agent.id === id 
            ? { ...agent, status: newStatus }
            : agent
        ));
        
        toast(
          newStatus === 'active' ? "Agent activé" : "Agent désactivé",
          { 
            description: `L'agent ${agent.name} a été ${newStatus === 'active' ? 'activé' : 'désactivé'}` 
          }
        );
      } else {
        throw new Error('Failed to update agent status');
      }
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast.error('Erreur', { 
        description: 'Impossible de mettre à jour le statut de l\'agent' 
      });
    } finally {
      setUpdateLoading(null);
    }
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
          <span className="text-sm text-muted-foreground">
            {loading ? (
              "Chargement des agents..."
            ) : (
              `Agents disponibles: ${agents.filter(a => a.status === 'active').length}/${agents.length}`
            )}
          </span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-sm" onClick={fetchAgents} disabled={loading}>
            <RefreshCw className={`h-3 w-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Chargement des agents...</p>
                </TableCell>
              </TableRow>
            ) : agents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <p className="text-sm text-muted-foreground">Aucun agent disponible</p>
                </TableCell>
              </TableRow>
            ) : (
              agents.map(agent => (
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
                        disabled={updateLoading === agent.id}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAgentTable;

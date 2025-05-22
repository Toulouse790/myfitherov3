
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAgents, AIAgent } from '@/hooks/useAgents';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const AgentManagement = () => {
  const { agents, addAgent, updateAgent, deleteAgent, toggleAgentStatus } = useAgents();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);

  const [newAgent, setNewAgent] = useState({
    name: '',
    icon: 'Brain',
    status: 'standby' as const,
    specialty: '',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: ''
  });

  const iconOptions = [
    'Brain', 'Dumbbell', 'Apple', 'Moon', 'Droplets', 'Zap', 
    'Heart', 'Target', 'Timer', 'TrendingUp', 'Activity', 'Settings'
  ];

  const colorOptions = [
    { value: 'text-blue-600', bg: 'bg-blue-50', label: 'Bleu' },
    { value: 'text-red-600', bg: 'bg-red-50', label: 'Rouge' },
    { value: 'text-green-600', bg: 'bg-green-50', label: 'Vert' },
    { value: 'text-purple-600', bg: 'bg-purple-50', label: 'Violet' },
    { value: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Jaune' },
    { value: 'text-cyan-600', bg: 'bg-cyan-50', label: 'Cyan' },
    { value: 'text-orange-600', bg: 'bg-orange-50', label: 'Orange' },
    { value: 'text-pink-600', bg: 'bg-pink-50', label: 'Rose' }
  ];

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.specialty) {
      toast.error('Erreur', { description: 'Nom et spécialité sont requis' });
      return;
    }

    const selectedColor = colorOptions.find(c => c.value === newAgent.color);
    addAgent({
      ...newAgent,
      bgColor: selectedColor?.bg || 'bg-blue-50'
    });

    toast.success('Agent ajouté', { description: `${newAgent.name} a été ajouté avec succès` });
    
    setNewAgent({
      name: '',
      icon: 'Brain',
      status: 'standby',
      specialty: '',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteAgent = (agent: AIAgent) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'agent ${agent.name} ?`)) {
      deleteAgent(agent.id);
      toast.success('Agent supprimé', { description: `${agent.name} a été supprimé` });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Agents IA</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Nouvel Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel agent IA</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de l'agent</Label>
                <Input
                  id="name"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  placeholder="Ex: Expert Yoga"
                />
              </div>
              
              <div>
                <Label htmlFor="specialty">Spécialité</Label>
                <Input
                  id="specialty"
                  value={newAgent.specialty}
                  onChange={(e) => setNewAgent({...newAgent, specialty: e.target.value})}
                  placeholder="Ex: Cours de yoga et méditation"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                  placeholder="Description détaillée de l'agent"
                />
              </div>
              
              <div>
                <Label htmlFor="icon">Icône</Label>
                <Select value={newAgent.icon} onValueChange={(value) => setNewAgent({...newAgent, icon: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(icon => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="color">Couleur</Label>
                <Select value={newAgent.color} onValueChange={(value) => setNewAgent({...newAgent, color: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(color => (
                      <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Statut initial</Label>
                <Select value={newAgent.status} onValueChange={(value: any) => setNewAgent({...newAgent, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="standby">Standby</SelectItem>
                    <SelectItem value="learning">Apprentissage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleAddAgent} className="w-full">
                Ajouter l'agent
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <Badge 
                  variant={agent.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {agent.status === 'active' ? 'Actif' : 
                   agent.status === 'learning' ? 'Apprentissage' : 'Standby'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{agent.specialty}</p>
              {agent.description && (
                <p className="text-xs text-muted-foreground">{agent.description}</p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAgentStatus(agent.id)}
                  >
                    {agent.status === 'active' ? (
                      <PowerOff size={14} className="mr-1" />
                    ) : (
                      <Power size={14} className="mr-1" />
                    )}
                    {agent.status === 'active' ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingAgent(agent)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAgent(agent)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              
              {agent.lastActive && (
                <p className="text-xs text-muted-foreground">
                  Dernière activité: {new Date(agent.lastActive).toLocaleDateString('fr-FR')}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgentManagement;


import { useState, useEffect } from 'react';
import { StorageService } from '@/services/storage';

export interface AIAgent {
  id: string;
  name: string;
  icon: string; // Nom de l'icône Lucide
  status: 'active' | 'standby' | 'learning';
  specialty: string;
  color: string;
  bgColor: string;
  description?: string;
  lastActive?: string;
}

const defaultAgents: AIAgent[] = [
  {
    id: 'expert_sport',
    name: 'Expert Sport',
    icon: 'Dumbbell',
    status: 'active',
    specialty: 'Plans d\'entraînement et musculation',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Spécialisé dans la création de programmes d\'entraînement personnalisés',
    lastActive: new Date().toISOString()
  },
  {
    id: 'expert_nutrition',
    name: 'Expert Nutrition',
    icon: 'Apple',
    status: 'active',
    specialty: 'Conseils nutritionnels et diététiques',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Expert en nutrition sportive et plans alimentaires',
    lastActive: new Date().toISOString()
  },
  {
    id: 'expert_sommeil',
    name: 'Expert Sommeil',
    icon: 'Moon',
    status: 'active',
    specialty: 'Optimisation du repos et récupération',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Analyse et amélioration de la qualité du sommeil',
    lastActive: new Date().toISOString()
  },
  {
    id: 'expert_hydratation',
    name: 'Expert Hydratation',
    icon: 'Droplets',
    status: 'standby',
    specialty: 'Gestion de l\'hydratation',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    description: 'Suivi et conseils d\'hydratation personnalisés',
    lastActive: new Date().toISOString()
  },
  {
    id: 'ia_coordination',
    name: 'IA Coordination',
    icon: 'Brain',
    status: 'active',
    specialty: 'Coordination et synthèse',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Coordonne tous les agents pour une approche holistique',
    lastActive: new Date().toISOString()
  }
];

export const useAgents = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    try {
      const storedAgents = StorageService.getItem<AIAgent[]>('aiAgents', defaultAgents);
      setAgents(storedAgents);
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error);
      setAgents(defaultAgents);
    } finally {
      setLoading(false);
    }
  };

  const saveAgents = (newAgents: AIAgent[]) => {
    try {
      StorageService.setItem('aiAgents', newAgents);
      setAgents(newAgents);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des agents:', error);
    }
  };

  const addAgent = (agent: Omit<AIAgent, 'id' | 'lastActive'>) => {
    const newAgent: AIAgent = {
      ...agent,
      id: `agent_${Date.now()}`,
      lastActive: new Date().toISOString()
    };
    const updatedAgents = [...agents, newAgent];
    saveAgents(updatedAgents);
  };

  const updateAgent = (id: string, updates: Partial<AIAgent>) => {
    const updatedAgents = agents.map(agent =>
      agent.id === id
        ? { ...agent, ...updates, lastActive: new Date().toISOString() }
        : agent
    );
    saveAgents(updatedAgents);
  };

  const deleteAgent = (id: string) => {
    const updatedAgents = agents.filter(agent => agent.id !== id);
    saveAgents(updatedAgents);
  };

  const toggleAgentStatus = (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (agent) {
      const newStatus = agent.status === 'active' ? 'standby' : 'active';
      updateAgent(id, { status: newStatus });
    }
  };

  return {
    agents,
    loading,
    addAgent,
    updateAgent,
    deleteAgent,
    toggleAgentStatus,
    refreshAgents: loadAgents
  };
};

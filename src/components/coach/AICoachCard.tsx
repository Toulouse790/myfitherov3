
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Dumbbell, Apple, Moon, Droplets, Zap, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAgents, AIAgent } from '@/hooks/useAgents';
import { useNavigate } from 'react-router-dom';

// Map des icônes disponibles
const iconMap = {
  Brain,
  Dumbbell,
  Apple,
  Moon,
  Droplets,
  Zap,
  Settings
};

const AICoachCard = () => {
  const { agents, loading, toggleAgentStatus } = useAgents();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="hover-grow">
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeAgents = agents.filter(agent => agent.status === 'active');
  const totalPrecision = Math.round(
    agents.reduce((acc, agent) => acc + (agent.status === 'active' ? 95 : 80), 0) / agents.length
  );

  return (
    <Card className="hover-grow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Brain className="mr-2 text-purple-600" size={20} />
            Agents IA Spécialisés
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="text-xs"
          >
            <Settings size={14} className="mr-1" />
            Gérer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {agents.slice(0, 5).map((agent) => {
          const IconComponent = iconMap[agent.icon as keyof typeof iconMap] || Brain;
          
          return (
            <div
              key={agent.id}
              className={cn(
                "p-3 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer",
                agent.bgColor
              )}
              onClick={() => toggleAgentStatus(agent.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <IconComponent className={cn("mr-2", agent.color)} size={18} />
                  <span className="font-medium text-sm">{agent.name}</span>
                </div>
                <Badge 
                  variant={agent.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {agent.status === 'active' ? 'Actif' : 
                   agent.status === 'learning' ? 'Apprentissage' : 'Standby'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{agent.specialty}</p>
              
              {agent.status === 'active' && (
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">
                    En ligne
                  </span>
                </div>
              )}
            </div>
          );
        })}
        
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">Performance Collective</span>
            <span className="text-purple-600 font-bold">{totalPrecision}% précision</span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${totalPrecision}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-purple-600 mt-1">
            <span>{activeAgents.length} agents actifs</span>
            <span>{agents.length} agents total</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AICoachCard;

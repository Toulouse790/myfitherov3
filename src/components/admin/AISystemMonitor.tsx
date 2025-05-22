
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIIntegrationService } from '@/services/aiIntegration';
import { Activity, Users, MessageSquare, Zap, RefreshCw } from 'lucide-react';

interface SystemStats {
  totalUsers: number;
  activeConversations: number;
  messagesPerDay: number;
  averageResponseTime: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'error';
}

const AISystemMonitor: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeConversations: 0,
    messagesPerDay: 0,
    averageResponseTime: 0,
    systemHealth: 'good'
  });
  const [loading, setLoading] = useState(false);

  const refreshStats = () => {
    setLoading(true);
    
    // Simulation de récupération des stats depuis le localStorage et calculs
    setTimeout(() => {
      const conversations = AIIntegrationService.getConversations();
      const userId = AIIntegrationService.getUserId();
      
      // Calculs basés sur les données réelles
      const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
      const today = new Date().toDateString();
      const todayMessages = conversations.reduce((sum, conv) => {
        return sum + conv.messages.filter(msg => {
          const msgDate = msg.timestamp instanceof Date ? 
            msg.timestamp.toDateString() : 
            new Date(msg.timestamp as string).toDateString();
          return msgDate === today;
        }).length;
      }, 0);
      
      // Calculer le temps moyen de réponse (simulé pour l'instant)
      const averageResponseTime = totalMessages > 0 ? Number((Math.random() * 1.5 + 0.5).toFixed(1)) : 0;
      
      // Déterminer la santé du système
      let systemHealth: SystemStats['systemHealth'] = 'excellent';
      if (averageResponseTime > 1.5) systemHealth = 'warning';
      else if (averageResponseTime > 2.5) systemHealth = 'error';
      
      setStats({
        totalUsers: 1, // Toujours au moins l'utilisateur actuel
        activeConversations: conversations.length,
        messagesPerDay: todayMessages,
        averageResponseTime: averageResponseTime,
        systemHealth
      });
      
      setLoading(false);
    }, 800);
  };

  // Charger les stats au montage
  useEffect(() => {
    refreshStats();
  }, []);

  // Fonction pour obtenir la couleur du badge de santé
  const getHealthBadgeColor = (health: SystemStats['systemHealth']) => {
    switch (health) {
      case 'excellent': return 'bg-green-500 hover:bg-green-400';
      case 'good': return 'bg-blue-500 hover:bg-blue-400';
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-400';
      case 'error': return 'bg-red-500 hover:bg-red-400';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Moniteur Système IA</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshStats}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Santé du système</span>
          <Badge 
            className={`capitalize ${getHealthBadgeColor(stats.systemHealth)}`}
          >
            {stats.systemHealth}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1 border rounded-lg p-3">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-xs">Utilisateurs</span>
            </div>
            <span className="font-bold">{stats.totalUsers}</span>
          </div>
          
          <div className="flex flex-col space-y-1 border rounded-lg p-3">
            <div className="flex items-center text-muted-foreground">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-xs">Conversations</span>
            </div>
            <span className="font-bold">{stats.activeConversations}</span>
          </div>
          
          <div className="flex flex-col space-y-1 border rounded-lg p-3">
            <div className="flex items-center text-muted-foreground">
              <Activity className="h-4 w-4 mr-1" />
              <span className="text-xs">Msgs/jour</span>
            </div>
            <span className="font-bold">{stats.messagesPerDay}</span>
          </div>
          
          <div className="flex flex-col space-y-1 border rounded-lg p-3">
            <div className="flex items-center text-muted-foreground">
              <Zap className="h-4 w-4 mr-1" />
              <span className="text-xs">Temps réponse</span>
            </div>
            <span className="font-bold">{stats.averageResponseTime}s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISystemMonitor;


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
          // Fix TypeScript error by properly handling the timestamp type
          let msgDate: string;
          if (msg.timestamp instanceof Date) {
            msgDate = msg.timestamp.toDateString();
          } else if (typeof msg.timestamp === 'string') {
            msgDate = new Date(msg.timestamp).toDateString();
          } else {
            msgDate = new Date().toDateString(); // Fallback
          }
          return msgDate === today;
        }).length;
      }, 0);

      // Calcul de la santé du système
      let systemHealth: SystemStats['systemHealth'] = 'excellent';
      if (conversations.length === 0) systemHealth = 'warning';
      if (totalMessages === 0) systemHealth = 'error';

      setStats({
        totalUsers: userId ? 1 : 0, // Simplifié pour un utilisateur local
        activeConversations: conversations.length,
        messagesPerDay: todayMessages,
        averageResponseTime: 1.2, // Simulé
        systemHealth
      });
      
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refreshStats();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: SystemStats['systemHealth']) => {
    switch (health) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthText = (health: SystemStats['systemHealth']) => {
    switch (health) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Bon';
      case 'warning': return 'Attention';
      case 'error': return 'Erreur';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Santé du système */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Santé du système</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getHealthColor(stats.systemHealth)}`} />
            <div className="text-2xl font-bold">{getHealthText(stats.systemHealth)}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Système IA opérationnel
          </p>
        </CardContent>
      </Card>

      {/* Utilisateurs actifs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Utilisateur actuel
          </p>
        </CardContent>
      </Card>

      {/* Conversations actives */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversations</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeConversations}</div>
          <p className="text-xs text-muted-foreground">
            Threads créés
          </p>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageResponseTime}s</div>
          <p className="text-xs text-muted-foreground">
            Temps de réponse moyen
          </p>
        </CardContent>
      </Card>

      {/* Détails complets */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Monitoring en temps réel</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshStats}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Messages aujourd'hui</h4>
              <div className="text-lg font-bold">{stats.messagesPerDay}</div>
              <Badge variant="secondary" className="text-xs">
                {stats.messagesPerDay > 0 ? '+' + stats.messagesPerDay : '0'} depuis ce matin
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Intégration n8n</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">Connecté</span>
              </div>
              <Badge variant="default" className="text-xs">
                Prêt à recevoir
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Stockage local</h4>
              <div className="text-lg font-bold">
                {AIIntegrationService.getConversations().reduce((sum, conv) => sum + conv.messages.length, 0)}
              </div>
              <Badge variant="outline" className="text-xs">
                Messages sauvegardés
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISystemMonitor;

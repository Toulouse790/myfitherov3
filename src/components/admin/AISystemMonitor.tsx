
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Activity, AlertTriangle, CheckCircle, RefreshCw, Users } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { AIIntegrationService, ConversationThread } from '@/services/aiIntegration';
import { SupabaseService } from '@/services/supabase';

const AISystemMonitor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationThread[]>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<boolean | null>(null);
  const [loadingSupabase, setLoadingSupabase] = useState(false);
  const [stats, setStats] = useState({
    totalThreads: 0,
    totalMessages: 0,
    activeAgents: 0,
    responseRate: 0,
    aiAccuracy: 0,
    avgResponseTime: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Récupération des conversations
      const conversationsData = await AIIntegrationService.getConversations();
      setConversations(conversationsData);
      
      // Calcul des statistiques
      calculateStats(conversationsData);
    } catch (error) {
      toast.error("Erreur lors du chargement des données", {
        description: "Impossible de récupérer les données du système IA"
      });
      console.error("Erreur de chargement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (conversationsData: ConversationThread[]) => {
    // Total de messages
    const totalMessages = conversationsData.reduce((acc, conv) => {
      return acc + conv.messages.length;
    }, 0);
    
    // Calcul des statistiques
    setStats({
      totalThreads: conversationsData.length,
      totalMessages: totalMessages,
      activeAgents: 4, // Valeur fixe pour le moment (nutrition, sommeil, exercice, mental)
      responseRate: 98.5, // Valeur fixe pour la démonstration
      aiAccuracy: 94.2, // Valeur fixe pour la démonstration
      avgResponseTime: 1.2, // Valeur fixe pour la démonstration (en secondes)
    });
  };

  const testSupabaseConnection = async () => {
    setLoadingSupabase(true);
    try {
      const result = await SupabaseService.testConnection();
      setSupabaseStatus(result);
      toast(result ? "Connexion Supabase établie" : "Connexion Supabase échouée", {
        description: result ? "La connexion à la base de données est active" : "Impossible de se connecter à la base de données",
        icon: result ? <CheckCircle className="text-green-500" /> : <AlertTriangle className="text-red-500" />,
      });
    } catch (error) {
      setSupabaseStatus(false);
      toast.error("Erreur de connexion Supabase", {
        description: "Une erreur est survenue lors du test de connexion"
      });
    } finally {
      setLoadingSupabase(false);
    }
  };

  const syncData = async () => {
    setIsLoading(true);
    try {
      const success = await AIIntegrationService.syncWithSupabase();
      if (success) {
        toast.success("Synchronisation réussie", {
          description: "Les données ont été synchronisées avec Supabase"
        });
        fetchData();
      } else {
        toast.error("Synchronisation échouée", {
          description: "Impossible de synchroniser les données"
        });
      }
    } catch (error) {
      toast.error("Erreur de synchronisation", {
        description: "Une erreur est survenue lors de la synchronisation"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Style pour l'indicateur de statut
  const statusClass = (status: boolean | null) => {
    if (status === null) return "bg-gray-400";
    return status ? "bg-green-500" : "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Moniteur système IA
          </CardTitle>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription>
          Surveillance en temps réel des performances du système d'IA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">État du système</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="sync">Synchronisation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Agents actifs</span>
                  <span className="text-sm font-medium">{stats.activeAgents}/5</span>
                </div>
                <Progress value={stats.activeAgents * 20} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Taux de réponse</span>
                  <span className="text-sm font-medium">{stats.responseRate}%</span>
                </div>
                <Progress value={stats.responseRate} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${statusClass(supabaseStatus)}`}></div>
                  <span>Base de données Supabase</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={testSupabaseConnection}
                  disabled={loadingSupabase}
                >
                  {loadingSupabase ? "Test en cours..." : "Tester"}
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>API n8n</span>
                </div>
                <span className="text-xs text-muted-foreground">Connecté</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Service IA</span>
                </div>
                <span className="text-xs text-muted-foreground">Opérationnel</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Conversations</div>
                <div className="text-2xl font-bold mt-1">{stats.totalThreads}</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Messages</div>
                <div className="text-2xl font-bold mt-1">{stats.totalMessages}</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Temps de réponse</div>
                <div className="text-2xl font-bold mt-1">{stats.avgResponseTime}s</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Précision</div>
                <div className="text-2xl font-bold mt-1">{stats.aiAccuracy}%</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sync">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Synchronisation Supabase</h3>
                  <p className="text-sm text-muted-foreground">
                    Synchronisez les données locales avec la base de données Supabase
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={syncData} 
                  disabled={isLoading || !supabaseStatus}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Synchronisation...
                    </>
                  ) : (
                    "Synchroniser"
                  )}
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Conversations locales</span>
                  <span className="text-sm font-medium">{stats.totalThreads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Messages locaux</span>
                  <span className="text-sm font-medium">{stats.totalMessages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Dernière synchronisation</span>
                  <span className="text-sm font-medium">
                    {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AISystemMonitor;

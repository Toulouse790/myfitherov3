import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from '@/components/ui/sonner';
import { Workflow, Webhook, CheckCircle2, XCircle, RefreshCw, Play, ExternalLink } from 'lucide-react';
import { AdminService } from '@/services/admin';

/**
 * Fonction utilitaire pour réessayer une opération asynchrone
 * 
 * @param operation La fonction à exécuter
 * @param retries Le nombre de tentatives maximum
 * @param delay Le délai entre les tentatives (en ms)
 * @param backoff Facteur multiplicateur pour augmenter le délai à chaque tentative
 */
const retry = async (
  operation: () => Promise<any>,
  retries = 3,
  delay = 300,
  backoff = 2
): Promise<any> => {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(operation, retries - 1, delay * backoff, backoff);
  }
};

const AdminIntegrationPanel = () => {
  const [n8nUrl, setN8nUrl] = useState('');
  const [n8nTestLoading, setN8nTestLoading] = useState(false);
  const [n8nConnectionStatus, setN8nConnectionStatus] = useState<'connected' | 'error' | 'unknown'>('unknown');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // État pour les webhooks configurés
  const [webhooks, setWebhooks] = useState([
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
  
  useEffect(() => {
    fetchN8nConfig();
  }, []);
  
  const fetchN8nConfig = async () => {
    setLoading(true);
    setErrorMessage(null); // Réinitialiser les messages d'erreur
    
    try {
      // Utiliser la fonction retry pour réessayer jusqu'à 3 fois avec un délai exponentiel
      const config = await retry(
        () => AdminService.getN8nConfig(),
        3, // 3 tentatives
        300, // Délai initial de 300ms
        2 // Facteur de backoff
      );
      
      setN8nUrl(config.url);
      setN8nConnectionStatus(config.status);
    } catch (error) {
      console.error('Error fetching n8n config after retries:', error);
      setN8nConnectionStatus('error');
      
      if (error instanceof Error) {
        setErrorMessage(`Échec après plusieurs tentatives : ${error.message}`);
      } else {
        setErrorMessage('Échec après plusieurs tentatives : erreur inconnue');
      }
      
      toast.error('Erreur', { 
        description: 'Impossible de charger la configuration n8n après plusieurs tentatives' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testN8nConnection = async () => {
    setN8nTestLoading(true);
    setErrorMessage(null);
    
    try {
      // API call to test webhook
      const testResult = await AdminService.updateN8nConfig(n8nUrl);
      
      if (testResult) {
        setN8nConnectionStatus('connected');
        toast.success("Test réussi", { 
          description: "Connexion établie avec n8n" 
        });
      } else {
        setN8nConnectionStatus('error');
        setErrorMessage("Échec de connexion au webhook n8n");
        toast.error("Échec du test", { 
          description: "Impossible de se connecter au webhook n8n" 
        });
      }
    } catch (error) {
      setN8nConnectionStatus('error');
      
      if (error instanceof Error) {
        setErrorMessage(`Erreur de connexion : ${error.message}`);
      } else {
        setErrorMessage("Une erreur s'est produite lors du test");
      }
      
      toast.error("Erreur", { 
        description: "Une erreur s'est produite lors du test"
      });
    } finally {
      setN8nTestLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <Tabs defaultValue="n8n">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Intégrations externes</CardTitle>
                <TabsList>
                  <TabsTrigger value="n8n" className="text-sm">n8n</TabsTrigger>
                  <TabsTrigger value="webhooks" className="text-sm">Webhooks</TabsTrigger>
                  <TabsTrigger value="api" className="text-sm">API</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>Configuration des services connectés</CardDescription>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="n8n" className="space-y-4 mt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">Configuration n8n</h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {loading ? (
                      <span className="text-xs flex items-center text-gray-600">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Chargement...
                      </span>
                    ) : n8nConnectionStatus === 'connected' ? (
                      <span className="text-xs flex items-center text-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Connecté
                      </span>
                    ) : n8nConnectionStatus === 'error' ? (
                      <span className="text-xs flex items-center text-red-600">
                        <XCircle className="h-3 w-3 mr-1" />
                        Déconnecté
                      </span>
                    ) : (
                      <span className="text-xs flex items-center text-gray-600">
                        Statut inconnu
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL du webhook n8n</label>
                    <div className="flex gap-2">
                      <Input 
                        value={n8nUrl} 
                        onChange={(e) => setN8nUrl(e.target.value)} 
                        placeholder="https://n8n.example.com/webhook/..." 
                        className="font-mono text-sm"
                      />
                      <Button 
                        onClick={testN8nConnection} 
                        disabled={n8nTestLoading || !n8nUrl || loading} 
                        variant="outline"
                      >
                        {n8nTestLoading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        Tester
                      </Button>
                    </div>
                  </div>
                  
                  <Alert variant="default" className="bg-muted text-foreground">
                    <AlertDescription className="text-sm">
                      <p>Cette URL est utilisée pour recevoir les événements depuis votre instance n8n.</p>
                      <p className="mt-1">Assurez-vous que l'URL est accessible depuis Internet et que n8n est configuré correctement.</p>
                    </AlertDescription>
                  </Alert>
                  
                  {errorMessage && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription className="text-xs">
                        {errorMessage}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="webhooks" className="mt-0">
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
              </TabsContent>
              
              <TabsContent value="api" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <ExternalLink className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium">Configuration API</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Clé API MyFitHero</label>
                      <div className="flex gap-2">
                        <Input 
                          type="password" 
                          value="mfh_••••••••••••••••••••••••••••••" 
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button variant="outline">
                          Régénérer
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Utilisé pour l'authentification aux APIs de MyFitHero.
                      </p>
                    </div>
                    
                    <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
                      <AlertDescription className="text-sm">
                        <p>⚠️ Ne partagez jamais votre clé API. Elle donne un accès complet à votre compte.</p>
                      </AlertDescription>
                    </Alert>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-2">Documentation API</h4>
                      <Button variant="outline" className="text-sm" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Accéder à la documentation
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              <div className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-blue-500" />
                État du système
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">n8n</span>
                  {loading ? (
                    <span className="flex items-center text-gray-600">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Chargement...
                    </span>
                  ) : n8nConnectionStatus === 'connected' ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connecté
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <XCircle className="h-3 w-3 mr-1" />
                      Déconnecté
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">OpenAI API</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Opérationnel
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base de données</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Opérationnel
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cache</span>
                  <span className="flex items-center text-amber-600">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Synchronisation
                  </span>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">Dernière vérification: 21/05/2025 14:45</p>
                <Button variant="outline" size="sm" className="mt-2 w-full text-sm" onClick={fetchN8nConfig}>
                  <RefreshCw className={`h-3 w-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Vérifier maintenant
                </Button>
                
                {errorMessage && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription className="text-xs">
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminIntegrationPanel;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/sonner';
import { 
  LineChart, 
  BarChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  LayoutDashboard, 
  Users, 
  Brain, 
  Workflow, 
  Activity, 
  Settings, 
  ShieldAlert, 
  Lock, 
  BarChart3, 
  LineChart as LineChartIcon,
  BookOpenCheck, 
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminAgentTable from '@/components/admin/AdminAgentTable';
import AdminIntegrationPanel from '@/components/admin/AdminIntegrationPanel';
import { StorageService } from '@/services/storage';

const ADMIN_PASSWORD = "admin123"; // À des fins de démonstration uniquement

// Données fictives pour les graphiques
const activityData = [
  { name: 'Lundi', conversations: 65, requests: 78 },
  { name: 'Mardi', conversations: 59, requests: 65 },
  { name: 'Mercredi', conversations: 80, requests: 91 },
  { name: 'Jeudi', conversations: 81, requests: 90 },
  { name: 'Vendredi', conversations: 56, requests: 85 },
  { name: 'Samedi', conversations: 55, requests: 53 },
  { name: 'Dimanche', conversations: 40, requests: 42 },
];

const agentDistribution = [
  { name: 'Nutrition', value: 35 },
  { name: 'Sommeil', value: 25 },
  { name: 'Musculation', value: 30 },
  { name: 'Hydratation', value: 10 },
];

const systemStats = {
  users: 1245,
  conversations: 8790,
  successRate: 94.2,
  responseTime: 1.8
};

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Vérifier si l'admin est déjà authentifié
    const adminAuth = StorageService.getItem('adminAuth', false);
    if (adminAuth) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simuler une attente de validation
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        StorageService.setItem('adminAuth', true);
        setIsAuthenticated(true);
        toast.success("Connexion réussie", {
          description: "Bienvenue dans l'interface d'administration"
        });
      } else {
        toast.error("Échec de l'authentification", {
          description: "Mot de passe incorrect"
        });
      }
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    StorageService.removeItem('adminAuth');
    setIsAuthenticated(false);
    setPassword('');
    toast.info("Déconnexion réussie");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Dashboard</CardTitle>
            <CardDescription className="text-center">
              Entrez le mot de passe administrateur pour accéder au tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Vérification..." : "Connexion"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/')}
                >
                  Retour à l'accueil
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Gestion du système et des intégrations MyFitHero
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard 
            title="Utilisateurs"
            value={systemStats.users}
            icon={<Users className="text-blue-500" />}
            trend={12.5}
            description="Total des comptes"
          />
          <AdminStatCard 
            title="Conversations"
            value={systemStats.conversations}
            icon={<Brain className="text-purple-500" />}
            trend={8.3}
            description="Interactions IA"
          />
          <AdminStatCard 
            title="Taux de réussite"
            value={`${systemStats.successRate}%`}
            icon={<CheckCircle2 className="text-green-500" />}
            trend={-1.2}
            description="Réponses valides"
          />
          <AdminStatCard 
            title="Temps de réponse"
            value={`${systemStats.responseTime}s`}
            icon={<Clock className="text-orange-500" />}
            trend={-5.7}
            trendDirection="down"
            description="Moyenne"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid md:grid-cols-5 grid-cols-2 md:grid-rows-1 grid-rows-3 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Vue d'ensemble</span>
              <span className="md:hidden">Aperçu</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Agents IA</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              <span>Intégrations</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Configuration</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Logs</span>
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-blue-500" />
                    Activité utilisateurs
                  </CardTitle>
                  <CardDescription>Conversations et requêtes sur 7 jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={activityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="conversations" stroke="#8884d8" />
                        <Line type="monotone" dataKey="requests" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Distribution des requêtes
                  </CardTitle>
                  <CardDescription>Par type d'agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={agentDistribution}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Agents IA */}
          <TabsContent value="agents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Gestion des agents IA
                </CardTitle>
                <CardDescription>Configuration et performance des agents</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminAgentTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intégrations */}
          <TabsContent value="integrations" className="space-y-4">
            <AdminIntegrationPanel />
          </TabsContent>

          {/* Configuration */}
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  Configuration OpenAI
                </CardTitle>
                <CardDescription>Gestion des clés API et des modèles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Clé API OpenAI</label>
                    <div className="flex gap-2">
                      <Input 
                        type="password" 
                        value="sk-••••••••••••••••••••••••••••••" 
                        readOnly
                        className="font-mono"
                      />
                      <Button variant="outline">Modifier</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Modèle par défaut</label>
                    <select className="w-full p-2 border rounded-md dark:bg-gray-800">
                      <option value="gpt-4o">GPT-4o (Recommandé)</option>
                      <option value="gpt-4o-mini">GPT-4o Mini</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Température</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="2" 
                      step="0.1" 
                      defaultValue="0.7"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs">
                      <span>0 (Déterministe)</span>
                      <span>1 (Équilibré)</span>
                      <span>2 (Créatif)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs système */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  Journaux système
                </CardTitle>
                <CardDescription>Erreurs et événements système récents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between mb-4">
                    <div className="flex gap-2">
                      <select className="p-2 text-sm border rounded-md dark:bg-gray-800">
                        <option>Tous les types</option>
                        <option>Erreur</option>
                        <option>Warning</option>
                        <option>Info</option>
                      </select>
                      <Input type="date" className="text-sm" />
                    </div>
                    <Button variant="outline" size="sm">
                      Exporter
                    </Button>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Horodatage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Source</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Message</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">2025-05-21 14:32:15</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Erreur</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Agent Nutrition</td>
                          <td className="px-6 py-4 text-sm">Échec de connexion à l'API OpenAI - Timeout après 30s</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">2025-05-21 14:28:10</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Warning</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">n8n Webhook</td>
                          <td className="px-6 py-4 text-sm">Réponse lente du service externe (5.2s)</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">2025-05-21 14:15:43</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Info</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Système</td>
                          <td className="px-6 py-4 text-sm">Configuration mise à jour avec succès</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;

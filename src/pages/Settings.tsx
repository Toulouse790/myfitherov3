
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { ApiService } from '@/services/api';

const Settings = () => {
  // Utiliser une variable d'environnement par défaut si disponible
  const defaultWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 
    "https://n8n.srv825462.hstgr.cloud/webhook/d84d0c09-59b4-4706-9746-0a4a83ad2609";
  
  const [webhookUrl, setWebhookUrl] = useState<string>(defaultWebhookUrl);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast("Erreur", {
        description: "Veuillez saisir l'URL du webhook n8n"
      });
      return;
    }

    setIsLoading(true);
    console.log("Test de connexion au webhook n8n:", webhookUrl);

    try {
      // Utiliser notre service API pour le test
      const response = await ApiService.testWebhook(webhookUrl, {
        timestamp: new Date().toISOString(),
        triggered_from: window.location.origin,
        app: "MyFitHero",
        action: "test_connection"
      });

      // Comme nous utilisons no-cors, nous affichons un message informatif
      toast("Requête envoyée", {
        description: "La requête a été envoyée à n8n. Veuillez vérifier l'historique de votre workflow pour confirmer son déclenchement."
      });
    } catch (error) {
      console.error("Erreur lors du déclenchement du webhook:", error);
      toast("Erreur", {
        description: "Échec du déclenchement du webhook n8n. Veuillez vérifier l'URL et réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Paramètres enregistrés", {
      description: "Vos paramètres ont été enregistrés avec succès."
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos préférences et intégrations.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* N8n Webhook Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Intégration n8n</CardTitle>
              <CardDescription>Connectez MyFitHero à n8n pour automatiser vos workflows.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrigger} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">URL du Webhook</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://your-n8n-instance.com/webhook/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleTrigger} disabled={isLoading}>
                {isLoading ? "Envoi..." : "Tester la connexion"}
              </Button>
            </CardFooter>
          </Card>

          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>Personnalisez votre expérience avec MyFitHero.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="flex flex-col gap-1">
                    <span>Notifications</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Recevez des alertes pour vos entraînements et objectifs.
                    </span>
                  </Label>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                    <span>Mode sombre</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Utilisez un thème sombre pour réduire la fatigue oculaire.
                    </span>
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={darkModeEnabled}
                    onCheckedChange={setDarkModeEnabled}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings}>Enregistrer</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;

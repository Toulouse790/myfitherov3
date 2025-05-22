
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIIntegrationService } from '@/services/aiIntegration';
import { toast } from '@/components/ui/sonner';
import { Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const N8nConnectionTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<'success' | 'error' | null>(null);

  const testFullFlow = async () => {
    setTesting(true);
    setLastTestResult(null);

    try {
      // Test avec toutes les données attendues par n8n
      const testMessage = "Test de connexion système MyFitHero → n8n → Supabase";
      
      toast.info('Test en cours', {
        description: 'Envoi d\'un message de test vers n8n...'
      });

      const response = await AIIntegrationService.sendUserInteraction(
        testMessage,
        undefined, // Laisse générer un nouveau thread_id
        'general'
      );

      if (response.thread_id && response.response) {
        setLastTestResult('success');
        toast.success('Test réussi ! 🎉', {
          description: `Connexion établie. Thread ID: ${response.thread_id.slice(-8)}`,
          duration: 5000
        });
      } else {
        throw new Error('Réponse incomplète de n8n');
      }
    } catch (error) {
      setLastTestResult('error');
      toast.error('Test échoué', {
        description: error instanceof Error ? error.message : 'Erreur de connexion n8n',
        duration: 5000
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Test de connexion intégrale</span>
          {lastTestResult && (
            <Badge variant={lastTestResult === 'success' ? 'default' : 'destructive'}>
              {lastTestResult === 'success' ? 'Connecté' : 'Erreur'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <p>Ce test vérifie le flux complet :</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
            <li>Génération user_id et thread_id</li>
            <li>Structuration des données pour n8n</li>
            <li>Envoi via API vers n8n</li>
            <li>Réception de la réponse IA</li>
            <li>Sauvegarde en local</li>
          </ul>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            {lastTestResult === 'success' && <CheckCircle className="text-green-500" size={16} />}
            {lastTestResult === 'error' && <XCircle className="text-red-500" size={16} />}
            <span className="text-sm">
              {lastTestResult === 'success' && 'Système opérationnel'}
              {lastTestResult === 'error' && 'Problème de connexion'}
              {!lastTestResult && 'Prêt pour le test'}
            </span>
          </div>
          
          <Button 
            onClick={testFullFlow} 
            disabled={testing}
            size="sm"
          >
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Test en cours...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Lancer le test
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default N8nConnectionTest;

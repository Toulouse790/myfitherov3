
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Workflow, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface SystemStatusCardProps {
  n8nStatus: 'connected' | 'error' | 'unknown';
  loading: boolean;
  errorMessage: string | null;
  onRefresh: () => void;
}

const SystemStatusCard: React.FC<SystemStatusCardProps> = ({
  n8nStatus,
  loading,
  errorMessage,
  onRefresh
}) => {
  return (
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
              ) : n8nStatus === 'connected' ? (
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
            <Button variant="outline" size="sm" className="mt-2 w-full text-sm" onClick={onRefresh}>
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
  );
};

export default SystemStatusCard;


import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Workflow, RefreshCw, Play, CheckCircle2, XCircle } from 'lucide-react';

interface N8nConfigPanelProps {
  n8nUrl: string;
  setN8nUrl: (url: string) => void;
  n8nConnectionStatus: 'connected' | 'error' | 'unknown';
  n8nTestLoading: boolean;
  loading: boolean;
  errorMessage: string | null;
  testConnection: () => void;
}

const N8nConfigPanel: React.FC<N8nConfigPanelProps> = ({
  n8nUrl,
  setN8nUrl,
  n8nConnectionStatus,
  n8nTestLoading,
  loading,
  errorMessage,
  testConnection
}) => {
  return (
    <div className="space-y-4 mt-0">
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
              onClick={testConnection} 
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
    </div>
  );
};

export default N8nConfigPanel;

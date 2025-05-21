
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from 'lucide-react';

const ApiConfigPanel: React.FC = () => {
  return (
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
  );
};

export default ApiConfigPanel;

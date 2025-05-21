
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';

const AdminOpenAIConfig: React.FC = () => {
  return (
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
  );
};

export default AdminOpenAIConfig;

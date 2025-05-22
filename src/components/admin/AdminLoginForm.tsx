
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface AdminLoginFormProps {
  onLogin?: (success: boolean) => void;
}

const AdminLoginForm = ({ onLogin }: AdminLoginFormProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mot de passe admin par défaut (à changer en production)
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error('Erreur', {
        description: 'Veuillez saisir le mot de passe administrateur'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simuler une vérification (remplacer par votre logique d'auth)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (password === ADMIN_PASSWORD) {
        // Stocker l'état de connexion
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        
        toast.success('Connexion réussie', {
          description: 'Bienvenue dans le dashboard administrateur'
        });
        
        // Callback de succès
        if (onLogin) {
          onLogin(true);
        }
        
        // Redirection alternative si pas de callback
        if (!onLogin) {
          window.location.reload();
        }
      } else {
        toast.error('Accès refusé', {
          description: 'Mot de passe administrateur incorrect'
        });
      }
    } catch (error) {
      console.error('Erreur de connexion admin:', error);
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de la connexion'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
          <p className="text-muted-foreground">
            Entrez le mot de passe administrateur pour accéder au tableau de bord
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe administrateur</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Connexion'}
            </Button>
          </form>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleReturnHome}
              disabled={isLoading}
            >
              Retour à l'accueil
            </Button>
          </div>
          
          {/* Info de développement - à retirer en production */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Mode développement:</strong> Mot de passe = "admin123"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;

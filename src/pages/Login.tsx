
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, Navigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SocialLogin from '@/components/auth/SocialLogin';

const Login = () => {
  const { signIn, user, loading: authLoading, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMode, setResetMode] = useState(false);

  // Rediriger si déjà connecté
  if (user && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (resetMode) {
        await resetPassword(email);
        setResetMode(false);
        setEmail('');
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center px-4 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold mb-2">
            MyFitHero 🦸‍♂️
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">
            {resetMode ? 'Réinitialiser votre mot de passe' : 'Connectez-vous à votre compte'}
          </p>
        </CardHeader>
        
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
                  placeholder="vous@exemple.com"
                  required
                />
              </div>
            </div>

            {!resetMode && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-10 sm:h-12 text-sm sm:text-base"
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs sm:text-sm border border-red-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-12 text-sm sm:text-base"
            >
              {loading ? (
                resetMode ? 'Envoi...' : 'Connexion...'
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  {resetMode ? 'Envoyer le lien' : 'Se connecter'}
                </>
              )}
            </Button>
          </form>

          {!resetMode && <SocialLogin />}

          <div className="mt-4 sm:mt-6 text-center space-y-2">
            <Button
              variant="link"
              className="text-xs sm:text-sm text-muted-foreground p-0"
              onClick={() => setResetMode(!resetMode)}
            >
              {resetMode ? 'Retour à la connexion' : 'Mot de passe oublié ?'}
            </Button>
            
            {!resetMode && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Inscrivez-vous
                </Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

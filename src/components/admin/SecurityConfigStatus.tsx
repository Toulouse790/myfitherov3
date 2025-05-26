
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertTriangle, XCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { configValidator } from '@/services/security/ConfigValidator';

export const SecurityConfigStatus: React.FC = () => {
  const [configStatus, setConfigStatus] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    config?: any;
  }>({ isValid: false, errors: [], warnings: [] });
  
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    try {
      const config = configValidator.validateAndLoad();
      const warnings = [];

      // Vérifications additionnelles
      if (!import.meta.env.VITE_SENTRY_DSN) {
        warnings.push('Monitoring Sentry non configuré (recommandé pour la production)');
      }

      if (!import.meta.env.VITE_WEATHER_API_KEY) {
        warnings.push('API météo non configurée (fonctionnalité géolocalisation limitée)');
      }

      if (import.meta.env.VITE_DEBUG_MODE === 'true' && configValidator.isProductionMode()) {
        warnings.push('Mode debug activé en production (risque de sécurité)');
      }

      setConfigStatus({
        isValid: true,
        errors: [],
        warnings,
        config
      });
    } catch (error) {
      setConfigStatus({
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Erreur de configuration'],
        warnings: [],
        config: null
      });
    }
  };

  const maskSensitiveValue = (value: string, showFull: boolean = false): string => {
    if (showFull || !value) return value;
    if (value.length <= 8) return '••••••••';
    return value.substring(0, 4) + '••••••••' + value.substring(value.length - 4);
  };

  const getStatusIcon = (isValid: boolean, hasWarnings: boolean) => {
    if (!isValid) return <XCircle className="h-5 w-5 text-red-500" />;
    if (hasWarnings) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const getStatusBadge = (isValid: boolean, hasWarnings: boolean) => {
    if (!isValid) return <Badge variant="destructive">Erreur</Badge>;
    if (hasWarnings) return <Badge variant="secondary">Avertissements</Badge>;
    return <Badge variant="default">Conforme</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            État de la Configuration Sécurité
            {getStatusIcon(configStatus.isValid, configStatus.warnings.length > 0)}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusBadge(configStatus.isValid, configStatus.warnings.length > 0)}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSensitiveData(!showSensitiveData)}
            >
              {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showSensitiveData ? 'Masquer' : 'Afficher'} les clés
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Erreurs */}
          {configStatus.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Erreurs de configuration :</p>
                  {configStatus.errors.map((error, index) => (
                    <p key={index} className="text-sm">• {error}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Avertissements */}
          {configStatus.warnings.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Avertissements :</p>
                  {configStatus.warnings.map((warning, index) => (
                    <p key={index} className="text-sm">• {warning}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Configuration actuelle */}
          {configStatus.config && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Sécurité</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Clé de chiffrement:</span>
                    <span className="font-mono">
                      {maskSensitiveValue(configStatus.config.encryptionKey, showSensitiveData)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Secret session:</span>
                    <span className="font-mono">
                      {maskSensitiveValue(configStatus.config.sessionSecret, showSensitiveData)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode production:</span>
                    <Badge variant={configValidator.isProductionMode() ? "default" : "secondary"}>
                      {configValidator.isProductionMode() ? 'OUI' : 'NON'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Rétention RGPD</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Données biométriques:</span>
                    <span>{configStatus.config.biometricRetentionDays} jours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Géolocalisation:</span>
                    <span>{configStatus.config.locationRetentionDays} jours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email DPO:</span>
                    <span>{configStatus.config.dpoDp_email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Limites</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Taille fichier max:</span>
                    <span>{configStatus.config.maxFileSize} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Requêtes/minute:</span>
                    <span>{configStatus.config.rateLimitPerMinute}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durée session:</span>
                    <span>{Math.round(configStatus.config.sessionDuration / 60000)} min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">APIs</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>API Base:</span>
                    <span className="truncate max-w-32">{configStatus.config.apiBaseUrl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supabase:</span>
                    <Badge variant="default">✓ Configuré</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>OpenAI:</span>
                    <Badge variant={import.meta.env.VITE_OPENAI_API_KEY ? "default" : "secondary"}>
                      {import.meta.env.VITE_OPENAI_API_KEY ? '✓ Configuré' : '⚠ Manquant'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

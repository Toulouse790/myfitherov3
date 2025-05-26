
import React from 'react';
import { AlertTriangle, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ValidationResult, EmergencyAlert } from '@/ai/types/CrossDomainTypes';

interface CrossDomainSafetyPanelProps {
  validationResult: ValidationResult;
  onDismissAlert?: (alertIndex: number) => void;
}

export const CrossDomainSafetyPanel: React.FC<CrossDomainSafetyPanelProps> = ({
  validationResult,
  onDismissAlert
}) => {
  
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'emergency': return 'bg-red-600 text-white';
      case 'critical': return 'bg-red-500 text-white';
      case 'warning': return 'bg-orange-500 text-white';
      case 'caution': return 'bg-yellow-500 text-black';
      case 'safe': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'emergency':
      case 'critical':
        return <AlertTriangle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'caution':
        return <Shield className="h-5 w-5" />;
      case 'safe':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getAlertVariant = (level: EmergencyAlert['level']) => {
    switch (level) {
      case 'immediate': return 'destructive';
      case 'urgent': return 'destructive';
      case 'critical': return 'default';
      default: return 'default';
    }
  };

  if (!validationResult) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Statut de sécurité global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getRiskIcon(validationResult.finalRiskLevel)}
            Validation de sécurité croisée
          </CardTitle>
          <CardDescription>
            Analyse des interactions entre recommandations IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge className={getRiskLevelColor(validationResult.finalRiskLevel)}>
              {validationResult.finalRiskLevel.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {validationResult.isValid ? 'Recommandations validées' : 'Conflits détectés'}
            </span>
          </div>
          
          {validationResult.conflicts.length > 0 && (
            <div className="mt-3 text-sm">
              <p className="font-medium">Conflits détectés :</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {validationResult.conflicts.map((conflict, index) => (
                  <li key={index} className="text-muted-foreground">
                    <span className="capitalize">{conflict.severity}</span> : {conflict.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validationResult.overrides.length > 0 && (
            <div className="mt-3 text-sm">
              <p className="font-medium">Modifications de sécurité :</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {validationResult.overrides.map((override, index) => (
                  <li key={index} className="text-muted-foreground">
                    {override.reason} : {override.newRecommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertes d'urgence */}
      {validationResult.emergencyAlerts.map((alert, index) => (
        <Alert key={index} variant={getAlertVariant(alert.level)} className="border-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between">
            {alert.title}
            {onDismissAlert && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismissAlert(index)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            )}
          </AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{alert.message}</p>
            
            {alert.requiredActions.length > 0 && (
              <div>
                <p className="font-medium">Actions requises :</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {alert.requiredActions.map((action, actionIndex) => (
                    <li key={actionIndex}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {alert.seekMedicalAttention && (
                <Badge variant="destructive">
                  Consultation médicale recommandée
                </Badge>
              )}
              {alert.stopAllActivities && (
                <Badge variant="destructive">
                  Arrêt d'activité requis
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>
      ))}

      {/* Recommandations sécurisées */}
      {validationResult.resolvedRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommandations sécurisées</CardTitle>
            <CardDescription>
              Recommandations validées après résolution des conflits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {validationResult.resolvedRecommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="capitalize">
                      {rec.source}
                    </Badge>
                    <Badge className={getRiskLevelColor(rec.riskLevel)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm">{rec.recommendation}</p>
                  
                  {rec.contraindications.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <strong>Contre-indications :</strong> {rec.contraindications.join(', ')}
                    </div>
                  )}
                  
                  {rec.medicalAlerts.length > 0 && (
                    <div className="mt-1 text-xs text-red-600">
                      <strong>Alertes médicales :</strong> {rec.medicalAlerts.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

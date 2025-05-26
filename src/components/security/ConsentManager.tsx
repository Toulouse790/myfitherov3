
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { MapPin, Activity, Brain, Shield, Clock, AlertTriangle } from 'lucide-react';
import { ConsentManager as ConsentService, SecurityLogger } from '@/services/security';
import type { ConsentType } from '@/services/security';
import { toast } from '@/components/ui/sonner';

interface ConsentItem {
  id: ConsentType['category'];
  title: string;
  description: string;
  purpose: string;
  dataTypes: string[];
  retention: string;
  thirdParties?: string[];
  required: boolean;
  icon: React.ReactNode;
}

const CONSENT_ITEMS: ConsentItem[] = [
  {
    id: 'essential',
    title: 'Fonctionnalités Essentielles',
    description: 'Nécessaire au fonctionnement de base de l\'application',
    purpose: 'Authentification, sécurité, préférences utilisateur',
    dataTypes: ['ID utilisateur', 'Paramètres de session'],
    retention: 'Durée de la session',
    required: true,
    icon: <Shield className="h-5 w-5 text-green-600" />
  },
  {
    id: 'analytics',
    title: 'Géolocalisation',
    description: 'Accès à votre position pour les recommandations météo et activités locales',
    purpose: 'Recommandations personnalisées, données météo locales',
    dataTypes: ['Coordonnées GPS', 'Historique de localisation'],
    retention: '30 jours',
    thirdParties: ['Services météo'],
    required: false,
    icon: <MapPin className="h-5 w-5 text-blue-600" />
  },
  {
    id: 'marketing',
    title: 'Données Biométriques',
    description: 'Collecte de vos données de santé et d\'activité physique',
    purpose: 'Suivi de performance, analyses de santé, recommandations personnalisées',
    dataTypes: ['Fréquence cardiaque', 'Pas', 'Calories', 'Sommeil', 'Activité physique'],
    retention: '90 jours',
    required: false,
    icon: <Activity className="h-5 w-5 text-red-600" />
  },
  {
    id: 'ai_processing',
    title: 'Traitement par IA',
    description: 'Utilisation d\'intelligence artificielle pour analyser vos données et fournir des recommandations',
    purpose: 'Recommandations personnalisées, analyses prédictives, coaching santé',
    dataTypes: ['Données anonymisées de santé', 'Patterns d\'activité'],
    retention: 'Données anonymisées - conservation indéfinie',
    thirdParties: ['OpenAI (données anonymisées)'],
    required: false,
    icon: <Brain className="h-5 w-5 text-purple-600" />
  }
];

interface ConsentManagerUIProps {
  onConsentChange?: () => void;
  showDetailedView?: boolean;
}

export const ConsentManagerUI: React.FC<ConsentManagerUIProps> = ({
  onConsentChange,
  showDetailedView = false
}) => {
  const [consents, setConsents] = useState<ConsentType[]>([]);
  const [showDetails, setShowDetails] = useState(showDetailedView);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Charger les consentements existants
  useEffect(() => {
    const loadConsents = () => {
      const currentConsents = ConsentService.getConsents();
      setConsents(currentConsents);
      setHasLoaded(true);
    };

    loadConsents();
  }, []);

  const handleConsentChange = (category: ConsentType['category'], granted: boolean) => {
    try {
      ConsentService.updateConsent(category, granted);
      setConsents(ConsentService.getConsents());
      onConsentChange?.();
      
      SecurityLogger.info('Consent updated', { category, granted });
      
      toast.success(
        granted ? 'Consentement accordé' : 'Consentement retiré',
        { description: `Catégorie: ${category}` }
      );
    } catch (error) {
      SecurityLogger.error('Failed to update consent', error as Error, { category, granted });
      toast.error('Erreur lors de la mise à jour du consentement');
    }
  };

  const revokeAllConsents = () => {
    try {
      ConsentService.revokeAllConsents();
      setConsents(ConsentService.getConsents());
      onConsentChange?.();
      
      SecurityLogger.warn('All consents revoked');
      toast.info('Consentements révoqués', {
        description: 'Tous les consentements non-essentiels ont été retirés'
      });
    } catch (error) {
      SecurityLogger.error('Failed to revoke consents', error as Error);
      toast.error('Erreur lors de la révocation des consentements');
    }
  };

  const exportConsentData = () => {
    try {
      const report = ConsentService.getConsentReport();
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `consentements-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      SecurityLogger.info('Consent data exported');
      toast.success('Données de consentement exportées');
    } catch (error) {
      SecurityLogger.error('Failed to export consent data', error as Error);
      toast.error('Erreur lors de l\'export des données');
    }
  };

  const getConsentStatus = (category: ConsentType['category']): boolean => {
    return consents.find(c => c.category === category)?.granted || false;
  };

  const getConsentTimestamp = (category: ConsentType['category']): Date | undefined => {
    return consents.find(c => c.category === category)?.timestamp;
  };

  if (!hasLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse">Chargement des préférences...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Gestion des Consentements
          </CardTitle>
          <CardDescription>
            Conformément au RGPD, vous contrôlez l'utilisation de vos données personnelles de santé.
            Ces paramètres peuvent être modifiés à tout moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Vue simplifiée' : 'Détails complets'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportConsentData}
            >
              Exporter mes consentements
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={revokeAllConsents}
            >
              Révoquer tous les consentements
            </Button>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important :</strong> Les données de santé sont particulièrement sensibles. 
          Nous appliquons les plus hauts standards de sécurité (chiffrement AES-256, anonymisation pour l'IA).
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {CONSENT_ITEMS.map(item => {
          const isGranted = getConsentStatus(item.id);
          const timestamp = getConsentTimestamp(item.id);
          
          return (
            <Card key={item.id} className={`transition-all ${isGranted ? 'ring-2 ring-green-200' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {item.title}
                        {item.required && <Badge variant="secondary">Obligatoire</Badge>}
                        {isGranted && <Badge variant="default">Actif</Badge>}
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={isGranted}
                    onCheckedChange={(checked) => handleConsentChange(item.id, checked)}
                    disabled={item.required}
                  />
                </div>
              </CardHeader>

              {showDetails && (
                <CardContent className="pt-0 border-t bg-gray-50">
                  <div className="grid gap-3 text-sm">
                    <div>
                      <strong>Finalité :</strong> {item.purpose}
                    </div>
                    <div>
                      <strong>Types de données :</strong> {item.dataTypes.join(', ')}
                    </div>
                    <div>
                      <strong>Durée de conservation :</strong> {item.retention}
                    </div>
                    {item.thirdParties && (
                      <div>
                        <strong>Tiers destinataires :</strong> {item.thirdParties.join(', ')}
                      </div>
                    )}
                    {timestamp && (
                      <div className="text-xs text-gray-500">
                        <strong>Consentement donné le :</strong> {' '}
                        {timestamp.toLocaleString('fr-FR')}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p><strong>Vos droits RGPD :</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Droit d'accès :</strong> Demander une copie de vos données</li>
              <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> Supprimer vos données</li>
              <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format standard</li>
              <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
            </ul>
            <p className="mt-3">
              <strong>Contact DPO :</strong> dpo@myfithero.app | 
              <strong> Autorité de contrôle :</strong> CNIL (www.cnil.fr)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

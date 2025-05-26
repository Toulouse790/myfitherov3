
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, Database, Eye, Download, Trash2, Clock } from 'lucide-react';
import { ConsentManager, SecurityLogger, encryptionService } from '@/services/security';
import { toast } from '@/components/ui/sonner';

export const SecurityDashboard: React.FC = () => {
  const [dataStats, setDataStats] = useState({
    totalDataPoints: 0,
    encryptedItems: 0,
    lastBackup: null as Date | null,
    dataRetentionDays: 90
  });
  
  const [securityScore, setSecurityScore] = useState(0);

  useEffect(() => {
    calculateSecurityMetrics();
  }, []);

  const calculateSecurityMetrics = () => {
    const consents = ConsentManager.getConsents();
    const activeConsents = consents.filter(c => c.granted).length;
    const totalConsents = consents.length;
    
    // Simuler des métriques de sécurité
    const score = Math.round((activeConsents / totalConsents) * 100);
    setSecurityScore(score);
    
    setDataStats({
      totalDataPoints: 1247, // Simulation
      encryptedItems: 1247,
      lastBackup: new Date(),
      dataRetentionDays: 90
    });
  };

  const exportAllData = async () => {
    try {
      const consents = ConsentManager.getConsentReport();
      const logs = SecurityLogger.exportLogs();
      
      const allData = {
        timestamp: new Date().toISOString(),
        consents,
        securityLogs: JSON.parse(logs),
        dataStats
      };
      
      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `myfithero-data-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      SecurityLogger.info('Complete data export performed');
      toast.success('Export complet de vos données réalisé');
    } catch (error) {
      SecurityLogger.error('Failed to export all data', error as Error);
      toast.error('Erreur lors de l\'export des données');
    }
  };

  const requestAccountDeletion = () => {
    // En production, ceci déclencherait un processus de suppression RGPD
    SecurityLogger.warn('Account deletion requested');
    toast.info('Demande de suppression de compte enregistrée', {
      description: 'Un email de confirmation va vous être envoyé'
    });
  };

  const cleanSensitiveData = () => {
    try {
      encryptionService.clearSensitiveData();
      SecurityLogger.info('Sensitive data cleaned from memory');
      toast.success('Données sensibles nettoyées de la mémoire');
    } catch (error) {
      SecurityLogger.error('Failed to clean sensitive data', error as Error);
      toast.error('Erreur lors du nettoyage des données');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Tableau de Bord Sécurité
          </CardTitle>
          <CardDescription>
            Vue d'ensemble de la sécurité de vos données et de votre confidentialité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Score de Sécurité</div>
              <div className="text-2xl font-bold text-green-600">{securityScore}%</div>
              <Progress value={securityScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Données Chiffrées</div>
              <div className="text-2xl font-bold">{dataStats.encryptedItems}</div>
              <Badge variant="default" className="text-xs">AES-256</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Points de Données</div>
              <div className="text-2xl font-bold">{dataStats.totalDataPoints}</div>
              <div className="text-xs text-gray-500">Total collectées</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Rétention</div>
              <div className="text-2xl font-bold">{dataStats.dataRetentionDays}j</div>
              <div className="text-xs text-gray-500">Conformité RGPD</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5" />
              Export RGPD
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Téléchargez toutes vos données dans un format standard conforme au RGPD.
            </p>
            <Button onClick={exportAllData} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Exporter mes données
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5" />
              Nettoyage Sécurisé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Effacez les données sensibles temporairement stockées en mémoire.
            </p>
            <Button onClick={cleanSensitiveData} variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Nettoyer la mémoire
            </Button>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-red-600">
              <Trash2 className="h-5 w-5" />
              Suppression de Compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Suppression définitive et irréversible de toutes vos données.
            </p>
            <Button onClick={requestAccountDeletion} variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Demander la suppression
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Historique des Consentements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ConsentManager.getConsents().map((consent, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{consent.category}</div>
                  <div className="text-sm text-gray-500">
                    Version {consent.version} • {consent.timestamp.toLocaleString('fr-FR')}
                  </div>
                </div>
                <Badge variant={consent.granted ? "default" : "secondary"}>
                  {consent.granted ? 'Accordé' : 'Refusé'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

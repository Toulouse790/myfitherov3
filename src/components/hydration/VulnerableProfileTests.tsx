
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { hydrationMedicalValidator } from '@/features/hydratation/medical-validation';
import { AlertTriangle, CheckCircle, Users, Baby, Heart } from 'lucide-react';

export const VulnerableProfileTests = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runVulnerabilityTests = async () => {
    setIsRunning(true);
    
    try {
      console.log('🧪 Démarrage tests profils vulnérables...');
      
      const results = hydrationMedicalValidator.testVulnerablePopulations();
      setTestResults(results);
      
      console.log('✅ Tests profils vulnérables terminés');
      
    } catch (error) {
      console.error('❌ Erreur tests vulnérables:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': case 'high': case 'critical': 
        return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Tests Populations Vulnérables
        </CardTitle>
        <CardDescription>
          Validation sécurité hydratation pour seniors, enfants et grossesse
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button 
          onClick={runVulnerabilityTests}
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Tests en cours...' : 'Lancer Tests Vulnérabilité'}
        </Button>
        
        {testResults && (
          <div className="space-y-4">
            {/* Test Seniors */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Senior 75+ ans
                  </div>
                  <Badge className={getRiskBadgeColor(testResults.elderly.riskLevel)}>
                    <div className="flex items-center gap-1">
                      {getRiskIcon(testResults.elderly.riskLevel)}
                      {testResults.elderly.riskLevel.toUpperCase()}
                    </div>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <p><strong>Validation:</strong> {testResults.elderly.isValid ? '✅ Validé' : '❌ Échec'}</p>
                  <p><strong>Supervision médicale:</strong> {testResults.elderly.medicalSupervisionRequired ? '🏥 Requise' : '✅ Non nécessaire'}</p>
                </div>
                
                {testResults.elderly.warnings.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="space-y-1">
                        {testResults.elderly.warnings.map((warning: string, i: number) => (
                          <li key={i}>• {warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                {testResults.elderly.contraindications.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="space-y-1">
                        {testResults.elderly.contraindications.map((contra: string, i: number) => (
                          <li key={i}>• {contra}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
            
            {/* Test Enfants */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Baby className="h-4 w-4" />
                    Enfant 8 ans
                  </div>
                  <Badge className={getRiskBadgeColor(testResults.children.riskLevel)}>
                    <div className="flex items-center gap-1">
                      {getRiskIcon(testResults.children.riskLevel)}
                      {testResults.children.riskLevel.toUpperCase()}
                    </div>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <p><strong>Validation:</strong> {testResults.children.isValid ? '✅ Validé' : '❌ Échec'}</p>
                  <p><strong>Supervision médicale:</strong> {testResults.children.medicalSupervisionRequired ? '🏥 Requise' : '✅ Non nécessaire'}</p>
                </div>
                
                {testResults.children.warnings.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="space-y-1">
                        {testResults.children.warnings.map((warning: string, i: number) => (
                          <li key={i}>• {warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
            
            {/* Test Grossesse */}
            <Card className="border-l-4 border-l-pink-500">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    Grossesse 28 ans
                  </div>
                  <Badge className={getRiskBadgeColor(testResults.pregnancy.riskLevel)}>
                    <div className="flex items-center gap-1">
                      {getRiskIcon(testResults.pregnancy.riskLevel)}
                      {testResults.pregnancy.riskLevel.toUpperCase()}
                    </div>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <p><strong>Validation:</strong> {testResults.pregnancy.isValid ? '✅ Validé' : '❌ Échec'}</p>
                  <p><strong>Supervision médicale:</strong> {testResults.pregnancy.medicalSupervisionRequired ? '🏥 Requise' : '✅ Non nécessaire'}</p>
                </div>
                
                {testResults.pregnancy.warnings.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="space-y-1">
                        {testResults.pregnancy.warnings.map((warning: string, i: number) => (
                          <li key={i}>• {warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

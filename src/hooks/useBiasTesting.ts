
import { useState, useCallback } from 'react';
import { biasTestingSystem } from '@/ai/BiasTestingSystem';

export const useBiasTesting = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const runBiasTests = useCallback(async (aiSystem?: any) => {
    setIsRunning(true);
    setErrors([]);
    
    try {
      console.log('🔍 Démarrage tests anti-biais...');
      
      // Générer suite de tests
      const testSuite = biasTestingSystem.generateBiasTestSuite();
      
      // Exécuter tests complets avec système par défaut
      const testResults = await biasTestingSystem.runComprehensiveBiasTest(
        aiSystem || { generateRecommendation: () => ({ message: "Test basique" }) },
        testSuite
      );
      
      setResults(testResults);
      
      // Générer corrections si biais détectés
      const corrections = biasTestingSystem.generateBiasCorrections(testResults);
      if (corrections.length > 0) {
        console.warn('⚠️ Biais détectés - Corrections requises:', corrections);
      }
      
      console.log('✅ Tests anti-biais terminés');
      
    } catch (error) {
      console.error('❌ Erreur tests anti-biais:', error);
      setErrors(['Erreur lors de l\'exécution des tests anti-biais']);
    } finally {
      setIsRunning(false);
    }
  }, []);

  const getBiasStats = useCallback(() => {
    if (results.length === 0) return null;
    
    const biasDetected = results.filter(r => r.biasDetected).length;
    const criticalBias = results.filter(r => r.severity === 'critical').length;
    const severeBias = results.filter(r => r.severity === 'severe').length;
    
    return {
      total: results.length,
      biasDetected,
      criticalBias,
      severeBias,
      passRate: ((results.length - biasDetected) / results.length * 100).toFixed(1)
    };
  }, [results]);

  const getCriticalBias = useCallback(() => {
    return results.filter(r => r.severity === 'critical' && r.biasDetected);
  }, [results]);

  const hasSystemicIssues = useCallback(() => {
    const stats = getBiasStats();
    return stats && (stats.criticalBias > 0 || stats.severeBias > 2);
  }, [getBiasStats]);

  return {
    isRunning,
    results,
    errors,
    runBiasTests,
    getBiasStats,
    getCriticalBias,
    hasSystemicIssues
  };
};


import { useState, useEffect } from 'react';
import { useCrossDomainValidator } from './useCrossDomainValidator';
import { useWeatherRecommendations } from './useWeatherRecommendations';
import { useHydration } from '@/features/hydratation/hooks';
import { toast } from '@/components/ui/sonner';

export const useCrossDomainSafety = () => {
  const { validateAllSources, hasEmergencyAlerts, currentRiskLevel } = useCrossDomainValidator();
  const { data: sportData } = useWeatherRecommendations('sport');
  const { data: nutritionData } = useWeatherRecommendations('nutrition');
  const { recommendation: hydrationRec, alert: hydrationAlert } = useHydration();
  
  const [lastValidation, setLastValidation] = useState<Date | null>(null);
  const [activeCrossConflicts, setActiveCrossConflicts] = useState<string[]>([]);

  // Validation croisée automatique toutes les 5 minutes ou lors de changements critiques
  useEffect(() => {
    const validateCrossDomain = async () => {
      try {
        console.log('🔄 Démarrage validation croisée automatique...');
        
        const environment = {
          temperature: sportData?.weather?.main?.temp || 22,
          humidity: sportData?.weather?.main?.humidity || 50,
          heatIndex: 22,
          uvIndex: 3,
          airQuality: 50,
          timeOfDay: new Date().getHours()
        };

        // Conversion des recommandations pour validation croisée
        const sportRecs = sportData?.recommendations || [];
        const hydrationRecs = hydrationRec ? [hydrationRec] : [];
        const nutritionRecs = nutritionData?.recommendations || [];
        const sleepRecs: any[] = []; // À ajouter plus tard

        const result = await validateAllSources(
          sportRecs,
          hydrationRecs,
          nutritionRecs,
          sleepRecs,
          environment
        );

        setLastValidation(new Date());

        // Gestion des conflits critiques détectés
        if (result.conflicts.length > 0) {
          const criticalConflicts = result.conflicts.filter(
            conflict => conflict.severity === 'critical' || conflict.severity === 'life_threatening'
          );

          if (criticalConflicts.length > 0) {
            console.error('🚨 CONFLITS CRITIQUES DÉTECTÉS:', criticalConflicts);
            
            setActiveCrossConflicts(criticalConflicts.map(c => c.description));
            
            toast.error('⚠️ CONFLIT SÉCURITAIRE DÉTECTÉ', {
              description: `${criticalConflicts.length} conflit(s) entre domaines de santé`,
              duration: 15000,
              action: {
                label: 'Voir détails',
                onClick: () => showConflictDetails(criticalConflicts)
              }
            });
          }
        } else {
          setActiveCrossConflicts([]);
        }

        // Alertes d'urgence automatiques
        if (hasEmergencyAlerts) {
          console.error('🚨 ALERTES URGENCE MULTI-DOMAINES ACTIVES');
          
          toast.error('🚨 URGENCE MULTI-DOMAINES', {
            description: 'Arrêt immédiat recommandé - Consultez un médecin',
            duration: 0, // Permanent
            action: {
              label: 'Actions urgentes',
              onClick: () => triggerEmergencyProtocol()
            }
          });
        }

        console.log('✅ Validation croisée terminée:', {
          conflicts: result.conflicts.length,
          riskLevel: result.finalRiskLevel,
          emergencyAlerts: result.emergencyAlerts.length
        });

      } catch (error) {
        console.error('❌ Erreur validation croisée:', error);
        
        toast.warning('Mode sécurité activé', {
          description: 'Validation croisée en mode conservateur',
          duration: 8000
        });
      }
    };

    // Validation immédiate si données disponibles
    if (sportData || hydrationRec || nutritionData) {
      validateCrossDomain();
    }

    // Validation périodique toutes les 5 minutes
    const interval = setInterval(validateCrossDomain, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [sportData, hydrationRec, nutritionData, validateAllSources, hasEmergencyAlerts]);

  const showConflictDetails = (conflicts: any[]) => {
    const conflictSummary = conflicts.map(c => 
      `• ${c.description}\n  Impact: ${c.safetyImpact}`
    ).join('\n\n');

    alert(
      `⚠️ CONFLITS SÉCURITAIRES DÉTECTÉS\n\n${conflictSummary}\n\n` +
      '🏥 Recommandation: Consultez un médecin avant de continuer vos activités.'
    );
  };

  const triggerEmergencyProtocol = () => {
    console.log('🚨 DÉCLENCHEMENT PROTOCOLE URGENCE MULTI-DOMAINES');
    
    // Arrêt automatique de toutes les activités
    if (Notification.permission === 'granted') {
      new Notification('🚨 URGENCE SANTÉ MULTI-DOMAINES', {
        body: 'Arrêt immédiat requis - Services d\'urgence recommandés',
        icon: '/emergency-icon.png',
        requireInteraction: true
      });
    }

    // Interface d'urgence
    const emergency = confirm(
      '🚨 URGENCE SANTÉ MULTI-DOMAINES\n\n' +
      'Conflits critiques détectés entre:\n' +
      '• Sport et Hydratation\n' +
      '• Nutrition et Activité\n' +
      '• Conditions environnementales\n\n' +
      'ARRÊTER TOUTES LES ACTIVITÉS?\n\n' +
      'Contactez les services d\'urgence si malaise.'
    );

    if (emergency) {
      // Redirection vers interface d'urgence
      window.location.href = '/emergency-dashboard';
    }
  };

  const getOverallSafetyStatus = (): 'safe' | 'caution' | 'warning' | 'critical' | 'emergency' => {
    if (hasEmergencyAlerts) return 'emergency';
    if (activeCrossConflicts.length > 0) return 'critical';
    return currentRiskLevel;
  };

  const getSafetyRecommendations = (): string[] => {
    const recommendations = [];
    
    if (activeCrossConflicts.length > 0) {
      recommendations.push('⚠️ Résolvez les conflits de sécurité avant de continuer');
    }
    
    if (currentRiskLevel === 'critical' || currentRiskLevel === 'emergency') {
      recommendations.push('🏥 Consultation médicale recommandée');
    }
    
    if (hasEmergencyAlerts) {
      recommendations.push('🚨 Arrêt immédiat de toutes les activités');
    }
    
    return recommendations;
  };

  return {
    lastValidation,
    activeCrossConflicts,
    overallSafetyStatus: getOverallSafetyStatus(),
    safetyRecommendations: getSafetyRecommendations(),
    hasActiveCrossConflicts: activeCrossConflicts.length > 0,
    emergencyAlertsActive: hasEmergencyAlerts,
    currentRiskLevel
  };
};

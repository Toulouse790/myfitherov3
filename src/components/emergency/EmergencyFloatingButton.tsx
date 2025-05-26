
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Droplet, Heart, Utensils, Moon } from 'lucide-react';
import { useHydration } from '@/features/hydratation/hooks';
import { EmergencyHydrationModal } from './EmergencyHydrationModal';
import { toast } from '@/components/ui/sonner';

interface EmergencyState {
  hydration: 'safe' | 'warning' | 'critical' | 'emergency';
  sport: 'safe' | 'warning' | 'critical' | 'emergency';
  nutrition: 'safe' | 'warning' | 'critical' | 'emergency';
  sleep: 'safe' | 'warning' | 'critical' | 'emergency';
}

const CRITICAL_THRESHOLDS = {
  hydration: {
    percentage: 30, // <30% objectif quotidien
    temperature: 25, // >25°C
    lastIntake: 120, // >2h sans boire (minutes)
    criticalHours: [11, 12, 13, 14, 15, 16] // 11h-16h pic chaleur
  }
};

export const EmergencyFloatingButton = () => {
  const { stats, recommendation, weatherData } = useHydration();
  const [emergencyState, setEmergencyState] = useState<EmergencyState>({
    hydration: 'safe',
    sport: 'safe', 
    nutrition: 'safe',
    sleep: 'safe'
  });
  const [showHydrationModal, setShowHydrationModal] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Calcul état urgence hydratation
  useEffect(() => {
    if (!stats || !weatherData) return;

    const currentHour = new Date().getHours();
    const hydrationPercentage = (stats.dailyIntake / stats.dailyTarget) * 100;
    const temperature = weatherData.main.temp;
    
    let hydrationLevel: EmergencyState['hydration'] = 'safe';

    // Analyse multi-critères
    const criticalFactors = [];
    
    if (hydrationPercentage < CRITICAL_THRESHOLDS.hydration.percentage) {
      criticalFactors.push('low_intake');
    }
    
    if (temperature > CRITICAL_THRESHOLDS.hydration.temperature) {
      criticalFactors.push('high_temp');
    }
    
    if (CRITICAL_THRESHOLDS.hydration.criticalHours.includes(currentHour)) {
      criticalFactors.push('critical_time');
    }

    // Détermination niveau d'urgence
    if (criticalFactors.length >= 3) {
      hydrationLevel = 'emergency';
    } else if (criticalFactors.length >= 2) {
      hydrationLevel = 'critical';
    } else if (criticalFactors.length >= 1) {
      hydrationLevel = 'warning';
    }

    // Alerte AI Expert intégrée
    if (recommendation?.alertLevel === 'emergency' || recommendation?.alertLevel === 'critical') {
      hydrationLevel = recommendation.alertLevel;
    }

    setEmergencyState(prev => ({ ...prev, hydration: hydrationLevel }));

    // Animation critique
    setIsBlinking(hydrationLevel === 'emergency' || hydrationLevel === 'critical');

    // Toast automatique si critique
    if (hydrationLevel === 'emergency') {
      toast.error('🚨 HYDRATATION CRITIQUE', {
        description: `${temperature}°C - Buvez ${500}ml immédiatement`,
        duration: 0, // Permanent
        action: {
          label: 'Action urgente',
          onClick: () => setShowHydrationModal(true)
        }
      });
    }

  }, [stats, weatherData, recommendation]);

  const getButtonColor = () => {
    const maxLevel = Math.max(
      ['emergency', 'critical', 'warning', 'safe'].indexOf(emergencyState.hydration),
      ['emergency', 'critical', 'warning', 'safe'].indexOf(emergencyState.sport),
      ['emergency', 'critical', 'warning', 'safe'].indexOf(emergencyState.nutrition),
      ['emergency', 'critical', 'warning', 'safe'].indexOf(emergencyState.sleep)
    );

    switch (maxLevel) {
      case 0: return 'bg-red-600 hover:bg-red-700 border-red-400'; // emergency
      case 1: return 'bg-red-500 hover:bg-red-600 border-red-300'; // critical  
      case 2: return 'bg-amber-500 hover:bg-amber-600 border-amber-300'; // warning
      default: return 'bg-blue-500 hover:bg-blue-600 border-blue-300'; // safe
    }
  };

  const getIcon = () => {
    if (emergencyState.hydration !== 'safe') return <Droplet className="h-6 w-6" />;
    if (emergencyState.sport !== 'safe') return <Heart className="h-6 w-6" />;
    if (emergencyState.nutrition !== 'safe') return <Utensils className="h-6 w-6" />;
    if (emergencyState.sleep !== 'safe') return <Moon className="h-6 w-6" />;
    return <AlertTriangle className="h-6 w-6" />;
  };

  const handleEmergencyClick = () => {
    // Priorisation hydratation (plus critique)
    if (emergencyState.hydration !== 'safe') {
      setShowHydrationModal(true);
      return;
    }
    
    // TODO: Autres modales urgence (sport, nutrition, sommeil)
    console.log('🚨 Mode urgence:', emergencyState);
  };

  const hasEmergency = Object.values(emergencyState).some(state => state !== 'safe');

  if (!hasEmergency) return null;

  return (
    <>
      <Button
        onClick={handleEmergencyClick}
        className={`fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-xl border-2 ${getButtonColor()} ${
          isBlinking ? 'animate-pulse' : ''
        }`}
        size="icon"
      >
        {getIcon()}
      </Button>

      {showHydrationModal && (
        <EmergencyHydrationModal 
          onClose={() => setShowHydrationModal(false)}
          emergencyLevel={emergencyState.hydration}
        />
      )}
    </>
  );
};

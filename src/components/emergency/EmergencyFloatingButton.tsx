
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Droplet, Heart, Utensils, Moon } from 'lucide-react';
import { useHydration } from '@/features/hydratation/hooks';
import { EmergencyHydrationModal } from './EmergencyHydrationModal';
import { EmergencySportModal } from './EmergencySportModal';
import { EmergencyNutritionModal } from './EmergencyNutritionModal';
import { EmergencySleepModal } from './EmergencySleepModal';
import { toast } from '@/components/ui/sonner';

interface EmergencyState {
  hydration: 'safe' | 'warning' | 'critical' | 'emergency';
  sport: 'safe' | 'warning' | 'critical' | 'emergency';
  nutrition: 'safe' | 'warning' | 'critical' | 'emergency';
  sleep: 'safe' | 'warning' | 'critical' | 'emergency';
}

// Seuils critiques centralisés
const CRITICAL_THRESHOLDS = {
  hydration: {
    percentage: 30,
    temperature: 25,
    lastIntake: 120,
    criticalHours: [11, 12, 13, 14, 15, 16]
  },
  sport: {
    fcMaxCritique: 0.90,
    dureeMaxEffort: 150,
    temperatureArret: 35
  },
  nutrition: {
    glycemieMin: 70,
    jeuneMax: 16
  },
  sleep: {
    dureeMin: 4,
    reveilsMax: 6,
    nuitsCourtesConsecutives: 3
  }
};

// Fonction de détection des urgences
const detecterUrgences = (donneesSante: any): EmergencyState => {
  const urgences: EmergencyState = {
    hydration: 'safe',
    sport: 'safe', 
    nutrition: 'safe',
    sleep: 'safe'
  };

  // Détection hydratation (existant)
  if (donneesSante?.hydratation_pourcentage < CRITICAL_THRESHOLDS.hydration.percentage &&
      donneesSante?.temperature > CRITICAL_THRESHOLDS.hydration.temperature) {
    urgences.hydration = 'critical';
  }

  // Détection sport
  if (donneesSante?.fc_actuelle > (donneesSante?.fc_max * CRITICAL_THRESHOLDS.sport.fcMaxCritique)) {
    urgences.sport = 'emergency';
  }

  // Détection nutrition
  if (donneesSante?.glycemie_estimee < CRITICAL_THRESHOLDS.nutrition.glycemieMin) {
    urgences.nutrition = 'critical';
  }

  // Détection sommeil
  if (donneesSante?.heures_sommeil < CRITICAL_THRESHOLDS.sleep.dureeMin) {
    urgences.sleep = 'critical';
  }

  return urgences;
};

export const EmergencyFloatingButton = () => {
  const { stats, recommendation, weatherData } = useHydration();
  const [emergencyState, setEmergencyState] = useState<EmergencyState>({
    hydration: 'safe',
    sport: 'safe', 
    nutrition: 'safe',
    sleep: 'safe'
  });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);

  // Simulation données santé (à remplacer par vraies données)
  const donneesSante = {
    hydratation_pourcentage: stats ? (stats.dailyIntake / stats.dailyTarget) * 100 : 50,
    temperature: weatherData?.main.temp || 20,
    fc_actuelle: 165, // À connecter avec capteur cardiaque
    fc_max: 180,
    glycemie_estimee: 75, // À connecter avec CGM ou estimation
    heures_sommeil: 3.5 // À connecter avec données sommeil
  };

  // Calcul état urgence multidomaine
  useEffect(() => {
    const nouvellesUrgences = detecterUrgences(donneesSante);
    setEmergencyState(nouvellesUrgences);

    // Animation critique pour n'importe quel domaine
    const hasCritical = Object.values(nouvellesUrgences).some(state => 
      state === 'emergency' || state === 'critical'
    );
    setIsBlinking(hasCritical);

    // Alerte automatique priorité (hydratation > sport > nutrition > sommeil)
    if (nouvellesUrgences.hydration === 'emergency') {
      setActiveModal('hydration');
      toast.error('🚨 HYDRATATION CRITIQUE', {
        description: `${donneesSante.temperature}°C - Action immédiate requise`,
        duration: 0
      });
    } else if (nouvellesUrgences.sport === 'emergency') {
      setActiveModal('sport');
      toast.error('🚨 ARRÊT SPORT IMMÉDIAT', {
        description: `FC critique: ${donneesSante.fc_actuelle}bpm`,
        duration: 0
      });
    }

  }, [stats, weatherData, recommendation, donneesSante]);

  const getButtonColor = () => {
    const levels = ['safe', 'warning', 'critical', 'emergency'];
    const maxLevel = Math.max(
      levels.indexOf(emergencyState.hydration),
      levels.indexOf(emergencyState.sport),
      levels.indexOf(emergencyState.nutrition),
      levels.indexOf(emergencyState.sleep)
    );

    switch (maxLevel) {
      case 3: return 'bg-red-600 hover:bg-red-700 border-red-400'; // emergency
      case 2: return 'bg-red-500 hover:bg-red-600 border-red-300'; // critical  
      case 1: return 'bg-amber-500 hover:bg-amber-600 border-amber-300'; // warning
      default: return 'bg-blue-500 hover:bg-blue-600 border-blue-300'; // safe
    }
  };

  const getIcon = () => {
    // Priorité des icônes selon criticité
    if (emergencyState.hydration !== 'safe') return <Droplet className="h-6 w-6" />;
    if (emergencyState.sport !== 'safe') return <Heart className="h-6 w-6" />;
    if (emergencyState.nutrition !== 'safe') return <Utensils className="h-6 w-6" />;
    if (emergencyState.sleep !== 'safe') return <Moon className="h-6 w-6" />;
    return <AlertTriangle className="h-6 w-6" />;
  };

  const handleEmergencyClick = () => {
    // Priorisation selon criticité
    if (emergencyState.hydration !== 'safe') {
      setActiveModal('hydration');
      return;
    }
    if (emergencyState.sport !== 'safe') {
      setActiveModal('sport');
      return;
    }
    if (emergencyState.nutrition !== 'safe') {
      setActiveModal('nutrition');
      return;
    }
    if (emergencyState.sleep !== 'safe') {
      setActiveModal('sleep');
      return;
    }
    
    console.log('🚨 Mode urgence général:', emergencyState);
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

      {/* Modales d'urgence */}
      {activeModal === 'hydration' && (
        <EmergencyHydrationModal 
          onClose={() => setActiveModal(null)}
          emergencyLevel={emergencyState.hydration}
        />
      )}

      {activeModal === 'sport' && (
        <EmergencySportModal 
          onClose={() => setActiveModal(null)}
          emergencyLevel={emergencyState.sport}
          heartRate={donneesSante.fc_actuelle}
          maxHeartRate={donneesSante.fc_max}
        />
      )}

      {activeModal === 'nutrition' && (
        <EmergencyNutritionModal 
          onClose={() => setActiveModal(null)}
          emergencyLevel={emergencyState.nutrition}
          emergencyType={donneesSante.glycemie_estimee < 70 ? 'hypoglycemie' : 'general'}
        />
      )}

      {activeModal === 'sleep' && (
        <EmergencySleepModal 
          onClose={() => setActiveModal(null)}
          emergencyLevel={emergencyState.sleep}
          heuresSommeil={donneesSante.heures_sommeil}
        />
      )}
    </>
  );
};

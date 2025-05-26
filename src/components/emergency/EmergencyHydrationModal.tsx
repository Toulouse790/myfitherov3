
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Droplet, MapPin, Phone, CheckCircle } from 'lucide-react';
import { useHydration } from '@/features/hydratation/hooks';
import { toast } from '@/components/ui/sonner';

interface EmergencyHydrationModalProps {
  onClose: () => void;
  emergencyLevel: 'safe' | 'warning' | 'critical' | 'emergency';
}

export const EmergencyHydrationModal = ({ onClose, emergencyLevel }: EmergencyHydrationModalProps) => {
  const { stats, recommendation, addHydration, weatherData } = useHydration();
  const [recoveryTimer, setRecoveryTimer] = useState<number | null>(null);
  const [actionTaken, setActionTaken] = useState(false);

  // Timer récupération après action
  useEffect(() => {
    if (recoveryTimer && recoveryTimer > 0) {
      const interval = setInterval(() => {
        setRecoveryTimer(prev => prev ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [recoveryTimer]);

  const handleQuickHydration = async (amount: number) => {
    const success = await addHydration(amount);
    if (success) {
      setActionTaken(true);
      setRecoveryTimer(300); // 5 minutes de récupération
      toast.success(`${amount}ml ajoutés - Récupération en cours`);
    }
  };

  const handleMedicalHelp = () => {
    // TODO: Intégration système d'urgence
    toast.error('Assistance médicale contactée', {
      description: 'Restez en sécurité, l\'aide arrive',
      duration: 0
    });
  };

  const getEmergencyMessage = () => {
    const temp = weatherData?.main.temp || 25;
    
    switch (emergencyLevel) {
      case 'emergency':
        return {
          title: '🚨 URGENCE HYDRATATION',
          message: `Risque déshydratation sévère par ${temp}°C`,
          action: 'BUVEZ IMMÉDIATEMENT',
          bgColor: 'bg-red-600'
        };
      case 'critical':
        return {
          title: '⚠️ HYDRATATION CRITIQUE', 
          message: `Déficit hydrique dangereux - ${temp}°C`,
          action: 'Hydratation prioritaire',
          bgColor: 'bg-red-500'
        };
      case 'warning':
        return {
          title: '💧 ALERTE HYDRATATION',
          message: `Surveillance requise - ${temp}°C`,
          action: 'Augmentez votre hydratation',
          bgColor: 'bg-amber-500'
        };
      default:
        return {
          title: '💧 Hydratation',
          message: 'Statut normal',
          action: 'Continuez ainsi',
          bgColor: 'bg-blue-500'
        };
    }
  };

  const emergency = getEmergencyMessage();
  const hydrationPercentage = Math.min(100, (stats.dailyIntake / stats.dailyTarget) * 100);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${emergency.bgColor} text-white border-none`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-6 w-6" />
            {emergency.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message d'urgence */}
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">{emergency.message}</p>
            <p className="text-sm opacity-90">{emergency.action}</p>
          </div>

          {/* Progression hydratation */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Hydratation actuelle</span>
              <span>{stats.dailyIntake} / {stats.dailyTarget} ml</span>
            </div>
            <Progress value={hydrationPercentage} className="h-3 bg-white/20" />
          </div>

          {/* Timer récupération */}
          {recoveryTimer && recoveryTimer > 0 && (
            <div className="text-center bg-white/10 rounded-lg p-3">
              <p className="text-sm">Récupération en cours</p>
              <p className="text-2xl font-mono">
                {Math.floor(recoveryTimer / 60)}:{(recoveryTimer % 60).toString().padStart(2, '0')}
              </p>
            </div>
          )}

          {/* Actions rapides */}
          {!actionTaken ? (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleQuickHydration(250)}
                variant="secondary"
                className="h-12 text-black hover:bg-white/90"
              >
                <Droplet className="h-4 w-4 mr-1" />
                +250ml
              </Button>
              <Button 
                onClick={() => handleQuickHydration(500)}
                variant="secondary" 
                className="h-12 text-black hover:bg-white/90"
              >
                <Droplet className="h-4 w-4 mr-1" />
                +500ml
              </Button>
            </div>
          ) : (
            <div className="text-center bg-green-500/20 rounded-lg p-3">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Action prise !</p>
              <p className="text-sm opacity-90">Continuez à vous hydrater régulièrement</p>
            </div>
          )}

          {/* Actions d'urgence */}
          {emergencyLevel === 'emergency' && (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleMedicalHelp}
                variant="destructive"
                className="h-12 bg-red-700 hover:bg-red-800"
              >
                <Phone className="h-4 w-4 mr-1" />
                Urgences
              </Button>
              <Button 
                onClick={() => {
                  // TODO: Géolocalisation points d'eau
                  toast.info('Recherche points d\'eau à proximité...');
                }}
                variant="secondary"
                className="h-12 text-black hover:bg-white/90"
              >
                <MapPin className="h-4 w-4 mr-1" />
                Points d'eau
              </Button>
            </div>
          )}

          {/* Recommandations AI */}
          {recommendation && recommendation.recommendations.length > 0 && (
            <div className="bg-white/10 rounded-lg p-3 text-sm">
              <p className="font-medium mb-2">Recommandations :</p>
              <ul className="space-y-1">
                {recommendation.recommendations.slice(0, 2).map((rec, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="shrink-0">•</span>
                    <span className="opacity-90">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fermeture sécurisée */}
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full bg-white/10 border-white/20 hover:bg-white/20"
            disabled={emergencyLevel === 'emergency' && !actionTaken}
          >
            {emergencyLevel === 'emergency' && !actionTaken 
              ? 'Hydratez-vous d\'abord' 
              : 'Fermer'
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

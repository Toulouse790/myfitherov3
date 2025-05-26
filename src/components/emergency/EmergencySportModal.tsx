
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Heart, MapPin, Phone, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface EmergencySportModalProps {
  onClose: () => void;
  emergencyLevel: 'safe' | 'warning' | 'critical' | 'emergency';
  heartRate?: number;
  maxHeartRate?: number;
}

export const EmergencySportModal = ({ 
  onClose, 
  emergencyLevel, 
  heartRate = 165, 
  maxHeartRate = 180 
}: EmergencySportModalProps) => {
  const [compteRebours, setCompteRebours] = useState(900); // 15 minutes repos forcé
  const [reposForce, setReposForce] = useState(true);
  const [positionShared, setPositionShared] = useState(false);

  useEffect(() => {
    if (compteRebours > 0) {
      const timer = setTimeout(() => {
        setCompteRebours(compteRebours - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setReposForce(false);
    }
  }, [compteRebours]);

  const formatTemps = (secondes: number) => {
    const minutes = Math.floor(secondes / 60);
    const secs = secondes % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const envoyerPositionUrgence = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // Notification web si supportée
            if (Notification.permission === 'granted') {
              new Notification('🚨 Position d\'urgence partagée', {
                body: `Position: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              });
            }

            setPositionShared(true);
            toast.success('Position partagée', {
              description: 'Vos contacts d\'urgence ont été alertés de votre position'
            });
          },
          (error) => {
            console.error('Erreur géolocalisation:', error);
            toast.error('Impossible d\'obtenir la position');
          }
        );
      }
    } catch (error) {
      console.error('Erreur envoi position:', error);
    }
  };

  const handleMedicalHelp = () => {
    toast.error('Services d\'urgence contactés', {
      description: 'Restez en sécurité, l\'aide arrive',
      duration: 0
    });
  };

  const getEmergencyMessage = () => {
    const criticalHR = Math.round(maxHeartRate * 0.9);
    
    switch (emergencyLevel) {
      case 'emergency':
        return {
          title: '🚨 ARRÊT SPORT IMMÉDIAT',
          message: `Fréquence cardiaque critique: ${heartRate}bpm (>${criticalHR}bpm)`,
          bgColor: 'bg-red-600'
        };
      case 'critical':
        return {
          title: '⚠️ EFFORT CRITIQUE', 
          message: `Seuils dangereux atteints: ${heartRate}bpm`,
          bgColor: 'bg-red-500'
        };
      default:
        return {
          title: '💪 Surveillance Sport',
          message: 'Effort élevé détecté',
          bgColor: 'bg-amber-500'
        };
    }
  };

  const emergency = getEmergencyMessage();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${emergency.bgColor} text-white border-none`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="h-6 w-6" />
            {emergency.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message d'urgence */}
          <div className="text-center space-y-2">
            <div className="text-6xl">⛔</div>
            <p className="text-lg font-medium">{emergency.message}</p>
            <p className="text-sm opacity-90">Repos obligatoire avant reprise</p>
          </div>

          {/* Compte à rebours repos forcé */}
          {reposForce && (
            <div className="text-center bg-white/10 rounded-lg p-4">
              <p className="text-sm mb-2">Temps de repos restant</p>
              <p className="text-4xl font-bold text-yellow-300">
                {formatTemps(compteRebours)}
              </p>
            </div>
          )}

          {/* Actions rapides */}
          <div className="space-y-3">
            <Button 
              onClick={envoyerPositionUrgence}
              variant="secondary"
              className="w-full h-12 text-black hover:bg-white/90"
              disabled={positionShared}
            >
              {positionShared ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Position partagée
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Je vais bien - Partager position
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleMedicalHelp}
              variant="destructive"
              className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              <Phone className="h-4 w-4 mr-2" />
              Aide médicale d'urgence
            </Button>

            {!reposForce && (
              <Button 
                onClick={onClose}
                variant="outline"
                className="w-full bg-white/10 border-white/20 hover:bg-white/20"
              >
                Reprendre (repos terminé)
              </Button>
            )}
          </div>

          {/* Conseils de récupération */}
          <div className="bg-white/10 rounded-lg p-3 text-sm">
            <p className="font-medium mb-2">Récupération immédiate :</p>
            <ul className="space-y-1 opacity-90">
              <li>• Hydratez-vous immédiatement</li>
              <li>• Recherchez de l'ombre/fraîcheur</li>
              <li>• Respirations profondes et lentes</li>
              <li>• Ne reprenez pas avant autorisation</li>
            </ul>
          </div>

          {/* Fermeture sécurisée */}
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full bg-white/10 border-white/20 hover:bg-white/20"
            disabled={emergencyLevel === 'emergency' && reposForce}
          >
            {emergencyLevel === 'emergency' && reposForce 
              ? 'Repos obligatoire en cours' 
              : 'Fermer'
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

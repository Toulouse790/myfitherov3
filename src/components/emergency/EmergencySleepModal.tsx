
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Moon, Car, Clock, Phone } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface EmergencySleepModalProps {
  onClose: () => void;
  emergencyLevel: 'safe' | 'warning' | 'critical' | 'emergency';
  heuresSommeil: number;
}

export const EmergencySleepModal = ({ 
  onClose, 
  emergencyLevel, 
  heuresSommeil 
}: EmergencySleepModalProps) => {
  const [transportAlternatif, setTransportAlternatif] = useState(false);
  const [siesteActivee, setSiesteActivee] = useState(false);
  const [siesteTimer, setSiesteTimer] = useState(0);

  const calculerSiesteOptimale = () => {
    const deficit = 8 - heuresSommeil;
    return deficit > 4 ? 90 : 20; // Sieste longue si gros déficit
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (siesteActivee && siesteTimer > 0) {
      timer = setTimeout(() => {
        setSiesteTimer(siesteTimer - 1);
      }, 1000);
    } else if (siesteActivee && siesteTimer === 0) {
      // Fin de sieste
      setSiesteActivee(false);
      toast.success('😴 Fin de sieste', {
        description: `Votre sieste de ${calculerSiesteOptimale()} minutes est terminée`,
        action: {
          label: 'Je me sens mieux',
          onClick: () => onClose()
        }
      });
    }
    return () => clearTimeout(timer);
  }, [siesteActivee, siesteTimer, heuresSommeil, onClose]);

  const activerSieste = () => {
    const duree = calculerSiesteOptimale();
    setSiesteActivee(true);
    setSiesteTimer(duree * 60); // Convertir en secondes
    
    toast.info(`😴 Sieste de ${duree} minutes activée`, {
      description: 'Mode silencieux et réveil automatique',
      duration: 5000
    });
  };

  const demanderTransport = () => {
    setTransportAlternatif(true);
    
    const options = [
      { nom: 'Uber', url: 'https://m.uber.com' },
      { nom: 'Bolt', url: 'https://bolt.eu' },
      { nom: 'Transports publics', url: 'https://citymapper.com' }
    ];

    toast.info('Transport alternatif', {
      description: 'Applications de transport recommandées',
      action: {
        label: 'Ouvrir Uber',
        onClick: () => window.open(options[0].url, '_blank')
      },
      duration: 10000
    });
  };

  const formatSiesteTimer = (secondes: number) => {
    const minutes = Math.floor(secondes / 60);
    const secs = secondes % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmergencyMessage = () => {
    switch (emergencyLevel) {
      case 'emergency':
        return {
          title: '😴 PRIVATION SOMMEIL CRITIQUE',
          message: `Seulement ${heuresSommeil}h de sommeil`,
          bgColor: 'bg-indigo-600'
        };
      case 'critical':
        return {
          title: '⚠️ FATIGUE DANGEREUSE',
          message: `Déficit de sommeil: ${heuresSommeil}h`,
          bgColor: 'bg-indigo-500'
        };
      default:
        return {
          title: '💤 ALERTE SOMMEIL',
          message: 'Vigilance réduite détectée',
          bgColor: 'bg-indigo-400'
        };
    }
  };

  const emergency = getEmergencyMessage();
  const risqueAccident = heuresSommeil < 5 ? 4 : heuresSommeil < 6 ? 2 : 1.5;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${emergency.bgColor} text-white border-none`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Moon className="h-6 w-6" />
            {emergency.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message d'urgence */}
          <div className="text-center space-y-2">
            <div className="text-6xl">😴</div>
            <p className="text-lg font-medium">{emergency.message}</p>
          </div>

          {/* Alerte conduite */}
          <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="font-bold text-red-200 mb-1">CONDUITE DANGEREUSE</p>
            <p className="text-sm opacity-90">
              Risque d'accident x{risqueAccident}
            </p>
          </div>

          {/* Timer sieste si activée */}
          {siesteActivee && (
            <div className="bg-blue-500/20 rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm mb-1">Sieste en cours</p>
              <p className="text-3xl font-bold text-blue-200">
                {formatSiesteTimer(siesteTimer)}
              </p>
            </div>
          )}

          {/* Actions principales */}
          <div className="space-y-3">
            <Button
              onClick={demanderTransport}
              variant="destructive"
              className={`w-full h-12 ${
                transportAlternatif 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <Car className="h-4 w-4 mr-2" />
              {transportAlternatif ? '✅ Transport organisé' : '🚗 JE NE CONDUIS PAS'}
            </Button>
            
            <Button
              onClick={activerSieste}
              variant="secondary"
              className={`w-full h-12 text-black ${
                siesteActivee
                  ? 'bg-blue-300 hover:bg-blue-400'
                  : 'bg-yellow-400 hover:bg-yellow-500'
              }`}
              disabled={siesteActivee}
            >
              {siesteActivee ? (
                <>
                  <Moon className="h-4 w-4 mr-2" />
                  Sieste en cours...
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  SIESTE {calculerSiesteOptimale()}MIN
                </>
              )}
            </Button>
            
            <Button
              onClick={() => {
                toast.info('🏥 Consultation sommeil demandée', {
                  description: 'Vous serez contacté dans les 24h'
                });
                window.open('tel:15', '_self');
              }}
              variant="outline"
              className="w-full h-12 bg-white/10 border-white/20 hover:bg-white/20"
            >
              <Phone className="h-4 w-4 mr-2" />
              CONSULTATION URGENTE
            </Button>
          </div>

          {/* Conseils récupération */}
          <div className="bg-white/10 rounded-lg p-3 text-sm">
            <p className="font-medium mb-2">Conseils de sécurité :</p>
            <ul className="space-y-1 opacity-90">
              <li>• Évitez absolument la conduite</li>
              <li>• Sieste courte (20min) ou longue (90min)</li>
              <li>• Hydratez-vous bien</li>
              <li>• Évitez alcool et écrans</li>
              <li>• Préparez une nuit de récupération</li>
            </ul>
          </div>

          {/* Fermeture sécurisée */}
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full bg-white/10 border-white/20 hover:bg-white/20"
          >
            Fermer (je reste vigilant)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

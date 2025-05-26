
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Utensils, Phone, CheckCircle, Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface EmergencyNutritionModalProps {
  onClose: () => void;
  emergencyLevel: 'safe' | 'warning' | 'critical' | 'emergency';
  emergencyType: 'hypoglycemie' | 'allergie' | 'general';
}

export const EmergencyNutritionModal = ({ 
  onClose, 
  emergencyLevel, 
  emergencyType = 'general' 
}: EmergencyNutritionModalProps) => {
  const [symptomesAllergiques, setSymptomesAllergiques] = useState<string[]>([]);
  const [sucresPris, setSucresPris] = useState(false);
  const [verificationProgrammee, setVerificationProgrammee] = useState(false);

  const symptomesOptions = [
    'Difficultés respiratoires',
    'Gonflement visage/gorge', 
    'Urticaire généralisé',
    'Nausées/vomissements',
    'Étourdissements',
    'Pouls rapide'
  ];

  const symptomesGraves = ['Difficultés respiratoires', 'Gonflement visage/gorge'];

  const gererHypoglycemie = () => {
    const sucresRapides = [
      '3 morceaux de sucre',
      '1 canette de soda (non light)',
      '15g de glucose en comprimés',
      '1 cuillère à soupe de miel',
      '150ml de jus de fruit'
    ];

    toast.info('Sucres rapides recommandés', {
      description: sucresRapides.join(' • '),
      duration: 0,
      action: {
        label: 'J\'ai consommé',
        onClick: () => confirmerSucres()
      }
    });
  };

  const confirmerSucres = async () => {
    try {
      setSucresPris(true);
      
      // Programmer vérification dans 15min
      setTimeout(() => {
        if (!verificationProgrammee) return;
        
        toast('⏰ Vérification hypoglycémie', {
          description: 'Comment vous sentez-vous maintenant?',
          action: {
            label: 'Je vais mieux',
            onClick: () => {
              toast.success('Récupération confirmée');
              onClose();
            }
          }
        });
      }, 15 * 60 * 1000);

      setVerificationProgrammee(true);
      toast.success('Prise notée', {
        description: 'Vérification programmée dans 15 minutes'
      });
    } catch (error) {
      console.error('Erreur enregistrement:', error);
    }
  };

  const gererAllergie = () => {
    const hasSymptomesGraves = symptomesAllergiques.some(s => symptomesGraves.includes(s));
    
    if (hasSymptomesGraves) {
      toast.error('🚨 URGENCE VITALE', {
        description: 'Contactez IMMÉDIATEMENT le 15 (SAMU)',
        duration: 0,
        action: {
          label: 'Appeler 15',
          onClick: () => window.open('tel:15', '_self')
        }
      });
    } else {
      toast.warning('Surveillance allergique', {
        description: 'Arrêtez la consommation. Si aggravation: urgences immédiatement',
        duration: 8000
      });
      onClose();
    }
  };

  const toggleSymptome = (symptome: string) => {
    if (symptomesAllergiques.includes(symptome)) {
      setSymptomesAllergiques(symptomesAllergiques.filter(s => s !== symptome));
    } else {
      setSymptomesAllergiques([...symptomesAllergiques, symptome]);
    }
  };

  const getEmergencyMessage = () => {
    switch (emergencyType) {
      case 'hypoglycemie':
        return {
          title: '⚡ HYPOGLYCÉMIE DÉTECTÉE',
          message: 'Sucres rapides nécessaires immédiatement',
          bgColor: 'bg-orange-500',
          icon: '⚡'
        };
      case 'allergie':
        return {
          title: '🚨 ALLERGÈNE DÉTECTÉ',
          message: 'Arrêtez immédiatement la consommation',
          bgColor: 'bg-red-600',
          icon: '🚨'
        };
      default:
        return {
          title: '🍎 ALERTE NUTRITION',
          message: 'Surveillance nutritionnelle requise',
          bgColor: 'bg-amber-500',
          icon: '🍎'
        };
    }
  };

  const emergency = getEmergencyMessage();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${emergency.bgColor} text-white border-none`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Utensils className="h-6 w-6" />
            {emergency.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message d'urgence */}
          <div className="text-center space-y-2">
            <div className="text-6xl">{emergency.icon}</div>
            <p className="text-lg font-medium">{emergency.message}</p>
          </div>

          {/* Interface Hypoglycémie */}
          {emergencyType === 'hypoglycemie' && (
            <div className="space-y-4">
              <Button
                onClick={gererHypoglycemie}
                variant="secondary"
                className="w-full h-12 text-black hover:bg-white/90 font-bold"
              >
                🍯 VOIR SUCRES RAPIDES
              </Button>
              
              {sucresPris && (
                <div className="bg-green-500/20 rounded-lg p-3 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Sucres pris !</p>
                  <p className="text-sm opacity-90">
                    {verificationProgrammee && (
                      <>
                        <Clock className="inline h-4 w-4 mr-1" />
                        Vérification dans 15min
                      </>
                    )}
                  </p>
                </div>
              )}
              
              <Button
                onClick={confirmerSucres}
                variant="secondary"
                className="w-full text-black hover:bg-white/90"
                disabled={sucresPris}
              >
                ✅ J'ai pris des sucres
              </Button>
            </div>
          )}

          {/* Interface Allergie */}
          {emergencyType === 'allergie' && (
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-medium mb-3">Symptômes présents :</p>
                <div className="space-y-2">
                  {symptomesOptions.map(symptome => (
                    <label key={symptome} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={symptomesAllergiques.includes(symptome)}
                        onChange={() => toggleSymptome(symptome)}
                        className="w-4 h-4 rounded"
                      />
                      <span className={`text-sm ${
                        symptomesGraves.includes(symptome) ? 'font-bold text-red-200' : ''
                      }`}>
                        {symptome}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                onClick={gererAllergie}
                variant="destructive"
                className="w-full h-12 bg-red-700 hover:bg-red-800"
              >
                🚨 ÉVALUER GRAVITÉ
              </Button>
            </div>
          )}

          {/* Actions d'urgence */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => window.open('tel:15', '_self')}
              variant="destructive"
              className="h-12 bg-red-700 hover:bg-red-800"
            >
              <Phone className="h-4 w-4 mr-2" />
              Urgences médicales (15)
            </Button>

            {/* Conseils selon le type */}
            <div className="bg-white/10 rounded-lg p-3 text-sm">
              <p className="font-medium mb-2">Conseils immédiats :</p>
              {emergencyType === 'hypoglycemie' ? (
                <ul className="space-y-1 opacity-90">
                  <li>• Asseyez-vous en sécurité</li>
                  <li>• 15g de sucres rapides</li>
                  <li>• Attendez 15 minutes</li>
                  <li>• Vérifiez amélioration</li>
                </ul>
              ) : (
                <ul className="space-y-1 opacity-90">
                  <li>• Arrêtez tout produit suspect</li>
                  <li>• Rincez bouche si possible</li>
                  <li>• Surveillez respiration</li>
                  <li>• Restez calme et accessible</li>
                </ul>
              )}
            </div>
          </div>

          {/* Fermeture */}
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full bg-white/10 border-white/20 hover:bg-white/20"
          >
            {emergencyType === 'allergie' ? 'Symptômes légers - Surveillance' : 'Fermer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

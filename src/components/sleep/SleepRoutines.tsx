
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Bell, Smartphone, Book, Coffee, Dumbbell } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface RoutineStep {
  id: string;
  name: string;
  time: string;
  description: string;
  icon: React.ReactNode;
  category: 'evening' | 'morning';
}

const SleepRoutines = () => {
  const [eveningRoutineEnabled, setEveningRoutineEnabled] = useState(true);
  const [morningRoutineEnabled, setMorningRoutineEnabled] = useState(true);
  const [smartAlarmEnabled, setSmartAlarmEnabled] = useState(false);

  const eveningSteps: RoutineStep[] = [
    {
      id: '1',
      name: 'Arrêt écrans',
      time: '22:00',
      description: 'Éteindre tous les appareils électroniques',
      icon: <Smartphone className="h-4 w-4" />,
      category: 'evening'
    },
    {
      id: '2',
      name: 'Tisane relaxante',
      time: '22:15',
      description: 'Camomille ou verveine pour la détente',
      icon: <Coffee className="h-4 w-4" />,
      category: 'evening'
    },
    {
      id: '3',
      name: 'Lecture',
      time: '22:30',
      description: '15-20 minutes de lecture calme',
      icon: <Book className="h-4 w-4" />,
      category: 'evening'
    },
    {
      id: '4',
      name: 'Coucher',
      time: '23:00',
      description: 'Aller au lit à heure régulière',
      icon: <Moon className="h-4 w-4" />,
      category: 'evening'
    }
  ];

  const morningSteps: RoutineStep[] = [
    {
      id: '5',
      name: 'Réveil naturel',
      time: '06:30',
      description: 'Se lever dès le réveil, sans snooze',
      icon: <Sun className="h-4 w-4" />,
      category: 'morning'
    },
    {
      id: '6',
      name: 'Exposition lumière',
      time: '06:35',
      description: '10 minutes de lumière naturelle',
      icon: <Sun className="h-4 w-4" />,
      category: 'morning'
    },
    {
      id: '7',
      name: 'Hydratation',
      time: '06:40',
      description: 'Grand verre d\'eau au réveil',
      icon: <Coffee className="h-4 w-4" />,
      category: 'morning'
    },
    {
      id: '8',
      name: 'Étirements',
      time: '06:45',
      description: '5-10 minutes d\'étirements doux',
      icon: <Dumbbell className="h-4 w-4" />,
      category: 'morning'
    }
  ];

  const handleToggleSmartAlarm = () => {
    setSmartAlarmEnabled(!smartAlarmEnabled);
    toast.success(
      smartAlarmEnabled ? 'Réveil intelligent désactivé' : 'Réveil intelligent activé',
      {
        description: smartAlarmEnabled 
          ? 'Retour au réveil classique'
          : 'Réveil optimisé selon vos cycles de sommeil'
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Configuration Smart Alarm */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Réveil intelligent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="smart-alarm">Activer le réveil intelligent</Label>
              <p className="text-sm text-muted-foreground">
                Réveil optimisé selon vos cycles de sommeil (±30 min)
              </p>
            </div>
            <Switch
              id="smart-alarm"
              checked={smartAlarmEnabled}
              onCheckedChange={handleToggleSmartAlarm}
            />
          </div>
          
          {smartAlarmEnabled && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                🎯 Réveil optimisé activé
              </p>
              <p className="text-xs text-blue-600">
                Votre réveil sera ajusté pour vous réveiller en phase de sommeil léger
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Routine du soir */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Routine du soir
            </CardTitle>
            <Switch
              checked={eveningRoutineEnabled}
              onCheckedChange={setEveningRoutineEnabled}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eveningSteps.map((step, index) => (
              <div 
                key={step.id} 
                className={`flex items-center gap-3 p-3 rounded-lg transition-opacity ${
                  eveningRoutineEnabled ? 'bg-muted/30' : 'opacity-50 bg-muted/10'
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{step.name}</span>
                    <Badge variant="outline">{step.time}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < eveningSteps.length - 1 && (
                  <div className="w-px h-6 bg-border ml-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Routine du matin */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Routine du matin
            </CardTitle>
            <Switch
              checked={morningRoutineEnabled}
              onCheckedChange={setMorningRoutineEnabled}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {morningSteps.map((step, index) => (
              <div 
                key={step.id} 
                className={`flex items-center gap-3 p-3 rounded-lg transition-opacity ${
                  morningRoutineEnabled ? 'bg-muted/30' : 'opacity-50 bg-muted/10'
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{step.name}</span>
                    <Badge variant="outline">{step.time}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < morningSteps.length - 1 && (
                  <div className="w-px h-6 bg-border ml-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conseils personnalisés */}
      <Card>
        <CardHeader>
          <CardTitle>Conseils personnalisés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800">
              🏃‍♂️ Après l'entraînement
            </p>
            <p className="text-xs text-green-600">
              Évitez les entraînements intenses 3h avant le coucher
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-800">
              🥗 Nutrition et sommeil
            </p>
            <p className="text-xs text-purple-600">
              Dernier repas 2-3h avant le coucher, évitez la caféine après 14h
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              🌡️ Environnement optimal
            </p>
            <p className="text-xs text-blue-600">
              Température 16-19°C, chambre sombre et silencieuse
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepRoutines;

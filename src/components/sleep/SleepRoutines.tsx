
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, Moon, Coffee, Book, Smartphone } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const SleepRoutines = () => {
  const [routines, setRoutines] = useState([
    {
      id: 1,
      name: 'Routine du soir',
      time: '22:00',
      activities: ['Lecture', 'Tisane', 'Méditation'],
      enabled: true,
      icon: Moon
    },
    {
      id: 2,
      name: 'Réveil en douceur',
      time: '07:00',
      activities: ['Étirements', 'Hydratation', 'Lumière naturelle'],
      enabled: true,
      icon: Coffee
    }
  ]);

  const [reminders, setReminders] = useState([
    { id: 1, text: 'Arrêter les écrans', time: '21:00', enabled: true },
    { id: 2, text: 'Préparer la chambre', time: '21:30', enabled: true },
    { id: 3, text: 'Temps de lecture', time: '22:00', enabled: false }
  ]);

  const toggleRoutine = (id: number) => {
    setRoutines(prev => prev.map(routine => 
      routine.id === id ? { ...routine, enabled: !routine.enabled } : routine
    ));
    toast.success('Routine mise à jour');
  };

  const toggleReminder = (id: number) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
    toast.success('Rappel mis à jour');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Routines de sommeil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {routines.map((routine) => {
            const IconComponent = routine.icon;
            return (
              <div key={routine.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{routine.name}</h4>
                    <p className="text-sm text-muted-foreground">{routine.time}</p>
                    <div className="flex gap-2 mt-1">
                      {routine.activities.map((activity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={routine.enabled}
                  onCheckedChange={() => toggleRoutine(routine.id)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Rappels intelligents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="font-medium">{reminder.text}</p>
                  <p className="text-sm text-muted-foreground">{reminder.time}</p>
                </div>
              </div>
              <Switch
                checked={reminder.enabled}
                onCheckedChange={() => toggleReminder(reminder.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conseils du soir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Écrans</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Évitez les écrans 1h avant le coucher pour améliorer la qualité du sommeil.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-4 w-4 text-green-600" />
                <h4 className="font-medium">Lecture</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                15-30 minutes de lecture favorisent la détente et l'endormissement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepRoutines;

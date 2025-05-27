
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Clock, TrendingUp, Zap } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface SleepSession {
  id: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes?: string;
  date: string;
}

const SleepTracker = () => {
  const [bedtime, setBedtime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [sleepQuality, setSleepQuality] = useState(0);
  const [notes, setNotes] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  // Mock data pour l'affichage
  const recentSessions: SleepSession[] = [
    {
      id: '1',
      bedtime: '23:00',
      wakeTime: '07:00',
      duration: 8,
      quality: 4,
      date: '2024-12-27',
      notes: 'Très bon sommeil après l\'entraînement'
    },
    {
      id: '2',
      bedtime: '23:30',
      wakeTime: '06:45',
      duration: 7.25,
      quality: 3,
      date: '2024-12-26',
      notes: 'Réveil un peu difficile'
    }
  ];

  const calculateDuration = (bedtime: string, wakeTime: string): number => {
    if (!bedtime || !wakeTime) return 0;
    
    const bed = new Date(`2024-01-01 ${bedtime}`);
    let wake = new Date(`2024-01-01 ${wakeTime}`);
    
    // Si l'heure de réveil est avant l'heure de coucher, c'est le jour suivant
    if (wake < bed) {
      wake = new Date(`2024-01-02 ${wakeTime}`);
    }
    
    return (wake.getTime() - bed.getTime()) / (1000 * 60 * 60);
  };

  const duration = calculateDuration(bedtime, wakeTime);

  const handleLogSleep = async () => {
    if (!bedtime || !wakeTime || sleepQuality === 0) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    setIsLogging(true);
    
    try {
      // Ici on sauvegarderait en base de données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Sommeil enregistré !', {
        description: `${duration.toFixed(1)}h de sommeil - Qualité: ${sleepQuality}/5`
      });
      
      // Reset form
      setBedtime('');
      setWakeTime('');
      setSleepQuality(0);
      setNotes('');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setIsLogging(false);
    }
  };

  const renderStars = (quality: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setSleepQuality(star)}
            className={`text-lg ${
              star <= quality 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-300 cursor-pointer' : ''}`}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enregistrement du sommeil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Enregistrer mon sommeil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedtime">Heure de coucher</Label>
              <Input
                id="bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wakeTime">Heure de réveil</Label>
              <Input
                id="wakeTime"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
            </div>
          </div>

          {duration > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Durée: {duration.toFixed(1)} heures</span>
                <Badge variant={duration >= 7 && duration <= 9 ? "default" : "secondary"}>
                  {duration >= 7 && duration <= 9 ? "Optimal" : duration < 7 ? "Court" : "Long"}
                </Badge>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Qualité du sommeil</Label>
            <div className="flex items-center gap-2">
              {renderStars(sleepQuality, true)}
              <span className="text-sm text-muted-foreground ml-2">
                {sleepQuality === 0 ? 'Non évalué' : `${sleepQuality}/5`}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Input
              id="notes"
              placeholder="Comment s'est passée votre nuit ?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleLogSleep}
            disabled={isLogging || !bedtime || !wakeTime || sleepQuality === 0}
            className="w-full"
          >
            {isLogging ? 'Enregistrement...' : 'Enregistrer mon sommeil'}
          </Button>
        </CardContent>
      </Card>

      {/* Historique récent */}
      <Card>
        <CardHeader>
          <CardTitle>Historique récent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <div className="font-medium">{new Date(session.date).toLocaleDateString('fr-FR')}</div>
                    <div className="text-muted-foreground">
                      {session.bedtime} → {session.wakeTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium">{session.duration}h</div>
                    <div className="flex items-center gap-1">
                      {renderStars(session.quality)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepTracker;

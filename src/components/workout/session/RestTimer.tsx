
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Minus, Plus, Play, Pause, SkipForward } from 'lucide-react';

type RestTimerProps = {
  restTime: number;
  isTimerActive: boolean;
  onToggleTimer: () => void;
  onSkip: () => void;
  onAdjustTime: (seconds: number) => void;
};

const RestTimer = ({
  restTime,
  isTimerActive,
  onToggleTimer,
  onSkip,
  onAdjustTime
}: RestTimerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-6 text-center">
        <Timer className="mx-auto mb-4 text-blue-600" size={48} />
        <h2 className="text-2xl font-bold text-blue-800 mb-2">Temps de repos</h2>
        <div className="text-6xl font-mono font-bold text-blue-600 mb-4">
          {formatTime(restTime)}
        </div>
        <div className="flex justify-center gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAdjustTime(-15)}
            className="bg-white"
          >
            <Minus size={16} className="mr-1" />
            15s
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAdjustTime(15)}
            className="bg-white"
          >
            <Plus size={16} className="mr-1" />
            15s
          </Button>
        </div>
        <div className="flex justify-center gap-2">
          <Button 
            variant="outline"
            onClick={onToggleTimer}
            className="bg-white"
          >
            {isTimerActive ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
            {isTimerActive ? 'Pause' : 'Reprendre'}
          </Button>
          <Button onClick={onSkip} className="bg-blue-600 hover:bg-blue-700">
            <SkipForward size={16} className="mr-2" />
            Passer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestTimer;

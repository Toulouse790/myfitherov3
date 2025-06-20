
import React from 'react';
import { UserData } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Step3GoalsProps {
  userData: UserData;
  handleInputChange: (field: string, value: any) => void;
  handleArrayChange: (field: string, item: string, checked: boolean) => void;
}

const Step3Goals = ({ userData, handleInputChange, handleArrayChange }: Step3GoalsProps) => {
  const availableSports = [
    'Musculation',
    'Cardio',
    'Course à pied',
    'Natation',
    'Cyclisme',
    'Yoga',
    'Pilates',
    'Sports collectifs'
  ];

  const handleSportChange = (sport: string, checked: boolean) => {
    handleArrayChange('sports', sport, checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objectifs et sports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mainGoal">Objectif principal</Label>
          <Select value={userData.mainGoal} onValueChange={(value) => handleInputChange('mainGoal', value)}>
            <SelectTrigger id="mainGoal">
              <SelectValue placeholder="Sélectionnez votre objectif principal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight_loss">Perdre du poids</SelectItem>
              <SelectItem value="muscle_gain">Prendre de la masse musculaire</SelectItem>
              <SelectItem value="strength">Améliorer ma force</SelectItem>
              <SelectItem value="endurance">Améliorer mon endurance</SelectItem>
              <SelectItem value="maintenance">Maintenir ma forme actuelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Sports préférés (sélectionnez plusieurs si nécessaire)</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableSports.map((sport) => (
              <div key={sport} className="flex items-center space-x-2">
                <Checkbox
                  id={`sport-${sport}`}
                  checked={userData.sports.includes(sport)}
                  onCheckedChange={(checked) => handleSportChange(sport, checked as boolean)}
                />
                <Label htmlFor={`sport-${sport}`} className="text-sm">
                  {sport}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step3Goals;

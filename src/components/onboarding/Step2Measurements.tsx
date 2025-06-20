
import React from 'react';
import { UserData } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Step2MeasurementsProps {
  userData: UserData;
  handleInputChange: (field: string, value: any) => void;
}

const Step2Measurements = ({ userData, handleInputChange }: Step2MeasurementsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mensurations et expérience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Taille (cm)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              value={userData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              placeholder="175"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              step="0.1"
              value={userData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              placeholder="70.5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceLevel">Niveau d'expérience</Label>
          <Select value={userData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
            <SelectTrigger id="experienceLevel">
              <SelectValue placeholder="Sélectionnez votre niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Débutant</SelectItem>
              <SelectItem value="intermediate">Intermédiaire</SelectItem>
              <SelectItem value="advanced">Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Fréquence d'entraînement souhaitée</Label>
          <Select value={userData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Combien de fois par semaine ?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2">1-2 fois par semaine</SelectItem>
              <SelectItem value="3-4">3-4 fois par semaine</SelectItem>
              <SelectItem value="5-6">5-6 fois par semaine</SelectItem>
              <SelectItem value="7+">Tous les jours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step2Measurements;

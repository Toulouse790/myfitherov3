
import React from 'react';
import { UserData } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

interface Step4PreferencesProps {
  userData: UserData;
  handleInputChange: (field: string, value: any) => void;
  handleArrayChange: (field: string, item: string, checked: boolean) => void;
  handleNestedChange: (field: string, key: string, value: boolean) => void;
  handleDayChange: (day: string, checked: boolean) => void;
}

const Step4Preferences = ({ 
  userData, 
  handleInputChange, 
  handleArrayChange, 
  handleNestedChange, 
  handleDayChange 
}: Step4PreferencesProps) => {
  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const dietaryOptions = [
    'Végétarien',
    'Végétalien',
    'Sans gluten',
    'Sans lactose',
    'Cétogène',
    'Méditerranéen'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences et contraintes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Jours disponibles pour l'entraînement</Label>
          <div className="grid grid-cols-2 gap-2">
            {weekDays.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day}`}
                  checked={userData.availableDays.includes(day)}
                  onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                />
                <Label htmlFor={`day-${day}`} className="text-sm">
                  {day}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Équipement disponible</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="equipment-home"
                checked={userData.equipment.home}
                onCheckedChange={(checked) => handleNestedChange('equipment', 'home', checked as boolean)}
              />
              <Label htmlFor="equipment-home">Équipement à domicile</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="equipment-gym"
                checked={userData.equipment.gym}
                onCheckedChange={(checked) => handleNestedChange('equipment', 'gym', checked as boolean)}
              />
              <Label htmlFor="equipment-gym">Accès à une salle de sport</Label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Restrictions alimentaires</Label>
          <div className="grid grid-cols-2 gap-2">
            {dietaryOptions.map((restriction) => (
              <div key={restriction} className="flex items-center space-x-2">
                <Checkbox
                  id={`diet-${restriction}`}
                  checked={userData.dietaryRestrictions.includes(restriction)}
                  onCheckedChange={(checked) => handleArrayChange('dietaryRestrictions', restriction, checked as boolean)}
                />
                <Label htmlFor={`diet-${restriction}`} className="text-sm">
                  {restriction}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="notifications"
            checked={userData.notifications}
            onCheckedChange={(checked) => handleInputChange('notifications', checked)}
          />
          <Label htmlFor="notifications">Recevoir des notifications</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step4Preferences;

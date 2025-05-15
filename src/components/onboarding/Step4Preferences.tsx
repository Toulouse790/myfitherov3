
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserData } from './types';

interface Step4Props {
  userData: UserData;
  handleInputChange: (field: string, value: any) => void;
  handleArrayChange: (field: string, item: string, checked: boolean) => void;
  handleNestedChange: (field: string, key: string, value: boolean) => void;
  handleDayChange: (day: string, checked: boolean) => void;
}

const Step4Preferences: React.FC<Step4Props> = ({ 
  userData, 
  handleInputChange, 
  handleArrayChange, 
  handleNestedChange,
  handleDayChange 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Préférences et contraintes</h3>
      
      <div className="space-y-2">
        <Label>Jours de disponibilité</Label>
        <div className="grid grid-cols-4 gap-2">
          {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox 
                id={day.toLowerCase()}
                checked={userData.availableDays.includes(day)}
                onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
              />
              <Label htmlFor={day.toLowerCase()}>{day}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Équipement disponible</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="home" 
              checked={userData.equipment.home}
              onCheckedChange={(checked) => 
                handleNestedChange('equipment', 'home', checked as boolean)
              }
            />
            <Label htmlFor="home">Matériel à domicile</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="gym" 
              checked={userData.equipment.gym}
              onCheckedChange={(checked) => 
                handleNestedChange('equipment', 'gym', checked as boolean)
              }
            />
            <Label htmlFor="gym">Salle de sport</Label>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Restrictions alimentaires</Label>
        <div className="grid grid-cols-2 gap-2">
          {["Végétarien", "Végétalien", "Sans gluten", "Sans lactose"].map((restriction) => (
            <div key={restriction} className="flex items-center space-x-2">
              <Checkbox 
                id={restriction.toLowerCase().replace(/\s+/g, '-')}
                checked={userData.dietaryRestrictions.includes(restriction)}
                onCheckedChange={(checked) => 
                  handleArrayChange('dietaryRestrictions', restriction, checked as boolean)
                }
              />
              <Label htmlFor={restriction.toLowerCase().replace(/\s+/g, '-')}>{restriction}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Communication</Label>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="notifications" 
            checked={userData.notifications}
            onCheckedChange={(checked) => 
              handleInputChange('notifications', checked)
            }
          />
          <Label htmlFor="notifications">Recevoir des notifications personnalisées</Label>
        </div>
      </div>
    </div>
  );
};

export default Step4Preferences;

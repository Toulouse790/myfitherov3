
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserData } from './types';

interface Step2Props {
  userData: UserData;
  handleInputChange: (field: string, value: any) => void;
}

const Step2Measurements: React.FC<Step2Props> = ({ userData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Mensurations et niveau</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Taille (cm)</Label>
          <Input 
            id="height" 
            type="number" 
            min="100" 
            max="250" 
            placeholder="175" 
            required 
            value={userData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Poids (kg)</Label>
          <Input 
            id="weight" 
            type="number" 
            min="30" 
            max="300" 
            placeholder="70" 
            required 
            value={userData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Niveau</Label>
          <Select 
            value={userData.experienceLevel} 
            onValueChange={(value) => handleInputChange('experienceLevel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisissez votre niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Débutant</SelectItem>
              <SelectItem value="intermediate">Intermédiaire</SelectItem>
              <SelectItem value="advanced">Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Fréquence d'activité actuelle</Label>
        <RadioGroup 
          value={userData.frequency}
          onValueChange={(value) => handleInputChange('frequency', value)}
          className="grid grid-cols-2 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0-1" id="freq-0-1" />
            <Label htmlFor="freq-0-1">0-1 fois par semaine</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1-2" id="freq-1-2" />
            <Label htmlFor="freq-1-2">1-2 fois par semaine</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3-4" id="freq-3-4" />
            <Label htmlFor="freq-3-4">3-4 fois par semaine</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5+" id="freq-5-plus" />
            <Label htmlFor="freq-5-plus">5+ fois par semaine</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Step2Measurements;

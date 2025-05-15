
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserData } from './types';

interface Step1Props {
  userData: UserData;
  handleInputChange: (field: string, value: any) => void;
}

const Step1PersonalInfo: React.FC<Step1Props> = ({ userData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations personnelles</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input 
            id="firstName" 
            placeholder="Entrez votre prénom" 
            required 
            value={userData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input 
            id="lastName" 
            placeholder="Entrez votre nom" 
            required 
            value={userData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="votre@email.com" 
            required 
            value={userData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthdate">Date de naissance</Label>
          <Input 
            id="birthdate" 
            type="date" 
            required 
            value={userData.birthdate}
            onChange={(e) => handleInputChange('birthdate', e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Genre</Label>
        <RadioGroup 
          value={userData.gender} 
          onValueChange={(value) => handleInputChange('gender', value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Homme</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Femme</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Autre</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Step1PersonalInfo;

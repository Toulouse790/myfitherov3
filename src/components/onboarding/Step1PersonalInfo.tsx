
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserData } from './types';

interface Step1Props {
  userData: UserData;
  handleInputChange: (field: string, value: any) => void;
}

const Step1PersonalInfo: React.FC<Step1Props> = ({ userData, handleInputChange }) => {
  // Générer la liste des fuseaux horaires les plus courants
  const commonTimezones = [
    { value: 'Europe/Paris', label: 'Europe/Paris (UTC+1)' },
    { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin (UTC+1)' },
    { value: 'Europe/Rome', label: 'Europe/Rome (UTC+1)' },
    { value: 'Europe/Madrid', label: 'Europe/Madrid (UTC+1)' },
    { value: 'America/New_York', label: 'America/New_York (UTC-5)' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles (UTC-8)' },
    { value: 'America/Montreal', label: 'America/Montreal (UTC-5)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+9)' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney (UTC+10)' },
  ];

  // Détecter automatiquement le fuseau horaire
  React.useEffect(() => {
    if (!userData.timezone) {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      handleInputChange('timezone', detectedTimezone);
    }
  }, [userData.timezone, handleInputChange]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations personnelles</h3>
      
      <div className="space-y-2">
        <Label htmlFor="pseudo">Pseudo (visible dans l'application)</Label>
        <Input 
          id="pseudo" 
          placeholder="Choisissez un pseudo" 
          required 
          value={userData.pseudo}
          onChange={(e) => handleInputChange('pseudo', e.target.value)}
        />
      </div>
      
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

      <div className="space-y-2">
        <Label htmlFor="timezone">Fuseau horaire</Label>
        <Select 
          value={userData.timezone} 
          onValueChange={(value) => handleInputChange('timezone', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez votre fuseau horaire" />
          </SelectTrigger>
          <SelectContent>
            {commonTimezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {userData.timezone && !commonTimezones.find(tz => tz.value === userData.timezone) && (
          <p className="text-xs text-muted-foreground">
            Fuseau détecté automatiquement : {userData.timezone}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step1PersonalInfo;

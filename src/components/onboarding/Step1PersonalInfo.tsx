
import React from 'react';
import { UserData } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Step1PersonalInfoProps {
  userData: UserData;
  handleInputChange: (field: string, value: any) => void;
}

const Step1PersonalInfo = ({ userData, handleInputChange }: Step1PersonalInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              name="firstName"
              value={userData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Votre prénom"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              name="lastName"
              value={userData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Votre nom"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={userData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="votre@email.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birthdate">Date de naissance</Label>
            <Input
              id="birthdate"
              name="birthdate"
              type="date"
              value={userData.birthdate}
              onChange={(e) => handleInputChange('birthdate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Genre</Label>
            <Select value={userData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Sélectionnez votre genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Homme</SelectItem>
                <SelectItem value="female">Femme</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pseudo">Pseudo</Label>
          <Input
            id="pseudo"
            name="pseudo"
            value={userData.pseudo}
            onChange={(e) => handleInputChange('pseudo', e.target.value)}
            placeholder="Votre pseudo"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1PersonalInfo;

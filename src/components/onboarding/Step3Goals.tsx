
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { UserData } from './types';

interface Step3Props {
  userData: UserData;
  handleInputChange: (field: string, value: any) => void;
  handleArrayChange: (field: string, item: string, checked: boolean) => void;
}

const Step3Goals: React.FC<Step3Props> = ({ userData, handleInputChange, handleArrayChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Objectifs</h3>
      
      <div className="space-y-2">
        <Label>Objectif principal</Label>
        <RadioGroup 
          value={userData.mainGoal}
          onValueChange={(value) => handleInputChange('mainGoal', value)} 
          className="grid grid-cols-2 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="muscle" id="goal-muscle" />
            <Label htmlFor="goal-muscle">Prise de masse musculaire</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weight-loss" id="goal-weight-loss" />
            <Label htmlFor="goal-weight-loss">Perte de poids</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="strength" id="goal-strength" />
            <Label htmlFor="goal-strength">Gain de force</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="endurance" id="goal-endurance" />
            <Label htmlFor="goal-endurance">Amélioration de l'endurance</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Sports pratiqués (facultatif)</Label>
        <Tabs defaultValue="team">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="team">Sports collectifs</TabsTrigger>
            <TabsTrigger value="individual">Sports individuels</TabsTrigger>
          </TabsList>
          <TabsContent value="team" className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {["Football", "Basketball", "Handball", "Rugby", "Volleyball", "Hockey"].map((sport) => (
                <div key={sport} className="flex items-center space-x-2">
                  <Checkbox 
                    id={sport.toLowerCase()} 
                    checked={userData.sports.includes(sport)}
                    onCheckedChange={(checked) => 
                      handleArrayChange('sports', sport, checked as boolean)
                    }
                  />
                  <Label htmlFor={sport.toLowerCase()}>{sport}</Label>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="individual" className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {["Course à pied", "Natation", "Cyclisme", "Tennis", "Athlétisme", "Arts martiaux"].map((sport) => (
                <div key={sport} className="flex items-center space-x-2">
                  <Checkbox 
                    id={sport.toLowerCase().replace(/\s+/g, '-')}
                    checked={userData.sports.includes(sport)}
                    onCheckedChange={(checked) => 
                      handleArrayChange('sports', sport, checked as boolean)
                    }
                  />
                  <Label htmlFor={sport.toLowerCase().replace(/\s+/g, '-')}>{sport}</Label>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Step3Goals;

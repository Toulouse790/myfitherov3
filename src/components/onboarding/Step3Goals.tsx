
import React from 'react';
import { FormData } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Step3GoalsProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const Step3Goals = ({ formData, updateFormData }: Step3GoalsProps) => {
  const fitnessGoals = [
    'Perdre du poids',
    'Prendre de la masse musculaire',
    'Améliorer ma condition physique',
    'Maintenir mon poids actuel',
    'Améliorer ma force',
    'Améliorer mon endurance'
  ];

  const handleGoalChange = (goal: string, checked: boolean) => {
    const updatedGoals = checked 
      ? [...formData.goals, goal]
      : formData.goals.filter(g => g !== goal);
    updateFormData({ goals: updatedGoals });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objectifs fitness</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="experienceLevel">Niveau d'expérience</Label>
          <Select value={formData.experienceLevel} onValueChange={(value) => updateFormData({ experienceLevel: value })}>
            <SelectTrigger id="experienceLevel">
              <SelectValue placeholder="Sélectionnez votre niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="debutant">Débutant</SelectItem>
              <SelectItem value="intermediaire">Intermédiaire</SelectItem>
              <SelectItem value="avance">Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Objectifs (sélectionnez plusieurs si nécessaire)</Label>
          <div className="space-y-2">
            {fitnessGoals.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={`goal-${goal}`}
                  checked={formData.goals.includes(goal)}
                  onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                />
                <Label htmlFor={`goal-${goal}`} className="text-sm">
                  {goal}
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

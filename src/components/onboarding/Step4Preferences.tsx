
import React from 'react';
import { FormData } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Step4PreferencesProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const Step4Preferences = ({ formData, updateFormData }: Step4PreferencesProps) => {
  const activityTypes = [
    'Musculation',
    'Cardio',
    'Yoga',
    'Pilates',
    'Course à pied',
    'Natation',
    'Cyclisme',
    'Sports collectifs'
  ];

  const handleActivityChange = (activity: string, checked: boolean) => {
    const updatedActivities = checked 
      ? [...formData.preferredActivities, activity]
      : formData.preferredActivities.filter(a => a !== activity);
    updateFormData({ preferredActivities: updatedActivities });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences d'entraînement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workoutFrequency">Fréquence d'entraînement souhaitée</Label>
          <Select value={formData.workoutFrequency} onValueChange={(value) => updateFormData({ workoutFrequency: value })}>
            <SelectTrigger id="workoutFrequency">
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

        <div className="space-y-3">
          <Label>Types d'activités préférées</Label>
          <div className="grid grid-cols-2 gap-2">
            {activityTypes.map((activity) => (
              <div key={activity} className="flex items-center space-x-2">
                <Checkbox
                  id={`activity-${activity}`}
                  checked={formData.preferredActivities.includes(activity)}
                  onCheckedChange={(checked) => handleActivityChange(activity, checked as boolean)}
                />
                <Label htmlFor={`activity-${activity}`} className="text-sm">
                  {activity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step4Preferences;

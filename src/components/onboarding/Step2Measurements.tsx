
import React from 'react';
import { FormData } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Step2MeasurementsProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const Step2Measurements = ({ formData, updateFormData }: Step2MeasurementsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mensurations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Taille (cm)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              value={formData.height}
              onChange={(e) => updateFormData({ height: parseInt(e.target.value) || 0 })}
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
              value={formData.weight}
              onChange={(e) => updateFormData({ weight: parseFloat(e.target.value) || 0 })}
              placeholder="70.5"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step2Measurements;

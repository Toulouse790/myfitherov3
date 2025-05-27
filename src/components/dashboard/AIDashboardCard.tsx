
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SimpleRecommendation } from '@/services/SimpleAI';

interface AIDashboardCardProps {
  recommendation: SimpleRecommendation | null;
}

export function AIDashboardCard({ recommendation }: AIDashboardCardProps) {
  const navigate = useNavigate();

  if (!recommendation) return null;

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          💡 Conseil IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🤖</span>
          <div className="flex-1">
            <p className="font-medium text-blue-900">
              "{recommendation.message}"
            </p>
            {recommendation.value && (
              <p className="text-sm text-blue-700 mt-1">
                Recommandation: {recommendation.value} {recommendation.unit}
              </p>
            )}
          </div>
        </div>
        <div className="mt-3">
          <Button size="sm" onClick={() => navigate('/simple-ai')}>
            Voir tous les conseils
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

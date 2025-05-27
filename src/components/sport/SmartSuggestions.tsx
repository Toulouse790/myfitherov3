
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSmartSuggestions } from '@/features/sport/tracking/hooks';
import { useWeatherRecommendations } from '@/hooks/useWeatherRecommendations';

const SmartSuggestions = () => {
  // Métriques de récupération mockées (en réalité, elles viendraient d'un wearable ou saisie utilisateur)
  const mockRecovery = {
    sleepQuality: 7,
    musclesSoreness: 3,
    energyLevel: 8,
    stressLevel: 4,
    readinessScore: 75
  };

  const { data: suggestions, isLoading } = useSmartSuggestions(mockRecovery);
  const { data: weatherData } = useWeatherRecommendations('sport');

  const getReadinessColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadinessLabel = (score: number) => {
    if (score >= 70) return 'Excellent';
    if (score >= 40) return 'Modéré';
    return 'Faible';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suggestions intelligentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score de récupération */}
      <Card>
        <CardHeader>
          <CardTitle>État de récupération</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getReadinessColor(mockRecovery.readinessScore)}`}>
              {mockRecovery.readinessScore}%
            </div>
            <div className="text-sm text-muted-foreground">
              {getReadinessLabel(mockRecovery.readinessScore)}
            </div>
            <Progress 
              value={mockRecovery.readinessScore} 
              className="mt-2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sommeil</span>
                <span className="font-medium">{mockRecovery.sleepQuality}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Énergie</span>
                <span className="font-medium">{mockRecovery.energyLevel}/10</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Courbatures</span>
                <span className="font-medium">{mockRecovery.musclesSoreness}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Stress</span>
                <span className="font-medium">{mockRecovery.stressLevel}/10</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Suggestions du jour</CardTitle>
            <Badge variant="outline">
              🤖 IA
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestions && suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  Aucune suggestion disponible pour le moment
                </p>
              </div>
            )}
          </div>

          {/* Météo actuelle */}
          {weatherData?.weather && (
            <div className="mt-4 p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Conditions actuelles</span>
                <span className="text-2xl">{weatherData.weather.main?.temp}°C</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {weatherData.weather.weather?.[0]?.description}
              </p>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button size="sm" className="flex-1">
              Suivre la suggestion
            </Button>
            <Button variant="outline" size="sm">
              Personnaliser
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartSuggestions;

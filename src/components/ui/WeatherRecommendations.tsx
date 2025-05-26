
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Info, CheckCircle, Lightbulb } from 'lucide-react';
import { Recommendation } from '@/ai/SportAIExpert';

interface WeatherRecommendationsProps {
  recommendations: Recommendation[];
  weather?: any;
  isLoading?: boolean;
}

const WeatherRecommendations: React.FC<WeatherRecommendationsProps> = ({
  recommendations,
  weather,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">Chargement des recommandations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = (type: string) => {
    switch (type) {
      case 'warning':
        return 'destructive';
      case 'success':
        return 'default';
      case 'tip':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="mb-6 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <span>🌤️</span>
          <span>Recommandations personnalisées</span>
          {weather && (
            <Badge variant="outline" className="ml-auto">
              {Math.round(weather.main?.temp || 0)}°C
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
            <div className="mt-0.5">
              {getIcon(rec.type)}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-sm">{rec.title}</h4>
                <Badge variant={getVariant(rec.type)} className="text-xs">
                  {rec.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{rec.message}</p>
              {rec.alternatives && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {rec.alternatives.map((alt, altIndex) => (
                    <Badge key={altIndex} variant="outline" className="text-xs">
                      {alt}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WeatherRecommendations;

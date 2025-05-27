
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Moon, Sun, TrendingUp, Clock, Zap } from 'lucide-react';

const SleepStats = () => {
  // Données mockées pour les statistiques
  const weeklyData = [
    { day: 'Lun', heures: 7.5, qualité: 4, coucher: '23:00', lever: '06:30' },
    { day: 'Mar', heures: 6.8, qualité: 3, coucher: '23:30', lever: '06:18' },
    { day: 'Mer', heures: 8.2, qualité: 5, coucher: '22:45', lever: '06:57' },
    { day: 'Jeu', heures: 7.1, qualité: 4, coucher: '23:15', lever: '06:21' },
    { day: 'Ven', heures: 6.5, qualité: 2, coucher: '00:00', lever: '06:30' },
    { day: 'Sam', heures: 8.5, qualité: 5, coucher: '23:30', lever: '08:00' },
    { day: 'Dim', heures: 8.0, qualité: 4, coucher: '23:00', lever: '07:00' },
  ];

  const stats = {
    moyenne: 7.4,
    qualitéMoyenne: 3.9,
    consistance: 85,
    récupération: 92
  };

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Moyenne sommeil</p>
                <p className="text-2xl font-bold">{stats.moyenne}h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Qualité moyenne</p>
                <p className="text-2xl font-bold">{stats.qualitéMoyenne}/5</p>
              </div>
              <div className="text-yellow-500 text-2xl">⭐</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consistance</p>
                <p className="text-2xl font-bold">{stats.consistance}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Récupération</p>
                <p className="text-2xl font-bold">{stats.récupération}%</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique hebdomadaire */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution hebdomadaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'heures' ? `${value}h` : value,
                    name === 'heures' ? 'Durée' : 'Qualité'
                  ]}
                />
                <Bar dataKey="heures" fill="#3b82f6" name="heures" />
                <Bar dataKey="qualité" fill="#f59e0b" name="qualité" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Objectifs et recommandations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Objectifs sommeil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Durée cible</span>
              <Badge>7-9h</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Heure coucher idéale</span>
              <Badge variant="outline">22:30-23:00</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Heure lever idéale</span>
              <Badge variant="outline">06:30-07:00</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Qualité minimale</span>
              <Badge>4/5 ⭐</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">✅ Excellent réveil naturel</p>
              <p className="text-xs text-green-600">Vous vous réveillez avant votre alarme</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">⚠️ Horaires irréguliers</p>
              <p className="text-xs text-yellow-600">Essayez de vous coucher à heure fixe</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">💡 Optimisation entraînement</p>
              <p className="text-xs text-blue-600">Meilleur sommeil après cardio modéré</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SleepStats;

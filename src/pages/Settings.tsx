import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { ConsentManagerUI } from '@/components/security/ConsentManager';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { SecurityConfigStatus } from '@/components/admin/SecurityConfigStatus';
import { MobileFeatures } from '@/components/mobile/MobileFeatures';
import { User, Shield, Database, Bell, Palette, Globe, Trash2, Smartphone } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Settings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    workouts: true,
    meals: true,
    sleep: false,
    achievements: true
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    timezone: 'Europe/Paris',
    units: 'metric',
    theme: 'system'
  });

  const handleSaveSettings = () => {
    // En production, ceci sauvegarderait dans Supabase
    toast.success('Paramètres sauvegardés avec succès');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez vos préférences et paramètres de sécurité</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sécurité & Confidentialité
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Mes Données
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        {/* Onglet Général */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Utilisateur</CardTitle>
              <CardDescription>Informations de base de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue="Dupont" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled />
                <p className="text-xs text-muted-foreground">
                  L'email ne peut pas être modifié pour des raisons de sécurité
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Choisissez les notifications que vous souhaitez recevoir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={key} className="text-sm font-medium capitalize">
                      {key === 'workouts' && 'Entraînements'}
                      {key === 'meals' && 'Nutrition'}
                      {key === 'sleep' && 'Sommeil'}
                      {key === 'achievements' && 'Réussites'}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Recevoir des rappels et notifications
                    </p>
                  </div>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Préférences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Langue</Label>
                  <Select value={preferences.language} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, language: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Unités</Label>
                  <Select value={preferences.units} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, units: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Métrique (kg, cm)</SelectItem>
                      <SelectItem value="imperial">Impérial (lbs, ft)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>Sauvegarder les modifications</Button>
          </div>
        </TabsContent>

        {/* Nouvel Onglet Mobile */}
        <TabsContent value="mobile" className="space-y-6">
          <MobileFeatures />
        </TabsContent>

        {/* Onglet Sécurité & Confidentialité */}
        <TabsContent value="security" className="space-y-6">
          <ConsentManagerUI />
        </TabsContent>

        {/* Onglet Mes Données */}
        <TabsContent value="data" className="space-y-6">
          <SecurityDashboard />
        </TabsContent>

        {/* Onglet Configuration Admin */}
        <TabsContent value="admin" className="space-y-6">
          <SecurityConfigStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

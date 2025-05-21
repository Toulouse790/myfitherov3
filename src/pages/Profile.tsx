
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Edit, Save, Calendar, Trophy, Medal } from 'lucide-react';
import { StorageService } from '@/services/storage';
import { UserData } from '@/components/onboarding/types';

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chargement des données du profil à partir du localStorage
    const storedUserData = StorageService.getItem<UserData | null>('userProfile', null);
    setUserData(storedUserData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Chargement du profil...</p>
        </div>
      </MainLayout>
    );
  }

  if (!userData) {
    return (
      <MainLayout>
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Profil non configuré</h1>
          <p className="text-muted-foreground">
            Vous devez compléter le processus d'onboarding pour accéder à votre profil.
          </p>
          <Button asChild>
            <a href="/onboarding">Configurer mon profil</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Profil</h1>
            <p className="text-muted-foreground">
              Consultez et modifiez vos informations personnelles
            </p>
          </div>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Modifier mon profil
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-28 w-28 mb-4">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.firstName} ${userData.lastName}`} />
                <AvatarFallback>
                  {userData.firstName.charAt(0)}
                  {userData.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{userData.firstName} {userData.lastName}</h2>
              <p className="text-muted-foreground">{userData.email}</p>
              
              <div className="w-full mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Niveau:</span>
                  <span className="font-medium">
                    {userData.experienceLevel === 'beginner' ? 'Débutant' : 
                     userData.experienceLevel === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Objectif:</span>
                  <span className="font-medium">
                    {userData.mainGoal === 'muscle' ? 'Prise de masse' : 
                     userData.mainGoal === 'weight-loss' ? 'Perte de poids' : 
                     userData.mainGoal === 'strength' ? 'Force' : 'Endurance'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fréquence:</span>
                  <span className="font-medium">{userData.frequency} fois/semaine</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <Tabs defaultValue="details">
              <CardHeader>
                <TabsList>
                  <TabsTrigger value="details">Détails personnels</TabsTrigger>
                  <TabsTrigger value="preferences">Préférences</TabsTrigger>
                  <TabsTrigger value="achievements">Réalisations</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Informations personnelles</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Genre:</span>
                          <span>
                            {userData.gender === 'male' ? 'Homme' : 
                             userData.gender === 'female' ? 'Femme' : 'Autre'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date de naissance:</span>
                          <span>{new Date(userData.birthdate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Taille:</span>
                          <span>{userData.height} cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Poids:</span>
                          <span>{userData.weight} kg</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Sports pratiqués</h3>
                      {userData.sports && userData.sports.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userData.sports.map(sport => (
                            <span key={sport} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                              {sport}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Aucun sport spécifié</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Jours d'entraînement</h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.availableDays.map(day => (
                          <span key={day} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Équipement</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 rounded-full bg-green-500"></div>
                          <span>{userData.equipment.home ? 'Équipement à domicile disponible' : 'Pas d\'équipement à domicile'}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 rounded-full bg-blue-500"></div>
                          <span>{userData.equipment.gym ? 'Accès à une salle de sport' : 'Pas d\'accès à une salle de sport'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Restrictions alimentaires</h3>
                      {userData.dietaryRestrictions && userData.dietaryRestrictions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userData.dietaryRestrictions.map(restriction => (
                            <span key={restriction} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                              {restriction}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Aucune restriction alimentaire</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Notifications</h3>
                      <p>
                        {userData.notifications 
                          ? 'Notifications activées' 
                          : 'Notifications désactivées'}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="achievements">
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Trophy className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Pas encore de réalisations</h3>
                    <p className="text-muted-foreground max-w-md">
                      Continuez à utiliser MyFitHero et à compléter vos objectifs pour débloquer des réalisations!
                    </p>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;

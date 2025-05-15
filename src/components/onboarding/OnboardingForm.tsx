import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // État pour stocker les données de l'utilisateur
  const [userData, setUserData] = useState({
    // Étape 1 : Informations personnelles
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    gender: "male",
    // Étape 2 : Mensurations et niveau
    height: "",
    weight: "",
    experienceLevel: "intermediate",
    frequency: "3-4",
    // Étape 3 : Objectifs
    mainGoal: "strength",
    sports: [] as string[],
    // Étape 4 : Préférences et contraintes
    availableDays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    equipment: {
      home: true,
      gym: true
    },
    dietaryRestrictions: [] as string[],
    notifications: true
  });

  // Gérer les changements de valeur pour tous les champs
  const handleInputChange = (field: string, value: any) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Gérer les changements pour les tableaux (comme les sports)
  const handleArrayChange = (field: string, item: string, checked: boolean) => {
    if (checked) {
      setUserData((prev) => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as string[], item]
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [field]: (prev[field as keyof typeof prev] as string[]).filter(i => i !== item)
      }));
    }
  };

  // Gérer les changements pour les objets imbriqués (comme l'équipement)
  const handleNestedChange = (field: string, key: string, value: boolean) => {
    setUserData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev] as Record<string, boolean>,
        [key]: value
      }
    }));
  };

  // Fonction pour gérer la disponibilité des jours
  const handleDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setUserData(prev => ({
        ...prev,
        availableDays: [...prev.availableDays, day]
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        availableDays: prev.availableDays.filter(d => d !== day)
      }));
    }
  };

  // Fonction pour envoyer les données au webhook n8n
  const sendToN8nWebhook = async (data: any) => {
    const webhookUrl = "https://n8n.srv825462.hstgr.cloud/webhook/738c99a4-1f1b-4604-9a7f-046af9ec5d36";
    
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Pour gérer les problèmes CORS
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: "MyFitHero Onboarding",
          action: "profile_created"
        }),
      });
      
      console.log("Données envoyées avec succès au webhook n8n");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'envoi des données au webhook n8n:", error);
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Cas où l'utilisateur termine le formulaire
      setIsSubmitting(true);

      // Calcul de l'âge à partir de la date de naissance
      let age = "";
      if (userData.birthdate) {
        const birthDate = new Date(userData.birthdate);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        age = calculatedAge.toString();
      }

      // Préparation des données enrichies pour le webhook
      const enrichedData = {
        ...userData,
        age,
        calculatedAt: new Date().toISOString(),
        platform: navigator.userAgent
      };
      
      // Sauvegarder les données dans localStorage pour persistance
      localStorage.setItem('myFitHeroUserProfile', JSON.stringify(enrichedData));
      
      // Envoyer les données au webhook n8n
      const webhookSuccess = await sendToN8nWebhook(enrichedData);
      
      // Notification à l'utilisateur
      toast({
        description: webhookSuccess 
          ? "Votre profil personnalisé a été enregistré avec succès et synchronisé!"
          : "Votre profil a été enregistré localement. La synchronisation sera tentée ultérieurement.",
      });
      
      setIsSubmitting(false);
      
      // Rediriger vers le dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Bienvenue sur MyFitHero</CardTitle>
        <CardDescription>
          Créez votre profil personnalisé pour obtenir un programme sur mesure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full border ${
                  step === currentStep
                    ? "bg-primary text-primary-foreground border-primary"
                    : step < currentStep
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations personnelles</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Entrez votre prénom" 
                    required 
                    value={userData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Entrez votre nom" 
                    required 
                    value={userData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    required 
                    value={userData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Date de naissance</Label>
                  <Input 
                    id="birthdate" 
                    type="date" 
                    required 
                    value={userData.birthdate}
                    onChange={(e) => handleInputChange('birthdate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Genre</Label>
                <RadioGroup 
                  value={userData.gender} 
                  onValueChange={(value) => handleInputChange('gender', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Homme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Femme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Autre</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Mensurations et niveau</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Taille (cm)</Label>
                  <Input 
                    id="height" 
                    type="number" 
                    min="100" 
                    max="250" 
                    placeholder="175" 
                    required 
                    value={userData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    min="30" 
                    max="300" 
                    placeholder="70" 
                    required 
                    value={userData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Niveau</Label>
                  <Select 
                    value={userData.experienceLevel} 
                    onValueChange={(value) => handleInputChange('experienceLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez votre niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Débutant</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire</SelectItem>
                      <SelectItem value="advanced">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Fréquence d'activité actuelle</Label>
                <RadioGroup 
                  value={userData.frequency}
                  onValueChange={(value) => handleInputChange('frequency', value)}
                  className="grid grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0-1" id="freq-0-1" />
                    <Label htmlFor="freq-0-1">0-1 fois par semaine</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-2" id="freq-1-2" />
                    <Label htmlFor="freq-1-2">1-2 fois par semaine</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3-4" id="freq-3-4" />
                    <Label htmlFor="freq-3-4">3-4 fois par semaine</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5+" id="freq-5-plus" />
                    <Label htmlFor="freq-5-plus">5+ fois par semaine</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {currentStep === 3 && (
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
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Préférences et contraintes</h3>
              
              <div className="space-y-2">
                <Label>Jours de disponibilité</Label>
                <div className="grid grid-cols-4 gap-2">
                  {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox 
                        id={day.toLowerCase()}
                        checked={userData.availableDays.includes(day)}
                        onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                      />
                      <Label htmlFor={day.toLowerCase()}>{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Équipement disponible</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="home" 
                      checked={userData.equipment.home}
                      onCheckedChange={(checked) => 
                        handleNestedChange('equipment', 'home', checked as boolean)
                      }
                    />
                    <Label htmlFor="home">Matériel à domicile</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="gym" 
                      checked={userData.equipment.gym}
                      onCheckedChange={(checked) => 
                        handleNestedChange('equipment', 'gym', checked as boolean)
                      }
                    />
                    <Label htmlFor="gym">Salle de sport</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Restrictions alimentaires</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Végétarien", "Végétalien", "Sans gluten", "Sans lactose"].map((restriction) => (
                    <div key={restriction} className="flex items-center space-x-2">
                      <Checkbox 
                        id={restriction.toLowerCase().replace(/\s+/g, '-')}
                        checked={userData.dietaryRestrictions.includes(restriction)}
                        onCheckedChange={(checked) => 
                          handleArrayChange('dietaryRestrictions', restriction, checked as boolean)
                        }
                      />
                      <Label htmlFor={restriction.toLowerCase().replace(/\s+/g, '-')}>{restriction}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Communication</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="notifications" 
                    checked={userData.notifications}
                    onCheckedChange={(checked) => 
                      handleInputChange('notifications', checked)
                    }
                  />
                  <Label htmlFor="notifications">Recevoir des notifications personnalisées</Label>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Button
          variant="outline"
          onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1 || isSubmitting}
        >
          Précédent
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting 
            ? "Traitement en cours..." 
            : currentStep < 4 
              ? "Continuer" 
              : "Terminer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingForm;

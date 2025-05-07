
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

const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Profil créé avec succès!",
        description: "Votre profil personnalisé a été enregistré.",
      });
      // Redirect to dashboard or home
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
                  <Input id="firstName" placeholder="Entrez votre prénom" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" placeholder="Entrez votre nom" required />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="votre@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Date de naissance</Label>
                  <Input id="birthdate" type="date" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Genre</Label>
                <RadioGroup defaultValue="male" className="flex space-x-4">
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
                  <Input id="height" type="number" min="100" max="250" placeholder="175" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input id="weight" type="number" min="30" max="300" placeholder="70" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Niveau</Label>
                  <Select defaultValue="intermediate">
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
                <RadioGroup defaultValue="3-4" className="grid grid-cols-2 gap-2">
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
                <RadioGroup defaultValue="strength" className="grid grid-cols-2 gap-2">
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
                          <Checkbox id={sport.toLowerCase()} />
                          <Label htmlFor={sport.toLowerCase()}>{sport}</Label>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="individual" className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      {["Course à pied", "Natation", "Cyclisme", "Tennis", "Athlétisme", "Arts martiaux"].map((sport) => (
                        <div key={sport} className="flex items-center space-x-2">
                          <Checkbox id={sport.toLowerCase().replace(/\s+/g, '-')} />
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
                      <Checkbox id={day.toLowerCase()} defaultChecked />
                      <Label htmlFor={day.toLowerCase()}>{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Équipement disponible</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="home" defaultChecked />
                    <Label htmlFor="home">Matériel à domicile</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="gym" defaultChecked />
                    <Label htmlFor="gym">Salle de sport</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Restrictions alimentaires</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Végétarien", "Végétalien", "Sans gluten", "Sans lactose"].map((restriction) => (
                    <div key={restriction} className="flex items-center space-x-2">
                      <Checkbox id={restriction.toLowerCase().replace(/\s+/g, '-')} />
                      <Label htmlFor={restriction.toLowerCase().replace(/\s+/g, '-')}>{restriction}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Communication</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="notifications" defaultChecked />
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
          disabled={currentStep === 1}
        >
          Précédent
        </Button>
        <Button onClick={handleSubmit}>
          {currentStep < 4 ? "Continuer" : "Terminer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingForm;

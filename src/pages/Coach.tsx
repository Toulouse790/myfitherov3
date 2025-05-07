
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AIChat from '@/components/coach/AIChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mic, Brain, ArrowRight, Check, CheckCheck, Award } from 'lucide-react';

const Coach = () => {
  const faqItems = [
    {
      question: "Comment augmenter ma force maximale ?",
      answer: "Pour augmenter votre force maximale, concentrez-vous sur des exercices composés avec des charges lourdes (85-95% de votre 1RM) et peu de répétitions (1-5). Priorisez les mouvements comme le squat, le soulevé de terre, le développé couché et le rowing. Assurez-vous d'avoir une bonne technique et progressez graduellement dans les charges."
    },
    {
      question: "Quelle quantité de protéines devrais-je consommer ?",
      answer: "Pour la prise de masse musculaire, visez 1,6 à 2,2g de protéines par kg de poids corporel par jour. Pour la perte de poids, cette quantité peut être légèrement augmentée jusqu'à 2,2-2,6g/kg pour préserver la masse musculaire pendant le déficit calorique."
    },
    {
      question: "Comment améliorer ma récupération entre les séances ?",
      answer: "Pour optimiser votre récupération, assurez-vous de dormir 7-9 heures par nuit, consommez suffisamment de protéines et de glucides après l'entraînement, restez hydraté, et intégrez des techniques comme les étirements, le foam rolling, les bains froids ou les saunas. Planifiez également des jours de repos actif et évitez le surentraînement."
    }
  ];

  const suggestionTopics = [
    "Quelle est la meilleure répartition d'entraînement pour un programme de 4 jours ?",
    "Comment adapter mon alimentation avant une compétition ?",
    "Quelles stratégies pour améliorer mon endurance cardiovasculaire ?",
    "Comment optimiser mon sommeil pour une meilleure récupération musculaire ?",
    "Quels exercices pour renforcer spécifiquement les genoux ?"
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Coach IA</h1>
          <p className="text-muted-foreground">Obtenez des conseils personnalisés et des réponses à vos questions sur tous les aspects de votre programme</p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="chat" className="flex items-center">
              <MessageSquare className="mr-2" size={16} />
              Chat écrit
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center">
              <Mic className="mr-2" size={16} />
              Assistant vocal
            </TabsTrigger>
            <TabsTrigger value="expert" className="flex items-center">
              <Brain className="mr-2" size={16} />
              Mode expert
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AIChat />
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Sujets suggérés</CardTitle>
                    <CardDescription>Des questions populaires pour vous inspirer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {suggestionTopics.map((topic, i) => (
                      <Button key={i} variant="outline" className="w-full justify-start" size="sm">
                        <ArrowRight className="mr-2" size={16} />
                        {topic}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Capacités de l'IA</CardTitle>
                    <CardDescription>Ce que votre assistant peut faire pour vous</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start">
                      <Check className="mr-2 text-green-500 mt-1 flex-shrink-0" size={16} />
                      <span>Créer des plans d'entraînement personnalisés</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 text-green-500 mt-1 flex-shrink-0" size={16} />
                      <span>Proposer des ajustements nutritionnels</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 text-green-500 mt-1 flex-shrink-0" size={16} />
                      <span>Répondre à vos questions sur la récupération</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 text-green-500 mt-1 flex-shrink-0" size={16} />
                      <span>Vous aider à surmonter les plateaux</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 text-green-500 mt-1 flex-shrink-0" size={16} />
                      <span>Adapter vos séances selon votre emploi du temps</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
                <CardDescription>Réponses aux interrogations les plus courantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {faqItems.map((item, i) => (
                    <div key={i}>
                      <h3 className="text-lg font-medium mb-2">{item.question}</h3>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="mt-0">
            <Card className="h-[600px] flex flex-col items-center justify-center">
              <CardContent className="text-center space-y-6">
                <Mic className="w-20 h-20 mx-auto text-muted-foreground" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Assistant vocal</h2>
                  <p className="text-muted-foreground mb-8">Cette fonctionnalité sera disponible prochainement</p>
                  <Button disabled>Activer l'assistant vocal</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expert" className="mt-0">
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-fitness-purple/10 text-fitness-purple mr-4">
                    <Award size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Mode expert</h2>
                    <p className="text-muted-foreground">Accédez à des conseils plus avancés et spécifiques</p>
                  </div>
                </div>
                <Button>Débloquer</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/40 rounded-lg">
                  <div className="flex items-start mb-2">
                    <CheckCheck className="mr-2 text-fitness-purple" size={16} />
                    <span className="font-medium">Analyse biomécanique</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Analyse détaillée de votre technique sur les exercices complexes</p>
                </div>
                <div className="p-4 bg-muted/40 rounded-lg">
                  <div className="flex items-start mb-2">
                    <CheckCheck className="mr-2 text-fitness-purple" size={16} />
                    <span className="font-medium">Périodisation avancée</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Plans d'entraînement avec cycles de progression optimisés</p>
                </div>
                <div className="p-4 bg-muted/40 rounded-lg">
                  <div className="flex items-start mb-2">
                    <CheckCheck className="mr-2 text-fitness-purple" size={16} />
                    <span className="font-medium">Sports spécifiques</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Recommandations adaptées à votre discipline sportive</p>
                </div>
              </div>
            </Card>

            <Card className="h-[400px] flex flex-col items-center justify-center">
              <CardContent className="text-center">
                <h3 className="text-xl font-medium text-muted-foreground">
                  Passez à la version premium pour accéder au mode expert
                </h3>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Coach;

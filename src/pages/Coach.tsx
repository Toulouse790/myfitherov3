
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AIChat from '@/components/coach/AIChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useConversation } from '@/contexts/ConversationContext';
import AICoachCard from '@/components/coach/AICoachCard';
import { infoToast } from '@/components/ui/ModernToast';

const Coach = () => {
  const { setCurrentInput } = useConversation();
  
  const suggestionTopics = [
    "Créer un programme d'entraînement pour débutant",
    "Conseils nutritionnels pour prise de masse",
    "Améliorer la qualité de mon sommeil",
    "Plan d'hydratation personnalisé",
    "Exercices pour renforcer le dos"
  ];
  
  const handleSuggestionClick = (suggestion: string) => {
    setCurrentInput(suggestion);
    infoToast("Suggestion sélectionnée", "Posez votre question au coach IA");
  };

  const faqItems = [
    {
      question: "Comment l'IA comprend-elle mes besoins ?",
      answer: "Notre IA analyse vos questions et utilise des agents spécialisés (nutrition, sommeil, exercice) pour vous donner des réponses personnalisées basées sur les meilleures pratiques."
    },
    {
      question: "Puis-je avoir des conseils pour différents domaines ?",
      answer: "Absolument ! L'IA peut vous conseiller sur l'entraînement, la nutrition, le sommeil, l'hydratation et le bien-être mental de manière intégrée."
    },
    {
      question: "Les conseils sont-ils fiables ?",
      answer: "Nos réponses sont basées sur des données scientifiques validées, mais consultez toujours un professionnel de santé pour des conseils médicaux spécifiques."
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Coach IA</h1>
          <p className="text-muted-foreground">
            Votre assistant personnel alimenté par l'IA pour tous vos besoins en fitness et bien-être
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat principal */}
          <div className="lg:col-span-3">
            <AIChat />
          </div>

          {/* Sidebar avec informations et suggestions */}
          <div className="space-y-4">
            {/* Suggestions rapides */}
            <Card className="h-fit">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ArrowRight className="mr-2" size={18} />
                  Questions rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestionTopics.map((topic, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    className="w-full justify-start text-sm h-auto py-3 px-4" 
                    size="sm"
                    onClick={() => handleSuggestionClick(topic)}
                  >
                    <ArrowRight className="mr-2 flex-shrink-0" size={14} />
                    <span className="text-left">{topic}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
            
            {/* Agent IA info - utilisation du nouveau composant */}
            <AICoachCard />

            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Statistiques IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Temps de réponse moyen</span>
                  <span className="font-medium">1.2s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Précision des réponses</span>
                  <span className="font-medium">94%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Conversations ce mois</span>
                  <span className="font-medium">2,847</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Questions fréquentes</CardTitle>
            <CardDescription>Tout ce que vous devez savoir sur votre coach IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {faqItems.map((item, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="font-medium">{item.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Coach;

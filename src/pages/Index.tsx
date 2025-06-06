
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Dumbbell, AppleIcon, Moon, MessageSquare, BarChart3, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  console.log('🏠 Index page rendered');
  const navigate = useNavigate();
  
  // Modules avec la palette de couleurs fitness moderne
  const modules = [
    { 
      title: "Musculation", 
      description: "Plans personnalisés par niveau et objectif", 
      themeClass: "fitness-sport",
      buttonClass: "btn-sport",
      gradientClass: "bg-gradient-sport",
      icon: Dumbbell,
      path: "/workout",
      actionLabel: "Voir les programmes"
    },
    { 
      title: "Nutrition", 
      description: "Plans nutritionnels adaptés à vos objectifs", 
      themeClass: "fitness-nutrition",
      buttonClass: "btn-nutrition",
      gradientClass: "bg-gradient-nutrition",
      icon: AppleIcon,
      path: "/nutrition",
      actionLabel: "Voir les plans alimentaires"
    },
    { 
      title: "Sommeil", 
      description: "Suivi et amélioration de la qualité du sommeil", 
      themeClass: "fitness-sleep",
      buttonClass: "btn-sleep",
      gradientClass: "bg-gradient-sleep",
      icon: Moon,
      path: "/sleep",
      actionLabel: "Analyser mon sommeil" 
    },
    { 
      title: "Coach IA", 
      description: "Conseils personnalisés par intelligence artificielle", 
      themeClass: "fitness-primary",
      buttonClass: "bg-gradient-primary hover:opacity-90 text-white border-0 shadow-lg",
      gradientClass: "bg-gradient-primary",
      icon: MessageSquare,
      path: "/coach",
      actionLabel: "Discuter avec le coach" 
    },
    { 
      title: "Tableau de bord", 
      description: "Visualisation des progrès sur tous les paramètres", 
      themeClass: "fitness-hydration",
      buttonClass: "btn-hydration",
      gradientClass: "bg-gradient-hydration",
      icon: BarChart3,
      path: "/dashboard",
      actionLabel: "Voir mes statistiques" 
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="space-y-12 pb-16 safe-area-pb">
          
          {/* Hero Section avec design moderne */}
          <section className="relative pt-16 pb-20 safe-area-pt">
            <div className="text-center space-y-6 max-w-4xl mx-auto px-6">
              
              {/* Titre principal avec gradient moderne */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight animate-fade-in">
                Bienvenue sur{' '}
                <span className="gradient-text">
                  MyFitHero
                </span>
              </h1>
              
              {/* Sous-titre */}
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Votre compagnon personnel pour atteindre vos objectifs de fitness et bien-être
              </p>
              
              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-white px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-from-bottom-5" 
                  asChild
                >
                  <Link to="/onboarding" className="flex items-center justify-center">
                    <span>Créer mon profil</span>
                    <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 border-border hover:bg-accent hover:text-accent-foreground px-8 py-3 text-lg font-medium rounded-xl transition-all duration-300" 
                  asChild
                >
                  <Link to="/dashboard" className="flex items-center justify-center">
                    Accéder à mon espace
                  </Link>
                </Button>
              </div>
            </div>

            {/* Élément décoratif avec gradient fitness */}
            <div className="absolute inset-x-0 top-20 -z-10 transform-gpu overflow-hidden blur-3xl">
              <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-primary opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-flow"></div>
            </div>
          </section>

          {/* Section modules */}
          <section className="px-6">
            <div className="max-w-7xl mx-auto">
              
              {/* Titre section */}
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
                  <Medal className="mr-3 text-fitness-primary animate-float" size={32} />
                  Modules disponibles
                </h2>
                <p className="text-lg text-muted-foreground">Découvrez tous nos outils pour votre transformation</p>
              </div>
              
              {/* Grille des modules avec classes modernes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module, index) => (
                  <Card 
                    key={module.title}
                    className={cn(
                      "modern-card gradient-card group hover-grow cursor-pointer",
                      module.themeClass,
                      "animate-fade-in"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => navigate(module.path)}
                  >
                    <CardHeader className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                          <module.icon size={24} className="animate-pulse-soft" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-current group-hover:scale-105 transition-transform">
                        {module.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-6 pt-0">
                      <CardDescription className="mb-6 text-current opacity-80 leading-relaxed">
                        {module.description}
                      </CardDescription>
                      
                      <Button 
                        className={cn(
                          "w-full font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-xl",
                          module.buttonClass
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(module.path);
                        }}
                      >
                        <span>{module.actionLabel}</span>
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                      </Button>
                    </CardContent>
                    
                    {/* Barre décorative avec gradient thématique */}
                    <div className={cn(
                      "h-1 w-full transition-all duration-300 group-hover:h-2",
                      module.gradientClass
                    )}></div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;

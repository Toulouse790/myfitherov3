import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Dumbbell, AppleIcon, Moon, MessageSquare, BarChart3, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  
  // Modules avec codes couleurs distincts
  const modules = [
    { 
      title: "Musculation", 
      description: "Plans personnalisés par niveau et objectif", 
      color: "bg-blue-100 text-blue-700 border-blue-200",
      hoverColor: "hover:bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white", 
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-700",
      icon: Dumbbell,
      path: "/workout",
      actionLabel: "Voir les programmes"
    },
    { 
      title: "Nutrition", 
      description: "Plans nutritionnels adaptés à vos objectifs", 
      color: "bg-green-100 text-green-700 border-green-200",
      hoverColor: "hover:bg-green-50",
      buttonColor: "bg-green-600 hover:bg-green-700 text-white",
      gradientFrom: "from-green-500",
      gradientTo: "to-green-700", 
      icon: AppleIcon,
      path: "/nutrition",
      actionLabel: "Voir les plans alimentaires"
    },
    { 
      title: "Sommeil", 
      description: "Suivi et amélioration de la qualité du sommeil", 
      color: "bg-purple-100 text-purple-700 border-purple-200",
      hoverColor: "hover:bg-purple-50",
      buttonColor: "bg-purple-600 hover:bg-purple-700 text-white",
      gradientFrom: "from-purple-500",
      gradientTo: "to-purple-700", 
      icon: Moon,
      path: "/sleep",
      actionLabel: "Analyser mon sommeil" 
    },
    { 
      title: "Coach IA", 
      description: "Conseils personnalisés par intelligence artificielle", 
      color: "bg-teal-100 text-teal-700 border-teal-200",
      hoverColor: "hover:bg-teal-50",
      buttonColor: "bg-teal-600 hover:bg-teal-700 text-white",
      gradientFrom: "from-teal-500",
      gradientTo: "to-teal-700", 
      icon: MessageSquare,
      path: "/coach",
      actionLabel: "Discuter avec le coach" 
    },
    { 
      title: "Tableau de bord", 
      description: "Visualisation des progrès sur tous les paramètres", 
      color: "bg-orange-100 text-orange-700 border-orange-200",
      hoverColor: "hover:bg-orange-50",
      buttonColor: "bg-orange-600 hover:bg-orange-700 text-white",
      gradientFrom: "from-orange-500",
      gradientTo: "to-orange-700",
      icon: BarChart3,
      path: "/dashboard",
      actionLabel: "Voir mes statistiques" 
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8 sm:space-y-12">
        <section className="relative pb-6 sm:pb-10">
          <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Bienvenue sur 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-2">
                MyFitHero
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Votre compagnon personnel pour atteindre vos objectifs de fitness et bien-être
            </p>
            <div className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full">
              <Button size="lg" className="w-full xs:w-auto" asChild>
                <Link to="/onboarding" className="flex items-center justify-center">
                  <span>Créer mon profil</span>
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full xs:w-auto" asChild>
                <Link to="/dashboard" className="flex items-center justify-center">
                  Accéder à mon espace
                </Link>
              </Button>
            </div>
          </div>

          <div className="absolute inset-x-0 -bottom-20 xs:-bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
        </section>

        <section className="py-6 sm:py-12 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center">
            <Medal className="mr-2 text-accent h-5 w-5 sm:h-6 sm:w-6" />
            Modules disponibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {modules.map((module) => (
              <Card 
                key={module.title}
                className={cn(
                  "overflow-hidden transition-all border",
                  "hover:shadow-md",
                  module.hoverColor,
                  "border-" + module.color.split(" ")[2]
                )}
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className={cn("p-2 sm:p-3 rounded-lg", module.color)}>
                      <module.icon size={20} className="sm:h-6 sm:w-6" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{module.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <CardDescription className="mb-4 text-sm sm:text-base">{module.description}</CardDescription>
                  <Button 
                    className={cn(
                      "w-full text-sm sm:text-base",
                      module.buttonColor
                    )}
                    onClick={() => navigate(module.path)}
                  >
                    <span>{module.actionLabel}</span>
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </CardContent>
                {/* Barre décorative en bas */}
                <div className={cn(
                  "h-1 w-full bg-gradient-to-r",
                  module.gradientFrom,
                  module.gradientTo
                )}></div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;

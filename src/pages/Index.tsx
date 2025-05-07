
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { ArrowRight, Dumbbell, AppleIcon, Moon, MessageSquare, BarChart3, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const modules = [
    { 
      title: "Musculation", 
      description: "Plans personnalisés par niveau et objectif", 
      color: "bg-fitness-blue/10 text-fitness-blue", 
      icon: Dumbbell,
      path: "/workout"
    },
    { 
      title: "Nutrition", 
      description: "Plans nutritionnels adaptés à vos objectifs", 
      color: "bg-fitness-green/10 text-fitness-green", 
      icon: AppleIcon,
      path: "/nutrition" 
    },
    { 
      title: "Sommeil", 
      description: "Suivi et amélioration de la qualité du sommeil", 
      color: "bg-fitness-purple/10 text-fitness-purple", 
      icon: Moon,
      path: "/sleep" 
    },
    { 
      title: "Coach IA", 
      description: "Conseils personnalisés par intelligence artificielle", 
      color: "bg-fitness-teal/10 text-fitness-teal", 
      icon: MessageSquare,
      path: "/coach" 
    },
    { 
      title: "Tableau de bord", 
      description: "Visualisation des progrès sur tous les paramètres", 
      color: "bg-fitness-orange/10 text-fitness-orange", 
      icon: BarChart3,
      path: "/dashboard" 
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-12">
        <section className="relative pb-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Bienvenue sur 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-2">
                MyFitHero
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Votre compagnon personnel pour atteindre vos objectifs de fitness et bien-être
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button size="lg" asChild>
                <Link to="/onboarding">
                  Créer mon profil
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">Accéder à mon espace</Link>
              </Button>
            </div>
          </div>

          <div className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Medal className="mr-2 text-accent" />
            Modules disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card key={module.title} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={cn("p-3 rounded-lg", module.color)}>
                      <module.icon size={24} />
                    </div>
                    <CardTitle>{module.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{module.description}</CardDescription>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={module.path}>
                      Explorer
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;

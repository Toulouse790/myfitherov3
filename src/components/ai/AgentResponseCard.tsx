
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgentResponse } from '@/types/ai';

// Mapping des icônes par type d'agent
const AGENT_ICONS: Record<string, string> = {
  nutrition: '🥦',
  sommeil: '💤',
  muscu: '🏋️‍♀️',
  hydratation: '💧',
  synthese: '🧠',
  // Extensible avec d'autres types d'agents
  default: '🤖'
};

// Mapping des couleurs par type d'agent
const AGENT_COLORS: Record<string, { bg: string, border: string, text: string }> = {
  nutrition: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800'
  },
  sommeil: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800'
  },
  muscu: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800'
  },
  hydratation: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-800'
  },
  synthese: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800'
  },
  // Extensible avec d'autres types d'agents
  default: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-800'
  }
};

// Mapping des titres par type d'agent
const AGENT_TITLES: Record<string, string> = {
  nutrition: 'Nutrition',
  sommeil: 'Sommeil',
  muscu: 'Musculation',
  hydratation: 'Hydratation',
  synthese: 'Synthèse générale',
  // Extensible avec d'autres types d'agents
  default: 'Agent IA'
};

interface AgentResponseCardProps {
  response: AgentResponse;
  isNew?: boolean; // Pour les animations d'entrée
}

const AgentResponseCard: React.FC<AgentResponseCardProps> = ({ response, isNew = false }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Obtenir l'icône, les couleurs et le titre en fonction du type d'agent
  const icon = AGENT_ICONS[response.agent_type] || AGENT_ICONS.default;
  const colors = AGENT_COLORS[response.agent_type] || AGENT_COLORS.default;
  const title = AGENT_TITLES[response.agent_type] || AGENT_TITLES.default;
  
  const hasSummary = !!response.summary;
  const hasContent = !!response.content;
  
  return (
    <Card 
      className={cn(
        `border ${colors.border} ${colors.bg} overflow-hidden transition-all duration-300`,
        isNew && "animate-in slide-in-from-bottom-5",
        expanded ? "mb-4" : "mb-2"
      )}
    >
      <CardHeader className={`p-3 ${colors.text}`}>
        <CardTitle className="text-base flex items-center">
          <span className="mr-2 text-lg" role="img" aria-label={title}>{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {hasSummary && (
          <div className="text-sm">
            {/* Afficher le résumé court (limité à 4 lignes max) */}
            <div className={cn(
              "line-clamp-4",
              !expanded && hasContent && "mb-3"
            )}>
              {response.summary}
            </div>
            
            {/* Bouton pour afficher les détails si du contenu est disponible */}
            {hasContent && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setExpanded(!expanded)}
                className={cn(
                  `mt-2 transition-all w-full justify-center ${colors.bg} ${colors.border}`,
                  expanded && "mb-3"
                )}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {expanded ? "Masquer les détails" : "📖 Voir les détails"}
              </Button>
            )}
          </div>
        )}
        
        {/* Afficher le contenu détaillé si demandé ou s'il n'y a pas de résumé */}
        {(!hasSummary || expanded) && hasContent && (
          <div className={cn(
            "text-sm",
            expanded && hasSummary && "pt-3 border-t mt-2"
          )}>
            {response.content}
          </div>
        )}
        
        {/* Message si pas de contenu disponible */}
        {!hasSummary && !hasContent && (
          <div className="text-sm italic text-muted-foreground">
            Aucune information disponible pour le moment.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentResponseCard;

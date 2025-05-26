
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AIAgentsSection = () => {
  const agents = [
    {
      icon: '🏃',
      title: 'Expert Sport',
      description: 'Plans d\'entraînement et musculation',
      status: 'online',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: '🥗',
      title: 'Expert Nutrition',
      description: 'Conseils nutritionnels et diététiques',
      status: 'online',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: '😴',
      title: 'Expert Sommeil',
      description: 'Optimisation du repos et récupération',
      status: 'online',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: '💧',
      title: 'Expert Hydratation',
      description: 'Gestion de l\'hydratation',
      status: 'standby',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600'
    }
  ];

  return (
    <Card className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          🤖 Agents IA Spécialisés
        </h2>
        <Button variant="outline" size="sm" className="text-xs px-3 py-1">
          ⚙️ Gérer
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        {agents.map((agent, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-md ${agent.bgColor} ${agent.iconColor} flex items-center justify-center text-base`}>
                {agent.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-900">{agent.title}</h4>
                <p className="text-xs text-slate-600">{agent.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-xs text-slate-600">
                {agent.status === 'online' ? 'En ligne' : 'Standby'}
              </span>
              <Button 
                size="sm" 
                className={`text-xs px-3 py-1 ${
                  agent.status === 'online' 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {agent.status === 'online' ? 'Actif' : 'Standby'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl p-5">
        <div className="mb-2">
          <div className="text-base font-medium">Performance Collective</div>
          <div className="text-3xl font-bold">92%</div>
          <div className="text-sm opacity-90 mb-3">précision</div>
        </div>
        <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-white w-[92%] rounded-full"></div>
        </div>
        <div className="flex justify-between text-xs opacity-90">
          <span>4 agents actifs</span>
          <span>5 agents total</span>
        </div>
      </div>
    </Card>
  );
};

export default AIAgentsSection;

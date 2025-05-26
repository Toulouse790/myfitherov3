
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const StarterSection = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white border border-slate-200 rounded-xl p-6 text-center mb-6">
      <div className="text-5xl mb-4">📊</div>
      <p className="text-slate-600 mb-4">
        Vos données apparaîtront ici<br />
        Commencez votre première séance pour voir vos progrès !
      </p>
      <Button 
        onClick={() => navigate('/workout')}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5"
      >
        💡 Commencer votre première séance pour démarrer votre série !
      </Button>
    </Card>
  );
};

export default StarterSection;

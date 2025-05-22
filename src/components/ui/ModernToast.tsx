
import React from 'react';
import { toast } from '@/components/ui/sonner';
import { CheckCircle, AlertCircle, Info, Zap } from 'lucide-react';

interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'achievement';
  title: string;
  description?: string;
  duration?: number;
}

export const showModernToast = ({ type, title, description, duration = 4000 }: ToastOptions) => {
  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
    achievement: <Zap className="text-yellow-500" size={20} />
  };

  const styles = {
    success: 'border-green-200 bg-green-50',
    error: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50',
    achievement: 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50'
  };

  toast(title, {
    description,
    duration,
    icon: icons[type],
    className: `${styles[type]} border-2`,
    style: {
      borderRadius: '12px',
      padding: '16px',
    }
  });

  // Ajouter un effet sonore pour les achievements
  if (type === 'achievement') {
    // Vous pouvez ajouter un son ici si vous le souhaitez
  }
};

// Fonctions utilitaires
export const successToast = (title: string, description?: string) => 
  showModernToast({ type: 'success', title, description });

export const achievementToast = (title: string, description?: string) => 
  showModernToast({ type: 'achievement', title, description, duration: 6000 });

export const infoToast = (title: string, description?: string) => 
  showModernToast({ type: 'info', title, description });

export const errorToast = (title: string, description?: string) => 
  showModernToast({ type: 'error', title, description });


// Tailwind animations configuration
export const keyframes = {
  // Animations de base (héritées)
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' }
  },
  'accordion-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' }
  },
  
  // === ANIMATIONS FITNESS AVEC PRÉFIXE 'fit-' ===
  
  // Animations d'entraînement
  'fit-heartbeat': {
    '0%, 100%': { 
      transform: 'scale(1)',
      opacity: '1'
    },
    '50%': { 
      transform: 'scale(1.05)',
      opacity: '0.9'
    }
  },
  
  'fit-pulse-strong': {
    '0%, 100%': { 
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)'
    },
    '50%': { 
      transform: 'scale(1.02)',
      boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)'
    }
  },
  
  // Animations de progression
  'fit-progress-fill': {
    '0%': { width: '0%' },
    '100%': { width: 'var(--progress-value, 0%)' }
  },
  
  'fit-level-up': {
    '0%': { 
      transform: 'scale(1) rotate(0deg)',
      opacity: '1'
    },
    '50%': { 
      transform: 'scale(1.2) rotate(180deg)',
      opacity: '0.8'
    },
    '100%': { 
      transform: 'scale(1) rotate(360deg)',
      opacity: '1'
    }
  },
  
  // Animations de feedback
  'fit-success-bounce': {
    '0%, 100%': { transform: 'translateY(0)' },
    '25%': { transform: 'translateY(-10px) scale(1.05)' },
    '50%': { transform: 'translateY(0) scale(1.1)' },
    '75%': { transform: 'translateY(-5px) scale(1.02)' }
  },
  
  'fit-error-shake': {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
  },
  
  // Animations de motivation
  'fit-achievement-glow': {
    '0%, 100%': { 
      boxShadow: '0 0 5px rgba(245, 158, 11, 0.5)',
      transform: 'scale(1)'
    },
    '50%': { 
      boxShadow: '0 0 20px rgba(245, 158, 11, 0.8), 0 0 30px rgba(245, 158, 11, 0.6)',
      transform: 'scale(1.02)'
    }
  },
  
  'fit-streak-fire': {
    '0%, 100%': { 
      transform: 'rotate(-1deg) scale(1)',
      filter: 'hue-rotate(0deg)'
    },
    '33%': { 
      transform: 'rotate(1deg) scale(1.02)',
      filter: 'hue-rotate(10deg)'
    },
    '66%': { 
      transform: 'rotate(-1deg) scale(0.98)',
      filter: 'hue-rotate(-10deg)'
    }
  },
  
  // Animations de transition
  'fit-slide-up': {
    '0%': { 
      transform: 'translateY(20px)',
      opacity: '0'
    },
    '100%': { 
      transform: 'translateY(0)',
      opacity: '1'
    }
  },
  
  'fit-fade-in-scale': {
    '0%': { 
      transform: 'scale(0.9)',
      opacity: '0'
    },
    '100%': { 
      transform: 'scale(1)',
      opacity: '1'
    }
  },
  
  // Animation de chargement
  'fit-loading-bars': {
    '0%, 100%': { transform: 'scaleY(0.4)' },
    '50%': { transform: 'scaleY(1)' }
  }
};

export const animation = {
  // Animations de base
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  
  // === ANIMATIONS FITNESS ===
  
  // Entraînement
  'fit-heartbeat': 'fit-heartbeat 1.5s ease-in-out infinite',
  'fit-pulse-strong': 'fit-pulse-strong 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  
  // Progression
  'fit-progress-fill': 'fit-progress-fill 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  'fit-level-up': 'fit-level-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
  
  // Feedback
  'fit-success-bounce': 'fit-success-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'fit-error-shake': 'fit-error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
  
  // Motivation
  'fit-achievement-glow': 'fit-achievement-glow 2s ease-in-out infinite',
  'fit-streak-fire': 'fit-streak-fire 1.5s ease-in-out infinite',
  
  // Transitions
  'fit-slide-up': 'fit-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  'fit-fade-in-scale': 'fit-fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  
  // Chargement avec délais en série
  'fit-loading-bars': 'fit-loading-bars 1s ease-in-out infinite',
  'fit-loading-bars-delay-1': 'fit-loading-bars 1s ease-in-out 0.1s infinite',
  'fit-loading-bars-delay-2': 'fit-loading-bars 1s ease-in-out 0.2s infinite',
};

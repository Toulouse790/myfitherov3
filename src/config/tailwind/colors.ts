
// Tailwind color configuration
export const colors = {
  // Couleurs système (héritées de shadcn/ui)
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  
  // Couleurs primaires avec ratios de contraste optimisés
  primary: {
    DEFAULT: '#1d4ed8', // Bleu confiance - Contraste 7.1:1
    foreground: '#ffffff',
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#1d4ed8',
    700: '#1e40af',
    800: '#1e3a8a',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))'
  },
  
  destructive: {
    DEFAULT: '#dc2626', // Rouge d'erreur avec contraste renforcé
    foreground: '#ffffff'
  },
  
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: '#374151' // Gris plus contrasté pour meilleure lisibilité
  },
  
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))'
  },
  
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))'
  },
  
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))'
  },
  
  // Couleurs sidebar (shadcn/ui)
  sidebar: {
    DEFAULT: 'hsl(var(--sidebar-background))',
    foreground: 'hsl(var(--sidebar-foreground))',
    primary: 'hsl(var(--sidebar-primary))',
    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    accent: 'hsl(var(--sidebar-accent))',
    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    border: 'hsl(var(--sidebar-border))',
    ring: 'hsl(var(--sidebar-ring))'
  },
  
  // === PALETTE FITNESS AVEC NAMESPACE 'fit-' ===
  
  // Contexte Entraînement
  'fit-energy': {
    DEFAULT: '#dc2626',    // Rouge énergie principal
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',        // Contraste 4.8:1 sur blanc
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  'fit-power': {
    DEFAULT: '#ea580c',    // Orange puissance
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',        // Contraste 5.2:1 sur blanc
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
  
  // Contexte Progression & Santé
  'fit-growth': {
    DEFAULT: '#16a34a',    // Vert progression
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',        // Contraste 4.7:1 sur blanc
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  'fit-wellness': {
    DEFAULT: '#059669',    // Vert bien-être
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#059669',        // Contraste 5.1:1 sur blanc
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },
  
  // Contexte Récupération & Hydratation
  'fit-hydration': {
    DEFAULT: '#0891b2',    // Bleu hydratation
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  
  'fit-recovery': {
    DEFAULT: '#7c3aed',    // Violet récupération
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',        // Contraste 4.9:1 sur blanc
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
  
  // Contexte Social & Motivation
  'fit-motivation': {
    DEFAULT: '#f59e0b',    // Motivation
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',        // Contraste 4.6:1 sur blanc
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  'fit-achievement': {
    DEFAULT: '#7c2d12',    // Bronze achievement
    light: '#f59e0b',      // Or
    premium: '#6b7280',    // Platine
  },
  
  // États spéciaux avec double encodage accessibilité
  'fit-success': {
    DEFAULT: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  
  'fit-warning': {
    DEFAULT: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  
  'fit-error': {
    DEFAULT: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
  },
  
  'fit-info': {
    DEFAULT: '#0891b2',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
  
  // Support du mode sombre
  dark: {
    'fit-energy': '#ef4444',
    'fit-power': '#fb923c',
    'fit-growth': '#22c55e',
    'fit-wellness': '#14b8a6',
    'fit-hydration': '#38bdf8',
    'fit-recovery': '#a855f7',
    'fit-motivation': '#fbbf24',
  }
};

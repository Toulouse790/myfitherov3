
// Tailwind screens configuration
export const screens = {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1400px',
  // Breakpoints spécifiques fitness
  'watch': '300px',      // Montres connectées
  'tablet-portrait': '768px',
  'tablet-landscape': '1024px',
  'tv': '1920px',        // Interfaces TV/coaching
};

export const container = {
  center: true,
  padding: {
    DEFAULT: '1rem',
    sm: '2rem',
    lg: '4rem',
    xl: '5rem',
    '2xl': '6rem',
  },
  screens,
};

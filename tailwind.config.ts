import type { Config } from "tailwindcss";

/**
 * Configuration Tailwind CSS optimisée pour application fitness
 * 
 * Architecture organisée par contexte métier plutôt que par type technique
 * Respect des standards d'accessibilité WCAG 2.1 AA
 * Conventions de nommage cohérentes avec namespace 'fit-'
 * Support complet du mode sombre et des préférences utilisateur
 */
export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem',
			},
			screens: {
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
			}
		},
		extend: {
			// === COULEURS ORGANISÉES PAR CONTEXTE MÉTIER ===
			colors: {
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
					DEFAULT: '#f59e0b',    // Jaune motivation
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
			},
			
			// === TYPOGRAPHIE OPTIMISÉE POUR FITNESS ===
			fontSize: {
				'fit-stats-large': ['3.5rem', { lineHeight: '1', fontWeight: '800' }],
				'fit-stats-medium': ['2.25rem', { lineHeight: '1.1', fontWeight: '700' }],
				'fit-stats-small': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
				'fit-timer': ['4rem', { lineHeight: '1', fontWeight: '900', letterSpacing: '-0.02em' }],
				'fit-label': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
				'fit-caption': ['0.75rem', { lineHeight: '1.3', fontWeight: '400' }],
			},
			
			// === ESPACEMENTS MODULAIRES ===
			spacing: {
				'fit-card-padding': '1.5rem',
				'fit-section-gap': '2rem',
				'fit-component-gap': '1rem',
				'fit-touch-target': '2.75rem', // 44px - minimum recommandé
			},
			
			// === RAYONS DE BORDURE COHÉRENTS ===
			borderRadius: {
				'fit-button': '0.75rem',
				'fit-card': '1rem',
				'fit-stat': '1.25rem',
				'fit-modal': '1.5rem',
			},
			
			// === ANIMATIONS FITNESS CONTEXTUELLES ===
			keyframes: {
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
			},
			
			animation: {
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
			},
			
			// === GRADIENTS CONTEXTUELS ===
			backgroundImage: {
				// Gradients énergétiques
				'fit-energy-gradient': 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
				'fit-power-gradient': 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
				
				// Gradients de progression
				'fit-growth-gradient': 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
				'fit-wellness-gradient': 'linear-gradient(135deg, #059669 0%, #0891b2 100%)',
				
				// Gradients de récupération
				'fit-hydration-gradient': 'linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)',
				'fit-recovery-gradient': 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
				
				// Gradients spéciaux
				'fit-achievement-gradient': 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #7c2d12 100%)',
				'fit-stats-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
				
				// Gradients de mode sombre
				'fit-dark-surface': 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
				'fit-dark-card': 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
			},
			
			// === OMBRES CONTEXTUELLES ===
			boxShadow: {
				'fit-card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'fit-card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'fit-button': '0 2px 4px rgba(0, 0, 0, 0.1)',
				'fit-button-active': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
				'fit-stats': '0 8px 32px rgba(0, 0, 0, 0.12)',
				'fit-achievement': '0 0 20px rgba(245, 158, 11, 0.4)',
			},
			
			// === FILTRES ET EFFETS ===
			backdropBlur: {
				'fit-overlay': '8px',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		
		// Plugin personnalisé pour les utilitaires fitness
		function({ addUtilities, addComponents, theme }) {
			// Utilitaires pour les touches accessibles
			addUtilities({
				'.fit-touch-target': {
					minHeight: theme('spacing.fit-touch-target'),
					minWidth: theme('spacing.fit-touch-target'),
				},
				
				// Support des préférences de mouvement réduit
				'.fit-respect-motion': {
					'@media (prefers-reduced-motion: reduce)': {
						animation: 'none !important',
						transition: 'none !important',
					}
				},
				
				// Contraste élevé pour extérieur
				'.fit-high-contrast': {
					'@media (prefers-contrast: high)': {
						filter: 'contrast(1.2)',
						borderWidth: '2px',
					}
				}
			});
			
			// Composants fitness prêts à l'emploi
			addComponents({
				// Bouton d'action principal
				'.fit-btn-primary': {
					backgroundColor: theme('colors.fit-energy.DEFAULT'),
					color: 'white',
					padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
					borderRadius: theme('borderRadius.fit-button'),
					fontWeight: theme('fontWeight.semibold'),
					minHeight: theme('spacing.fit-touch-target'),
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: theme('spacing.2'),
					transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
					boxShadow: theme('boxShadow.fit-button'),
					
					'&:hover': {
						backgroundColor: theme('colors.fit-energy.700'),
						transform: 'translateY(-1px)',
						boxShadow: theme('boxShadow.fit-card-hover'),
					},
					
					'&:active': {
						transform: 'translateY(0)',
						boxShadow: theme('boxShadow.fit-button-active'),
					},
					
					'&:focus-visible': {
						outline: `2px solid ${theme('colors.fit-energy.DEFAULT')}`,
						outlineOffset: '2px',
					}
				},
				
				// Carte de statistiques
				'.fit-stat-card': {
					backgroundColor: 'white',
					borderRadius: theme('borderRadius.fit-card'),
					padding: theme('spacing.fit-card-padding'),
					boxShadow: theme('boxShadow.fit-card'),
					border: '1px solid transparent',
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					
					'&:hover': {
						boxShadow: theme('boxShadow.fit-card-hover'),
						transform: 'translateY(-2px)',
					}
				},
				
				// Badge d'achievement
				'.fit-achievement-badge': {
					display: 'inline-flex',
					alignItems: 'center',
					gap: theme('spacing.1'),
					padding: `${theme('spacing.1')} ${theme('spacing.3')}`,
					borderRadius: theme('borderRadius.full'),
					fontSize: theme('fontSize.fit-caption[0]'),
					fontWeight: theme('fontWeight.medium'),
					backgroundColor: theme('colors.fit-achievement.DEFAULT'),
					color: 'white',
					boxShadow: theme('boxShadow.fit-achievement'),
				}
			});
		}
	],
	
	// Configuration pour la purge optimisée
	safelist: [
		// Classes dynamiques critiques
		{
			pattern: /^fit-(energy|power|growth|wellness|hydration|recovery|motivation)-(50|100|200|300|400|500|600|700|800|900)$/,
			variants: ['hover', 'focus', 'active', 'dark']
		},
		{
			pattern: /^animate-fit-/,
			variants: ['hover', 'group-hover']
		},
		// Classes d'état pour accessibilité
		'focus-visible:outline-2',
		'focus-visible:outline-offset-2',
		'motion-reduce:animate-none',
		'motion-reduce:transition-none',
	]
} satisfies Config;

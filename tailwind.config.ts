
import type { Config } from "tailwindcss";
import { colors } from "./src/config/tailwind/colors";
import { keyframes, animation } from "./src/config/tailwind/animations";
import { fontSize } from "./src/config/tailwind/typography";
import { spacing, borderRadius } from "./src/config/tailwind/spacing";
import { backgroundImage, boxShadow, backdropBlur } from "./src/config/tailwind/effects";
import { container } from "./src/config/tailwind/screens";

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
		container,
		extend: {
			colors,
			fontSize,
			spacing,
			borderRadius,
			keyframes,
			animation,
			backgroundImage,
			boxShadow,
			backdropBlur,
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

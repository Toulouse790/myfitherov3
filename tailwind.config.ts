
import type { Config } from "tailwindcss";

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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2563eb', // Bleu énergie
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
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
				// Nouvelle palette moderne SANS JAUNE
				fitness: {
					primary: '#2563eb',    // Bleu énergie
					sport: '#dc2626',      // Rouge passion
					nutrition: '#16a34a',  // Vert nature
					hydration: '#0891b2',  // Bleu cyan
					sleep: '#7c3aed'       // Violet nuit
				}
			},
			borderRadius: {
				lg: '1rem',        // Cards avec border-radius plus moderne
				md: '0.75rem',
				sm: '0.5rem',
				xl: '1.25rem',
				'2xl': '1.5rem'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'slide-in-from-bottom-5': {
					'0%': { transform: 'translateY(5%)' },
					'100%': { transform: 'translateY(0)' }
				},
				'pulse-highlight': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8', backgroundColor: 'var(--highlight-bg)' }
				},
				'gradient-flow': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-soft': 'pulse-soft 3s infinite ease-in-out',
				'float': 'float 6s infinite ease-in-out',
				'slide-in-from-bottom-5': 'slide-in-from-bottom-5 0.3s ease-out',
				'pulse-highlight': 'pulse-highlight 2s ease-in-out',
				'gradient-flow': 'gradient-flow 3s ease infinite'
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
				'gradient-sport': 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
				'gradient-nutrition': 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
				'gradient-hydration': 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
				'gradient-sleep': 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

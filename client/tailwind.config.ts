import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        insanibc: ['Insanibc', 'system-ui', 'Arial', 'sans-serif'],
        body: [
          'Now-Regular',
          'system-ui',
          'Avenir',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        sans: [
          'Now-Regular',
          'system-ui',
          'Avenir',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        // Custom green palette inspired by the design
        grow: {
          50: '#f0fdf4', // Very light green
          100: '#dcfce7', // Light mint green
          200: '#bbf7d0', // Lighter green
          300: '#86efac', // Light green
          400: '#4ade80', // Medium green
          500: '#22c55e', // Primary green
          600: '#16a34a', // Main brand green
          700: '#15803d', // Dark green
          800: '#166534', // Darker green
          900: '#14532d', // Very dark green
          950: '#052e16', // Deepest green
        },
        // Nature-inspired accent colors
        nature: {
          mint: '#dcfce7',
          forest: '#15803d',
          sage: '#84cc16',
          emerald: '#10b981',
          leaf: '#22c55e',
        },
        // Gradient colors for backgrounds
        gradient: {
          'green-light': '#f0fdf4',
          'green-medium': '#dcfce7',
          'yellow-green': '#ecfdf5',
        },
      },
      backgroundImage: {
        'green-gradient':
          'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #ecfdf5 100%)',
        'nature-gradient':
          'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
        'hero-gradient':
          'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 25%, #bbf7d0 50%, #86efac 75%, #22c55e 100%)',
      },
      animation: {
        'pulse-green': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-green': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
};

export default config;

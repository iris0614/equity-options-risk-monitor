/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F7FA',
        navy: {
          DEFAULT: '#0F1C2E',
          muted: '#3D4F66',
          soft: '#5A6B7F',
        },
        line: '#D8DEE8',
        panel: '#FFFFFF',
        ok: '#1A7F37',
        warn: '#B45309',
        danger: '#B91C1C',
        accent: '#1D4ED8',
      },
      fontFamily: {
        sans: [
          'IBM Plex Sans',
          'Source Sans 3',
          'Segoe UI',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        monitor: '1600px',
      },
      boxShadow: {
        panel: '0 1px 2px rgba(15, 28, 46, 0.04), 0 1px 3px rgba(15, 28, 46, 0.06)',
      },
    },
  },
  plugins: [],
};

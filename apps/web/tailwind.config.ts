import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F7FAFF',
        surface: '#FFFFFF',
        'surface-tint': '#EAF3FF',
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          soft: '#DBEAFE',
          glow: 'rgba(37, 99, 235, 0.15)',
        },
        slate: {
          DEFAULT: '#0F172A',
          muted: '#475569',
          light: '#64748B',
        },
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'card-hover': '0 12px 30px -4px rgba(37, 99, 235, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        glow: '0 0 60px 20px rgba(37, 99, 235, 0.18)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;

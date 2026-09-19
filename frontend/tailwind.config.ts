import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0F14',
        panel: '#111821',
        raised: '#18212C',
        line: '#253140',
        muted: '#8B98A8',
        electric: '#4F8CFF',
        violet: '#7C5CFC',
        mint: '#35C98B'
      }
    }
  },
  plugins: []
};

export default config;

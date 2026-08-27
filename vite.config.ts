import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` est relatif pour que le build fonctionne quel que soit le sous-chemin
// d'hébergement (racine, /cidr/, GitHub Pages, etc.).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'dist', sourcemap: false },
});

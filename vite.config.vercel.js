import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// Standalone SPA build config for Vercel deployment
export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});

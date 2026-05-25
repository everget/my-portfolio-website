import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const port = Number(env.VITE_DEV_PORT) || 5173;
    const base = env.VITE_BASE_PATH || '/';

    return {
        base,
        plugins: [
            react(),
            babel({ presets: [reactCompilerPreset({ target: '19' })] }),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            watch: {
                usePolling: true,
            },
            host: true,
            strictPort: true,
            port,
        },
    };
});

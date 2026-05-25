import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const SCRIPT_EXTENSIONS = '{,m,c}{j,t}s{,x}';

// https://vitest.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/unit/setup.ts', './tests/unit/components/setup.ts'],
        include: [
            `src/**/*.{test,spec}.${SCRIPT_EXTENSIONS}`,
            `tests/unit/**/*.{test,spec}.${SCRIPT_EXTENSIONS}`,
        ],
        coverage: {
            provider: 'v8' as const,
            reporter: ['text', 'json', 'html'],
        },
    },
});

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppWithProviders } from './app.tsx';
import './global.css';

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <AppWithProviders />
    </StrictMode>,
);

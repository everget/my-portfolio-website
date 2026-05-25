import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { PreferencesProvider } from '@/modules/preferences/preferences-context';
import { I18nProvider } from '@/modules/shared/i18n/i18n-context';
import { ThemeToggleButton } from '@/modules/preferences/ui/theme-toggle-button';
import type { Theme } from '@/modules/preferences/domain/theme';
import {
    STORAGE_KEY,
    DEFAULT_PREFERENCES,
} from '@/modules/preferences/infrastructure/local-storage-preferences-repository';

// Set up localStorage BEFORE rendering so PreferencesProvider reads correct initial state
function renderButton(initialTheme: Theme = 'dark') {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...DEFAULT_PREFERENCES, theme: initialTheme }),
    );
    render(
        <PreferencesProvider>
            <I18nProvider locale="en">
                <ThemeToggleButton />
            </I18nProvider>
        </PreferencesProvider>,
    );
}

describe('ThemeToggleButton', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.setAttribute('class', '');
    });

    it('renders a button', () => {
        renderButton();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has an accessible name related to theme switching', () => {
        renderButton();
        expect(screen.getByRole('button').getAttribute('aria-label')).toMatch(
            /[Ss]witch to (light|dark) theme/,
        );
    });

    it('labels the button "switch to light" when dark theme is active', () => {
        renderButton('dark');
        expect(screen.getByRole('button')).toHaveAccessibleName('Switch to light theme');
    });

    it('labels the button "switch to dark" when light theme is active', () => {
        renderButton('light');
        expect(screen.getByRole('button')).toHaveAccessibleName('Switch to dark theme');
    });

    it('toggles the accessible name on click', () => {
        renderButton('dark');
        const button = screen.getByRole('button');

        expect(button).toHaveAccessibleName('Switch to light theme');
        fireEvent.click(button);
        expect(button).toHaveAccessibleName('Switch to dark theme');
        fireEvent.click(button);
        expect(button).toHaveAccessibleName('Switch to light theme');
    });

    it('syncs the dark class on the document root', () => {
        renderButton('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);

        fireEvent.click(screen.getByRole('button'));
        expect(document.documentElement.classList.contains('dark')).toBe(false);

        fireEvent.click(screen.getByRole('button'));
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('persists the toggled theme to localStorage', () => {
        renderButton('dark');
        fireEvent.click(screen.getByRole('button'));

        const stored = localStorage.getItem(STORAGE_KEY);
        expect(stored).toBeTruthy();
        expect(JSON.parse(stored!).theme).toBe('light');
    });
});

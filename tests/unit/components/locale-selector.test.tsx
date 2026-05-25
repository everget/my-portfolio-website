import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { PreferencesProvider } from '@/modules/preferences/preferences-context';
import { I18nProvider } from '@/modules/shared/i18n/i18n-context';
import { LocaleSelector } from '@/modules/preferences/ui/locale-selector';
import {
    STORAGE_KEY,
    DEFAULT_PREFERENCES,
} from '@/modules/preferences/infrastructure/local-storage-preferences-repository';

function renderSelector() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
    render(
        <PreferencesProvider>
            <I18nProvider locale="en">
                <LocaleSelector />
            </I18nProvider>
        </PreferencesProvider>,
    );
}

describe('LocaleSelector', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.setAttribute('class', '');
    });

    it('renders the trigger button', () => {
        renderSelector();
        expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
    });

    it('shows the current locale title on the trigger', () => {
        renderSelector();
        const trigger = screen.getAllByRole('button')[0];
        expect(trigger.textContent).toContain('English');
    });

    it('opens the menu on trigger click', () => {
        renderSelector();
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('closes the menu on a second trigger click', () => {
        renderSelector();
        const trigger = screen.getAllByRole('button')[0];
        fireEvent.click(trigger);
        fireEvent.click(trigger);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes the menu on Escape key', () => {
        renderSelector();
        fireEvent.click(screen.getAllByRole('button')[0]);
        fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('renders all seventeen locale options when open', () => {
        renderSelector();
        fireEvent.click(screen.getAllByRole('button')[0]);

        const menu = screen.getByRole('menu');
        expect(within(menu).getAllByRole('menuitem')).toHaveLength(17);

        for (const name of [
            'English',
            'Español',
            'Français',
            'Deutsch',
            'Português',
            'Українська',
            'Русский',
            'Հայերեն',
            '中文',
            '日本語',
            'Türkçe',
            'العربية',
            'עברית',
            'ქართული',
            'Italiano',
            'Polski',
            'हिंदी',
        ]) {
            expect(within(menu).getByText(name)).toBeInTheDocument();
        }
    });

    it('closes the menu when a locale is selected', () => {
        renderSelector();
        fireEvent.click(screen.getAllByRole('button')[0]);
        fireEvent.click(screen.getByText('Español').closest('button')!);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('updates the displayed locale title when a locale is selected', () => {
        renderSelector();
        const trigger = screen.getAllByRole('button')[0];

        fireEvent.click(trigger);
        fireEvent.click(screen.getByText('Español').closest('button')!);

        expect(trigger.textContent).toContain('Español');
    });

    it('persists the selected locale to localStorage', () => {
        renderSelector();
        fireEvent.click(screen.getAllByRole('button')[0]);
        fireEvent.click(screen.getByText('Español').closest('button')!);

        const stored = localStorage.getItem(STORAGE_KEY);
        expect(stored).toBeTruthy();
        expect(JSON.parse(stored!).locale).toBe('es');
    });
});

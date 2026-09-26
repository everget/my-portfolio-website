import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    LocalStoragePreferencesRepository,
    STORAGE_KEY,
} from '@/modules/preferences/infrastructure/local-storage-preferences-repository';

function loadWith(stored: Record<string, unknown>, browserLanguage: string) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(browserLanguage);
    return new LocalStoragePreferencesRepository().load();
}

describe('LocalStoragePreferencesRepository', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('keeps a valid stored locale regardless of browser language', () => {
        expect(loadWith({ theme: 'dark', locale: 'pt-pt' }, 'en-US').locale).toBe('pt-pt');
    });

    // 'en' was stored before the en-gb/en-us split
    it.each([
        ['en-GB', 'en-gb'],
        ['en-US', 'en-us'],
        ['en-AU', 'en-us'],
        ['de-DE', 'en-us'],
    ])('migrates a legacy "en" with browser %s to %s', (browserLanguage, expected) => {
        expect(loadWith({ theme: 'light', locale: 'en' }, browserLanguage).locale).toBe(expected);
    });

    it('falls back to the default locale for an unknown stored value', () => {
        expect(loadWith({ theme: 'light', locale: 'xx' }, 'fr-FR').locale).toBe('en-us');
    });

    it('detects the locale from the browser when nothing is stored', () => {
        vi.spyOn(navigator, 'language', 'get').mockReturnValue('pt-PT');
        expect(new LocalStoragePreferencesRepository().load().locale).toBe('pt-pt');
    });
});

import type {
    Preferences,
    PreferencesRepository,
} from '@/modules/preferences/domain/preferences-repository';
import { VALID_THEMES, type Theme } from '@/modules/preferences/domain/theme';
import { DEFAULT_LOCALE, VALID_LOCALES, type Locale } from '@/modules/preferences/domain/locale';
import { detectSystemTheme } from '@/modules/preferences/infrastructure/detect-system-theme';
import { detectLocaleFromBrowser } from '@/modules/shared/i18n/locales';

export const STORAGE_KEY = 'vite-react:preferences';

export const DEFAULT_PREFERENCES: Preferences = {
    theme: 'light',
    locale: DEFAULT_LOCALE,
};

function resolveStoredLocale(raw: unknown): Locale {
    if (typeof raw !== 'string') return DEFAULT_PREFERENCES.locale;
    if ((VALID_LOCALES as readonly string[]).includes(raw)) return raw as Locale;
    // 'en' predates the en-gb/en-us split - stay in English, taking the variant from the browser
    if (raw === 'en') {
        return detectLocaleFromBrowser(navigator.language) === 'en-gb' ? 'en-gb' : 'en-us';
    }
    return DEFAULT_PREFERENCES.locale;
}

export class LocalStoragePreferencesRepository implements PreferencesRepository {
    load(): Preferences {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                // No preferences saved yet - detect both from the environment
                return {
                    theme: detectSystemTheme(),
                    locale: detectLocaleFromBrowser(navigator.language),
                };
            }

            const parsed = JSON.parse(raw) as Record<string, unknown>;
            const { theme: rawTheme, locale: rawLocale } = parsed;

            const theme: Theme =
                typeof rawTheme === 'string' &&
                (VALID_THEMES as readonly string[]).includes(rawTheme)
                    ? (rawTheme as Theme)
                    : DEFAULT_PREFERENCES.theme;

            return { theme, locale: resolveStoredLocale(rawLocale) };
        } catch {
            return DEFAULT_PREFERENCES;
        }
    }

    save(prefs: Preferences): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        } catch {
            // Silently ignore storage quota errors
        }
    }
}

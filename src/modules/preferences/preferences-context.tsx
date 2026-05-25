import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
    createElement,
} from 'react';
import type { Preferences } from '@/modules/preferences/domain/preferences-repository';
import {
    LocalStoragePreferencesRepository,
    STORAGE_KEY,
} from '@/modules/preferences/infrastructure/local-storage-preferences-repository';

const repository = new LocalStoragePreferencesRepository();

interface PreferencesContextValue {
    preferences: Preferences;
    setTheme: (theme: Preferences['theme']) => void;
    setLocale: (locale: Preferences['locale']) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
    const [preferences, setPreferences] = useState<Preferences>(() => repository.load());

    // Persist to localStorage whenever preferences change
    useEffect(() => {
        repository.save(preferences);
    }, [preferences]);

    // Sync .dark/.light classes used by global.css and Tailwind's dark: variant
    useEffect(() => {
        const isDark = preferences.theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('light', !isDark);

        // Listen to system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            // Only auto-update if user hasn't explicitly set a preference
            const hasUserPreference = localStorage.getItem(STORAGE_KEY) !== null;
            if (!hasUserPreference) {
                setPreferences((prev) => ({ ...prev, theme: e.matches ? 'dark' : 'light' }));
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [preferences.theme]);

    const value: PreferencesContextValue = {
        preferences,
        setTheme: (theme) => setPreferences((prev) => ({ ...prev, theme })),
        setLocale: (locale) => setPreferences((prev) => ({ ...prev, locale })),
    };

    return createElement(PreferencesContext.Provider, { value }, children);
}

export function usePreferences(): PreferencesContextValue {
    const ctx = useContext(PreferencesContext);
    if (!ctx) throw new Error('usePreferences() must be called inside <PreferencesProvider>');
    return ctx;
}

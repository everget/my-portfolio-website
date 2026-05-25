import type { Theme } from './theme';
import type { Locale } from './locale';

export interface Preferences {
    theme: Theme;
    locale: Locale;
}

export interface PreferencesRepository {
    load(): Preferences;
    save(prefs: Preferences): void;
}

export const VALID_LOCALES = [
    'en-us',
    'en-gb',
    'es',
    'fr',
    'de',
    'pt-br',
    'pt-pt',
    'uk',
    'ru',
    'hy',
    'zh',
    'ja',
    'tr',
    'ar',
    'he',
    'ka',
    'it',
    'pl',
    'hi',
    'nl',
    'id',
    'ms',
    'vi',
    'ko',
    'th',
] as const;
export type Locale = (typeof VALID_LOCALES)[number];

// Fallback when the browser language is unsupported or no preference is stored.
export const DEFAULT_LOCALE = 'en-us' satisfies Locale;

export interface LocalePreference {
    locale: Locale;
}

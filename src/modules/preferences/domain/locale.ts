export const VALID_LOCALES = [
    'en',
    'es',
    'fr',
    'de',
    'pt-br',
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
] as const;
export type Locale = (typeof VALID_LOCALES)[number];

export interface LocalePreference {
    locale: Locale;
}

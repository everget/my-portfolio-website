import type { Locale } from '@/modules/preferences/domain/locale';

function makeLocaleDescriptor<F extends string>(
    title: string,
    code: Locale,
    flag: F,
    dir: 'ltr' | 'rtl' = 'ltr',
) {
    return {
        title,
        code,
        dir,
        flagSrc: `./flags/${flag}.svg`,
        flagKey: `flags.${flag}` as `flags.${F}`,
    };
}

export const LOCALES = {
    // Latin
    en: makeLocaleDescriptor('English', 'en', 'en'),
    es: makeLocaleDescriptor('Español', 'es', 'es'),
    fr: makeLocaleDescriptor('Français', 'fr', 'fr'),
    de: makeLocaleDescriptor('Deutsch', 'de', 'de'),
    it: makeLocaleDescriptor('Italiano', 'it', 'it'),
    pl: makeLocaleDescriptor('Polski', 'pl', 'pl'),
    'pt-br': makeLocaleDescriptor('Português', 'pt-br', 'br'),
    tr: makeLocaleDescriptor('Türkçe', 'tr', 'tr'),
    // Cyrillic
    ru: makeLocaleDescriptor('Русский', 'ru', 'ru'),
    uk: makeLocaleDescriptor('Українська', 'uk', 'ua'),
    // Other
    hy: makeLocaleDescriptor('Հայերեն', 'hy', 'am'),
    ka: makeLocaleDescriptor('ქართული', 'ka', 'ge'),
    zh: makeLocaleDescriptor('中文', 'zh', 'cn'),
    ja: makeLocaleDescriptor('日本語', 'ja', 'jp'),
    ar: makeLocaleDescriptor('العربية', 'ar', 'sa', 'rtl'),
    he: makeLocaleDescriptor('עברית', 'he', 'il', 'rtl'),
    hi: makeLocaleDescriptor('हिंदी', 'hi', 'in'),
} satisfies Record<
    Locale,
    { title: string; code: Locale; flagSrc: string; flagKey: `flags.${string}` }
>;

export type LocaleDescriptor = (typeof LOCALES)[Locale];
export type FlagKey = LocaleDescriptor['flagKey'];

export const SUPPORTED_LOCALES = Object.keys(LOCALES) as Locale[];

// Maps BCP-47 primary language subtags to app locale codes.
const BROWSER_LANG_TO_LOCALE: Partial<Record<string, Locale>> = {
    en: 'en',
    es: 'es',
    fr: 'fr',
    de: 'de',
    pt: 'pt-br',
    uk: 'uk',
    ru: 'ru',
    hy: 'hy',
    zh: 'zh',
    ja: 'ja',
    tr: 'tr',
    ar: 'ar',
    he: 'he',
    ka: 'ka',
    it: 'it',
    pl: 'pl',
    hi: 'hi',
};

export function detectLocaleFromBrowser(browserLanguage: string, fallback: Locale = 'en'): Locale {
    const primaryTag = browserLanguage.toLowerCase().split('-')[0];
    return BROWSER_LANG_TO_LOCALE[primaryTag] ?? fallback;
}

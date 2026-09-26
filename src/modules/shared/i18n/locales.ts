import { DEFAULT_LOCALE, type Locale } from '@/modules/preferences/domain/locale';
import { publicAssetUrl } from '@/modules/shared/lib/utils';

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
        flagSrc: publicAssetUrl(`/flags/${flag}.svg`),
        flagKey: `flags.${flag}` as `flags.${F}`,
    };
}

// Flag stems are ISO 3166-1 alpha-2 country codes, so they often differ from the locale code.
export const LOCALES = {
    // Latin
    'en-gb': makeLocaleDescriptor('English (UK)', 'en-gb', 'gb'),
    'en-us': makeLocaleDescriptor('English (US)', 'en-us', 'us'),
    es: makeLocaleDescriptor('Español', 'es', 'es'),
    fr: makeLocaleDescriptor('Français', 'fr', 'fr'),
    de: makeLocaleDescriptor('Deutsch', 'de', 'de'),
    it: makeLocaleDescriptor('Italiano', 'it', 'it'),
    nl: makeLocaleDescriptor('Nederlands', 'nl', 'nl'),
    pl: makeLocaleDescriptor('Polski', 'pl', 'pl'),
    'pt-br': makeLocaleDescriptor('Português (Brasil)', 'pt-br', 'br'),
    'pt-pt': makeLocaleDescriptor('Português (Portugal)', 'pt-pt', 'pt'),
    tr: makeLocaleDescriptor('Türkçe', 'tr', 'tr'),
    id: makeLocaleDescriptor('Bahasa Indonesia', 'id', 'id'),
    ms: makeLocaleDescriptor('Bahasa Melayu', 'ms', 'my'),
    vi: makeLocaleDescriptor('Tiếng Việt', 'vi', 'vn'),
    // Cyrillic
    ru: makeLocaleDescriptor('Русский', 'ru', 'ru'),
    uk: makeLocaleDescriptor('Українська', 'uk', 'ua'),
    // Other
    hy: makeLocaleDescriptor('Հայերեն', 'hy', 'am'),
    ka: makeLocaleDescriptor('ქართული', 'ka', 'ge'),
    zh: makeLocaleDescriptor('中文', 'zh', 'cn'),
    ja: makeLocaleDescriptor('日本語', 'ja', 'jp'),
    ko: makeLocaleDescriptor('한국어', 'ko', 'kr'),
    th: makeLocaleDescriptor('ไทย', 'th', 'th'),
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

// Full language-region tags that select a regional variant.
const BROWSER_TAG_TO_LOCALE: Partial<Record<string, Locale>> = {
    'en-gb': 'en-gb',
    'en-us': 'en-us',
    'pt-br': 'pt-br',
    'pt-pt': 'pt-pt',
};

// Maps BCP-47 primary language subtags to app locale codes.
const BROWSER_LANG_TO_LOCALE: Partial<Record<string, Locale>> = {
    en: 'en-us',
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
    nl: 'nl',
    id: 'id',
    ms: 'ms',
    vi: 'vi',
    ko: 'ko',
    th: 'th',
    // Legacy ISO 639 codes still reported by some Java-based Android WebViews
    in: 'id',
    iw: 'he',
};

export function detectLocaleFromBrowser(
    browserLanguage: string,
    fallback: Locale = DEFAULT_LOCALE,
): Locale {
    const [language, ...subtags] = browserLanguage.toLowerCase().split('-');
    // Region is 2 letters or 3 digits - skips script subtags like "hans" in zh-Hans-CN
    const region = subtags.find((s) => /^([a-z]{2}|\d{3})$/.test(s));

    const regional = region ? BROWSER_TAG_TO_LOCALE[`${language}-${region}`] : undefined;
    if (regional) return regional;

    // CLDR makes pt-PT the parent of every non-Brazilian Portuguese locale (pt-AO, pt-MZ, ...)
    if (language === 'pt' && region) return 'pt-pt';

    return BROWSER_LANG_TO_LOCALE[language] ?? fallback;
}

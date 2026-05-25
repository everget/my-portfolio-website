import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { createTranslator, type Translator, type TranslationCatalog } from './translator';
import type { Locale } from '@/modules/preferences/domain/locale';
import enMessages from './locales/en.json';

type TranslationCatalogPromise = Promise<{ default: TranslationCatalog }>;

// en.json is statically imported - stays in the main bundle and serves as
// the initial catalog and fallback for all other locales.
// The remaining locales use dynamic imports so Vite emits each as a separate chunk.
const localeLoaders: Record<Exclude<Locale, 'en'>, () => TranslationCatalogPromise> = {
    es: () => import('./locales/es.json') as TranslationCatalogPromise,
    fr: () => import('./locales/fr.json') as TranslationCatalogPromise,
    de: () => import('./locales/de.json') as TranslationCatalogPromise,
    'pt-br': () => import('./locales/pt-br.json') as TranslationCatalogPromise,
    uk: () => import('./locales/uk.json') as TranslationCatalogPromise,
    ru: () => import('./locales/ru.json') as TranslationCatalogPromise,
    hy: () => import('./locales/hy.json') as TranslationCatalogPromise,
    zh: () => import('./locales/zh.json') as TranslationCatalogPromise,
    ja: () => import('./locales/ja.json') as TranslationCatalogPromise,
    tr: () => import('./locales/tr.json') as TranslationCatalogPromise,
    ar: () => import('./locales/ar.json') as TranslationCatalogPromise,
    he: () => import('./locales/he.json') as TranslationCatalogPromise,
    ka: () => import('./locales/ka.json') as TranslationCatalogPromise,
    it: () => import('./locales/it.json') as TranslationCatalogPromise,
    pl: () => import('./locales/pl.json') as TranslationCatalogPromise,
    hi: () => import('./locales/hi.json') as TranslationCatalogPromise,
};

const I18nContext = createContext<Translator | null>(null);

export function I18nProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
    const [catalog, setCatalog] = useState<TranslationCatalog>(enMessages);

    useEffect(() => {
        if (locale === 'en') {
            setCatalog(enMessages);
            return;
        }
        // Load the locale chunk; keep current catalog until it arrives to avoid
        // a flash of untranslated content during the fetch.
        void localeLoaders[locale]().then((m) => setCatalog(m.default));
    }, [locale]);

    const t = useMemo(() => createTranslator(catalog, locale), [catalog, locale]);

    return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>;
}

export function useT(): Translator {
    const t = useContext(I18nContext);
    if (!t) throw new Error('useT() must be called inside <I18nProvider>');
    return t;
}

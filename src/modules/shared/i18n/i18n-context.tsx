import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { createTranslator, type Translator, type TranslationCatalog } from './translator';
import type { Locale } from '@/modules/preferences/domain/locale';
import enMessages from './locales/en-us.json';

type TranslationCatalogPromise = Promise<{ default: TranslationCatalog }>;

// en-us.json is statically imported - stays in the main bundle and serves as
// the initial catalog and fallback for all other locales.
// The remaining locales use dynamic imports so Vite emits each as a separate chunk.
const localeLoaders: Record<Exclude<Locale, 'en-us'>, () => TranslationCatalogPromise> = {
    'en-gb': () => import('./locales/en-gb.json') as TranslationCatalogPromise,
    es: () => import('./locales/es.json') as TranslationCatalogPromise,
    fr: () => import('./locales/fr.json') as TranslationCatalogPromise,
    de: () => import('./locales/de.json') as TranslationCatalogPromise,
    'pt-br': () => import('./locales/pt-br.json') as TranslationCatalogPromise,
    'pt-pt': () => import('./locales/pt-pt.json') as TranslationCatalogPromise,
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
    nl: () => import('./locales/nl.json') as TranslationCatalogPromise,
    id: () => import('./locales/id.json') as TranslationCatalogPromise,
    ms: () => import('./locales/ms.json') as TranslationCatalogPromise,
    vi: () => import('./locales/vi.json') as TranslationCatalogPromise,
    ko: () => import('./locales/ko.json') as TranslationCatalogPromise,
    th: () => import('./locales/th.json') as TranslationCatalogPromise,
};

const I18nContext = createContext<Translator | null>(null);

export function I18nProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
    const [catalog, setCatalog] = useState<TranslationCatalog>(enMessages);

    useEffect(() => {
        if (locale === 'en-us') {
            // Deriving this during render would lose the "keep the current catalog
            // while the next one loads" behavior below, so it stays in the effect.
            // oxlint-disable-next-line react/set-state-in-effect
            setCatalog(enMessages);
            return;
        }
        // Load the locale chunk; keep current catalog until it arrives to avoid
        // a flash of untranslated content during the fetch.
        // `stale` guards against a slower earlier locale resolving last.
        let stale = false;
        void (async () => {
            try {
                const m = await localeLoaders[locale]();
                if (!stale) setCatalog(m.default);
            } catch {
                // A chunk can 404 after a redeploy, or fail on a flaky network.
                // Fall back to English rather than stranding the UI.
                if (!stale) setCatalog(enMessages);
            }
        })();
        return () => {
            stale = true;
        };
    }, [locale]);

    const t = useMemo(() => createTranslator(catalog, locale), [catalog, locale]);

    return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>;
}

export function useT(): Translator {
    const t = useContext(I18nContext);
    if (!t) throw new Error('useT() must be called inside <I18nProvider>');
    return t;
}

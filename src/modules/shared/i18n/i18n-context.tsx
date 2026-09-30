import {
    createContext,
    type ReactNode,
    use,
    useContext,
    useDeferredValue,
    useEffect,
    useMemo,
} from 'react';
import { createTranslator, type Translator, type TranslationCatalog } from './translator';
import type { Locale } from '@/modules/preferences/domain/locale';
import enMessages from './locales/en-us.json';

type LazyLocale = Exclude<Locale, 'en-us'>;
type TranslationCatalogPromise = Promise<{ default: TranslationCatalog }>;

// en-us.json is statically imported - stays in the main bundle and serves as
// the initial catalog and fallback for all other locales.
// The remaining locales use dynamic imports so Vite emits each as a separate chunk.
const localeLoaders: Record<LazyLocale, () => TranslationCatalogPromise> = {
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

// One promise per locale, so use() gets the same promise on every render.
const catalogCache = new Map<LazyLocale, Promise<TranslationCatalog>>();
const failedLocales = new Set<LazyLocale>();

function loadCatalog(locale: LazyLocale): Promise<TranslationCatalog> {
    let promise = catalogCache.get(locale);
    if (!promise) {
        promise = localeLoaders[locale]().then(
            (m) => m.default,
            () => {
                // A chunk can 404 after a redeploy, or fail on a flaky network.
                failedLocales.add(locale);
                return enMessages;
            },
        );
        catalogCache.set(locale, promise);
    }
    return promise;
}

// A failed load stays cached as English while it is requested or shown: reloading it
// there would suspend every re-render, and a chunk that keeps failing would be fetched
// again each time. Dropping it afterwards makes re-selecting that locale retry.
function forgetFailedLoads(keep: readonly Locale[]) {
    for (const locale of failedLocales) {
        if (!keep.includes(locale)) {
            failedLocales.delete(locale);
            catalogCache.delete(locale);
        }
    }
}

const I18nContext = createContext<Translator | null>(null);

export function I18nProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
    // Starts as en-us (first paint is English), then trails `locale`: React renders the
    // new locale in the background and keeps the current UI while it waits for a catalog.
    // Only those background renders can suspend, so no Suspense boundary is needed.
    const shownLocale = useDeferredValue(locale, 'en-us');
    const catalog = shownLocale === 'en-us' ? enMessages : use(loadCatalog(shownLocale));

    useEffect(() => {
        forgetFailedLoads([locale, shownLocale]);
    }, [locale, shownLocale]);

    // A failed load shows English, so it gets English plural rules too.
    const catalogLocale = catalog === enMessages ? 'en-us' : shownLocale;
    const t = useMemo(() => createTranslator(catalog, catalogLocale), [catalog, catalogLocale]);

    return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>;
}

export function useT(): Translator {
    const t = useContext(I18nContext);
    if (!t) throw new Error('useT() must be called inside <I18nProvider>');
    return t;
}

import enMessages from './locales/en.json';

// Plural-forms object — must have "other" as the universal fallback.
// The keys are the LDML plural categories returned by Intl.PluralRules.
export type PluralForms = { other: string } & Partial<Record<Intl.LDMLPluralRule, string>>;

// en.json is the canonical source for valid translation keys.
type EnMessages = typeof enMessages;

// A value is a leaf if it is a plain string OR a plural-forms object (has "other").
// Any other object is a namespace — keep recursing.
type IsLeaf<V> = V extends string ? true : V extends { other: string } ? true : false;

type DotPaths<T, P extends string = ''> = {
    [K in keyof T & string]: IsLeaf<T[K]> extends true
        ? P extends ''
            ? K
            : `${P}.${K}`
        : T[K] extends object
          ? DotPaths<T[K], P extends '' ? K : `${P}.${K}`>
          : P extends ''
            ? K
            : `${P}.${K}`;
}[keyof T & string];

export type TranslationKey = DotPaths<EnMessages>;
// Loose runtime type: each locale file may use plain strings OR plural-form objects.
export type TranslationCatalog = Record<string, unknown>;
export type Params = Record<string, string | number>;
export type Translator = (key: TranslationKey, params?: Params) => string;

// Traverse a nested catalog using a dot-separated key path.
// Returns either a plain string, a PluralForms object, or undefined.
function getPath(catalog: TranslationCatalog, path: string): string | PluralForms | undefined {
    const parts = path.split('.');
    let node: unknown = catalog;
    for (const part of parts) {
        if (typeof node !== 'object' || node === null) return undefined;
        node = (node as Record<string, unknown>)[part];
    }
    if (typeof node === 'string') return node;
    // Duck-type as PluralForms: any object with an "other" string key qualifies.
    if (
        node &&
        typeof node === 'object' &&
        'other' in node &&
        typeof (node as Record<string, unknown>)['other'] === 'string'
    ) {
        return node as PluralForms;
    }
    return undefined;
}

const missingKeys = new Set<string>();

export function createTranslator(catalog: TranslationCatalog, locale: string): Translator {
    // One PluralRules instance per translator — cheap to create, reused for all lookups.
    const pluralRules = new Intl.PluralRules(locale);

    return function t(key: TranslationKey, params?: Params): string {
        // Fallback chain: active catalog → English → key string
        const raw = getPath(catalog, key) ?? getPath(enMessages as TranslationCatalog, key);

        if (raw === undefined) {
            if (import.meta.env.DEV && !missingKeys.has(key)) {
                missingKeys.add(key);
                console.warn(`[i18n] Missing translation key: "${key}"`);
            }
            return key;
        }

        // Select the correct plural form when the value is a PluralForms object.
        let value: string;
        if (typeof raw === 'string') {
            value = raw;
        } else {
            const count =
                typeof params?.count === 'number' ? params.count : Number(params?.count ?? 0);
            const rule = pluralRules.select(count);
            value = raw[rule] ?? raw.other;
        }

        if (!params) return value;
        return value.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(params[k] ?? `{{${k}}}`));
    };
}

import { existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { VALID_LOCALES } from '@/modules/preferences/domain/locale';
import { detectLocaleFromBrowser, LOCALES } from '@/modules/shared/i18n/locales';
import enUs from '@/modules/shared/i18n/locales/en-us.json';

const catalogs = import.meta.glob<Record<string, unknown>>(
    '/src/modules/shared/i18n/locales/*.json',
    {
        eager: true,
        import: 'default',
    },
);

// Vitest runs from the project root, which is also what the root-relative glob above resolves against
const FLAGS_DIR = join(process.cwd(), 'public', 'flags');

// A plural-forms object counts as one leaf - languages need different plural categories.
function leafKeys(node: Record<string, unknown>, prefix = ''): string[] {
    return Object.entries(node).flatMap(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        const isLeaf =
            typeof value === 'string' ||
            (typeof value === 'object' && value !== null && 'other' in value);
        return isLeaf ? [path] : leafKeys(value as Record<string, unknown>, path);
    });
}

describe('locale catalogs', () => {
    it('has exactly one catalog per supported locale', () => {
        const codes = Object.keys(catalogs).map((file) => basename(file, '.json'));
        expect(codes.toSorted()).toEqual(VALID_LOCALES.toSorted());
    });

    it.each(Object.entries(catalogs))('%s has exactly the en-us keys', (_file, catalog) => {
        expect(leafKeys(catalog).toSorted()).toEqual(leafKeys(enUs).toSorted());
    });
});

describe('LOCALES', () => {
    it.each(Object.values(LOCALES))('$code flag exists in public/flags', ({ flagSrc }) => {
        expect(existsSync(join(FLAGS_DIR, basename(flagSrc)))).toBe(true);
    });
});

describe('detectLocaleFromBrowser', () => {
    it.each([
        ['en-US', 'en-us'],
        ['en-GB', 'en-gb'],
        ['en', 'en-us'],
        ['en-AU', 'en-us'],
        ['pt-BR', 'pt-br'],
        ['pt-PT', 'pt-pt'],
        ['pt', 'pt-br'],
        // Every non-Brazilian Portuguese region follows the European norm
        ['pt-AO', 'pt-pt'],
        ['pt-MZ', 'pt-pt'],
        // Script subtags are not mistaken for regions
        ['pt-Latn-BR', 'pt-br'],
        ['zh-Hans-CN', 'zh'],
        ['nl-BE', 'nl'],
        ['ms-MY', 'ms'],
        ['id-ID', 'id'],
        ['vi-VN', 'vi'],
        ['ko-KR', 'ko'],
        ['th-TH', 'th'],
        // Legacy ISO 639 codes from Java-based Android WebViews
        ['in-ID', 'id'],
        ['iw-IL', 'he'],
        // "my" is Burmese, not Malay - the Malaysian flag stem must not leak into detection
        ['my-MM', 'en-us'],
        ['sw-KE', 'en-us'],
        ['', 'en-us'],
    ])('%s -> %s', (browserLanguage, expected) => {
        expect(detectLocaleFromBrowser(browserLanguage)).toBe(expected);
    });

    it('returns the provided fallback for unsupported languages', () => {
        expect(detectLocaleFromBrowser('sw-KE', 'de')).toBe('de');
    });
});

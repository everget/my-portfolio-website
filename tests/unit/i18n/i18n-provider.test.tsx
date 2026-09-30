import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { Locale } from '@/modules/preferences/domain/locale';
import { I18nProvider, useT } from '@/modules/shared/i18n/i18n-context';

// Locale chunks are mocked with one-string catalogs. Gated ones stay "loading" until a
// test opens the gate. Italian fails once (flaky network); Hindi always fails, like a
// chunk that 404s after a redeploy.
const mocks = vi.hoisted(() => ({
    gates: {
        es: Promise.withResolvers<void>(),
        fr: Promise.withResolvers<void>(),
        ja: Promise.withResolvers<void>(),
        de: Promise.withResolvers<void>(),
    },
    italianLoads: 0,
    hindiLoads: 0,
    catalog: (greeting: string) => ({ default: { portfolio: { hero: { greeting } } } }),
}));

vi.mock('@/modules/shared/i18n/locales/es.json', async () => {
    await mocks.gates.es.promise;
    return mocks.catalog('Hola, soy Alex');
});
vi.mock('@/modules/shared/i18n/locales/fr.json', async () => {
    await mocks.gates.fr.promise;
    return mocks.catalog('Bonjour, je suis Alex');
});
vi.mock('@/modules/shared/i18n/locales/ja.json', async () => {
    await mocks.gates.ja.promise;
    return mocks.catalog('こんにちは、Alexです');
});
vi.mock('@/modules/shared/i18n/locales/de.json', async () => {
    await mocks.gates.de.promise;
    return mocks.catalog('Hallo, ich bin Alex');
});
vi.mock('@/modules/shared/i18n/locales/ru.json', async () => mocks.catalog('Привет, я Алекс'));
vi.mock('@/modules/shared/i18n/locales/pl.json', async () => mocks.catalog('Cześć, jestem Alex'));
vi.mock('@/modules/shared/i18n/locales/pt-br.json', async () => mocks.catalog('Olá, sou Alex'));
vi.mock('@/modules/shared/i18n/locales/it.json', async () => {
    mocks.italianLoads++;
    if (mocks.italianLoads === 1) throw new Error('Failed to fetch dynamically imported module');
    return mocks.catalog('Ciao, sono Alex');
});
vi.mock('@/modules/shared/i18n/locales/hi.json', async () => {
    mocks.hindiLoads++;
    throw new Error('Failed to fetch dynamically imported module');
});

const ENGLISH = "Hi, I'm Alex";

function Greeting() {
    const t = useT();
    return <h1>{t('portfolio.hero.greeting')}</h1>;
}

// Switches locale from a DOM event, so updates get the same (synchronous) priority as
// a click in the real locale selector.
function Harness({ initial }: { initial: Locale }) {
    const [locale, setLocale] = useState(initial);
    return (
        <>
            <input aria-label="locale" onChange={(e) => setLocale(e.target.value as Locale)} />
            <I18nProvider locale={locale}>
                <Greeting />
            </I18nProvider>
        </>
    );
}

async function renderHarness(initial: Locale) {
    await act(async () => render(<Harness initial={initial} />));
    return async (next: Locale) => {
        await act(async () =>
            fireEvent.change(screen.getByLabelText('locale'), { target: { value: next } }),
        );
    };
}

const heading = () => screen.getByRole('heading').textContent;

describe('I18nProvider', () => {
    it('renders en-us synchronously', () => {
        render(<Harness initial="en-us" />);
        expect(heading()).toBe(ENGLISH);
    });

    it('shows English first, then a non-English locale once its catalog loads', async () => {
        await renderHarness('es');
        expect(heading()).toBe(ENGLISH);

        await act(async () => mocks.gates.es.resolve());
        expect(await screen.findByText('Hola, soy Alex')).toBeInTheDocument();
    });

    it('keeps the current language on screen while the next catalog loads', async () => {
        const switchTo = await renderHarness('ru');
        await screen.findByText('Привет, я Алекс');

        // fr is still loading: Russian stays - no flash of English
        await switchTo('fr');
        expect(heading()).toBe('Привет, я Алекс');
        await act(async () => mocks.gates.fr.resolve());
        await screen.findByText('Bonjour, je suis Alex');

        // Back to English, then ja is still loading: English stays - never an older language
        await switchTo('en-us');
        expect(heading()).toBe(ENGLISH);
        await switchTo('ja');
        expect(heading()).toBe(ENGLISH);
        await act(async () => mocks.gates.ja.resolve());
        expect(await screen.findByText('こんにちは、Alexです')).toBeInTheDocument();
    });

    it('shows the latest selection even when an earlier catalog resolves last', async () => {
        const switchTo = await renderHarness('en-us');
        await switchTo('de');
        await switchTo('pl');
        expect(await screen.findByText('Cześć, jestem Alex')).toBeInTheDocument();

        await act(async () => mocks.gates.de.resolve());
        expect(heading()).toBe('Cześć, jestem Alex');
    });

    it('falls back to English when a catalog keeps failing, loading it only once', async () => {
        const switchTo = await renderHarness('en-us');
        await switchTo('hi');
        await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
        expect(heading()).toBe(ENGLISH);

        // Re-rendering while the failed locale is on screen must not reload it: with a
        // chunk that keeps failing, every reload would suspend the switch all over again.
        await switchTo('ru');
        expect(await screen.findByText('Привет, я Алекс')).toBeInTheDocument();
        expect(mocks.hindiLoads).toBe(1);
    });

    it('falls back to English when a catalog fails once, and retries when re-selected', async () => {
        const switchTo = await renderHarness('en-us');
        await switchTo('it');
        await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
        expect(heading()).toBe(ENGLISH);

        await switchTo('pt-br');
        await screen.findByText('Olá, sou Alex');
        await switchTo('it');
        expect(await screen.findByText('Ciao, sono Alex')).toBeInTheDocument();
        expect(mocks.italianLoads).toBe(2);
    });
});

import { useEffect, useRef, useState } from 'react';
import { usePreferences } from '@/modules/preferences/preferences-context';
import { useT } from '@/modules/shared/i18n/i18n-context';
import { LOCALES, SUPPORTED_LOCALES } from '@/modules/shared/i18n/locales';
import { Button } from '@/modules/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/shared/ui/popover';

export function LocaleSelector() {
    const t = useT();
    const { preferences, setLocale } = usePreferences();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const currentLocale = LOCALES[preferences.locale];

    // Sync lang and dir attributes on the document root
    useEffect(() => {
        document.documentElement.setAttribute('lang', preferences.locale);
        document.documentElement.setAttribute('dir', currentLocale.dir);
    }, [preferences.locale, currentLocale.dir]);

    function handleSelect(code: (typeof SUPPORTED_LOCALES)[number]) {
        setLocale(code);
        setIsOpen(false);
        triggerRef.current?.focus();
    }

    function handleOpenChange(open: boolean) {
        setIsOpen(open);
        if (open) {
            // Focus first menuitem once Radix portals the content into the DOM
            requestAnimationFrame(() => {
                const first = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
                first?.focus();
            });
        }
    }

    function handleMenuKeyDown(e: React.KeyboardEvent) {
        const items = Array.from(
            menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
        );
        if (!items.length) return;

        const current = items.indexOf(document.activeElement as HTMLElement);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                items[(current + 1) % items.length].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                items[(current - 1 + items.length) % items.length].focus();
                break;
            case 'Home':
                e.preventDefault();
                items[0].focus();
                break;
            case 'End':
                e.preventDefault();
                items[items.length - 1].focus();
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                triggerRef.current?.focus();
                break;
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    className="flex items-center"
                    aria-label={t('portfolio.header.selectLanguage')}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                >
                    <span className="inline-flex items-center">
                        <img
                            src={currentLocale.flagSrc}
                            alt={t(currentLocale.flagKey)}
                            className="h-5 w-5"
                        />
                        <span className="ml-2 text-sm">{currentLocale.title}</span>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-55 p-0" align="end">
                <div
                    ref={menuRef}
                    role="menu"
                    aria-label={t('portfolio.header.selectLanguage')}
                    className="grid max-h-80 gap-2 overflow-y-auto p-2"
                    tabIndex={-1}
                    onKeyDown={handleMenuKeyDown}
                >
                    {SUPPORTED_LOCALES.map((code) => {
                        const locale = LOCALES[code];
                        return (
                            <Button
                                key={code}
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => handleSelect(code)}
                                role="menuitem"
                                tabIndex={-1}
                                aria-current={preferences.locale === code ? true : undefined}
                            >
                                <img
                                    src={locale.flagSrc}
                                    alt={t(locale.flagKey)}
                                    className="h-5 w-5"
                                />
                                <span className="ml-2">{locale.title}</span>
                            </Button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}

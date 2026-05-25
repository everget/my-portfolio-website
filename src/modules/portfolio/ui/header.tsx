import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LocaleSelector } from '@/modules/preferences/ui/locale-selector';
import { ThemeToggleButton } from '@/modules/preferences/ui/theme-toggle-button';
import { useT } from '@/modules/shared/i18n/i18n-context';
import { Button } from '@/modules/shared/ui/button';

const NAV_ITEMS = [
    { key: 'portfolio.nav.about', href: '#about' },
    { key: 'portfolio.nav.projects', href: '#projects' },
    { key: 'portfolio.nav.skills', href: '#skills' },
] as const;

export function Header() {
    const t = useT();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close mobile menu on Escape
    useEffect(() => {
        if (!isMenuOpen) return;
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') setIsMenuOpen(false);
        }
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isMenuOpen]);

    function handleNavClick() {
        setIsMenuOpen(false);
    }

    return (
        <header className="bg-background/80 border-border/50 sticky top-0 z-50 w-full border-b backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between px-6 py-3">
                {/* Title */}
                <div className="text-foreground text-xl font-bold tracking-tight">
                    {t('portfolio.header.title')}
                </div>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
                    {NAV_ITEMS.map(({ key, href }) => (
                        <a
                            key={href}
                            href={href}
                            className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
                        >
                            {t(key)}
                        </a>
                    ))}
                </nav>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    <LocaleSelector />
                    <ThemeToggleButton />

                    {/* Mobile hamburger */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:bg-accent rounded-full md:hidden"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-nav"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile nav */}
            {isMenuOpen && (
                <nav
                    id="mobile-nav"
                    className="border-border/50 border-t px-6 pb-4 pt-3 md:hidden"
                    aria-label="Mobile navigation"
                >
                    <div className="flex flex-col gap-1">
                        {NAV_ITEMS.map(({ key, href }) => (
                            <a
                                key={href}
                                href={href}
                                className="text-foreground hover:bg-muted rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                                onClick={handleNavClick}
                            >
                                {t(key)}
                            </a>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    );
}

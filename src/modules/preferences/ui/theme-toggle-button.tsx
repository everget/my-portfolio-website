import { Moon, Sun } from 'lucide-react';
import { usePreferences } from '@/modules/preferences/preferences-context';
import { useT } from '@/modules/shared/i18n/i18n-context';
import { Button } from '@/modules/shared/ui/button';

export function ThemeToggleButton() {
    const t = useT();
    const { preferences, setTheme } = usePreferences();
    const isDark = preferences.theme === 'dark';
    const label = isDark ? t('theme.switchToLight') : t('theme.switchToDark');

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="text-muted-foreground hover:bg-accent rounded-full"
            aria-label={label}
            title={label}
        >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    );
}

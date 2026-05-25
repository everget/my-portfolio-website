import { Portfolio } from '@/modules/portfolio/ui/portfolio';
import { PreferencesProvider, usePreferences } from '@/modules/preferences/preferences-context';
import { I18nProvider } from '@/modules/shared/i18n/i18n-context';

function AppWithI18n() {
    const { preferences } = usePreferences();
    return (
        <I18nProvider locale={preferences.locale}>
            <Portfolio />
        </I18nProvider>
    );
}

export function AppWithProviders() {
    return (
        <PreferencesProvider>
            <AppWithI18n />
        </PreferencesProvider>
    );
}

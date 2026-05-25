import { useT } from '@/modules/shared/i18n/i18n-context';

export function Footer() {
    const t = useT();

    return (
        <footer className="bg-muted py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center md:flex-row">
                    <p>
                        &copy; 2016-{new Date().getFullYear()}. {t('portfolio.footer.rights')}
                    </p>
                    <p className="mt-2 md:mt-0 md:ml-2">{t('portfolio.footer.madeWithLove')}</p>
                </div>
            </div>
        </footer>
    );
}

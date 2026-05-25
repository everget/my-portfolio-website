import { useT } from '@/modules/shared/i18n/i18n-context';
import { publicAssetUrl } from '@/modules/shared/lib/utils';

export function Hero() {
    const t = useT();

    return (
        <section id="about" className="scroll-mt-20 py-20">
            <div className="container mx-auto flex flex-col items-center px-6 text-center">
                <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl">
                    {t('portfolio.hero.greeting')}
                </h1>

                <p className="text-primary mt-3 text-xl font-semibold">
                    {t('portfolio.hero.title')}
                </p>

                <p className="text-muted-foreground mt-4 max-w-xl text-base leading-relaxed">
                    {t('portfolio.hero.description')}
                </p>

                <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
                    {t('portfolio.hero.tagline')}
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <a
                        href="mailto:alex.everget161@gmail.com"
                        title="alex.everget161@gmail.com"
                        aria-label="alex.everget161@gmail.com"
                        className="hover:bg-muted inline-flex h-14 w-14 items-center justify-center rounded-xl border border-border transition-colors"
                    >
                        <img
                            src={publicAssetUrl('/skill-icons/gmail.svg')}
                            alt=""
                            aria-hidden="true"
                            className="h-7 w-7"
                        />
                    </a>

                    <a
                        href="https://github.com/everget"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="github.com/everget"
                        aria-label="github.com/everget"
                        className="hover:bg-muted inline-flex h-14 w-14 items-center justify-center rounded-xl border border-border transition-colors"
                    >
                        <img
                            src={publicAssetUrl('/skill-icons/github.svg')}
                            alt=""
                            aria-hidden="true"
                            className="h-7 w-7 dark:invert"
                        />
                    </a>

                    <a
                        href="https://www.linkedin.com/in/alex-orekhov-946b5415a/"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="linkedin.com/in/alex-orekhov-946b5415a"
                        aria-label="linkedin.com/in/alex-orekhov-946b5415a"
                        className="hover:bg-muted inline-flex h-14 w-14 items-center justify-center rounded-xl border border-border transition-colors"
                    >
                        <img
                            src={publicAssetUrl('/skill-icons/linkedin.svg')}
                            alt=""
                            aria-hidden="true"
                            className="h-7 w-7"
                        />
                    </a>
                </div>
            </div>
        </section>
    );
}

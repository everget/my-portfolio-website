import type { ReactNode } from 'react';
import { cn } from '@/modules/shared/lib/utils';
import type { TranslationKey } from '@/modules/shared/i18n/translator';
import { useT } from '@/modules/shared/i18n/i18n-context';
import { darkInvertIconKeys, iconUrls } from '@/modules/portfolio/domain/icon-urls';
import { SKILL_CATEGORIES } from '@/modules/portfolio/domain/skills-data';

interface SkillBadgeProps {
    href?: string;
    className?: string;
    children: ReactNode;
}

function SkillBadge({ href, className, children }: SkillBadgeProps) {
    const baseClass = cn(
        'inline-flex items-center gap-1.5 rounded-sm border border-border/50 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground/80 transition-colors',
        href && 'hover:bg-muted/80 cursor-pointer',
        className,
    );

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={baseClass}>
                {children}
            </a>
        );
    }
    return <span className={baseClass}>{children}</span>;
}

export function Skills() {
    const t = useT();

    return (
        <section id="skills" className="bg-muted/30 scroll-mt-20 py-16">
            <div className="container mx-auto px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl">
                        {t('portfolio.skills.title')}
                    </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {SKILL_CATEGORIES.map((category) => (
                        <div
                            key={category.key}
                            className="bg-card/70 rounded-md border border-border/50 p-5 shadow-sm"
                        >
                            <h3 className="text-muted-foreground mb-4 text-xs font-semibold uppercase tracking-widest">
                                {t(category.translationKey as TranslationKey)}
                            </h3>

                            <div className="flex flex-wrap gap-1.5">
                                {category.skills.map((skill) => {
                                    const iconSrc = skill.iconKey
                                        ? iconUrls[skill.iconKey]
                                        : undefined;
                                    const invertIcon =
                                        !!skill.iconKey && darkInvertIconKeys.has(skill.iconKey);

                                    return (
                                        <SkillBadge key={skill.name} href={skill.link}>
                                            {iconSrc && (
                                                <img
                                                    src={iconSrc}
                                                    alt=""
                                                    aria-hidden="true"
                                                    loading="lazy"
                                                    decoding="async"
                                                    className={cn(
                                                        'h-4 w-4 shrink-0',
                                                        invertIcon && 'dark:invert',
                                                    )}
                                                />
                                            )}
                                            <span>{skill.name}</span>
                                        </SkillBadge>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

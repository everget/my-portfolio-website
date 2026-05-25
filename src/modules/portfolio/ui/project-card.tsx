import { ExternalLink } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { iconUrls } from '@/modules/portfolio/domain/icon-urls';
import type { Project } from '@/modules/portfolio/domain/projects-data';
import { useT } from '@/modules/shared/i18n/i18n-context';
import { cn } from '@/modules/shared/lib/utils';
import { Button } from '@/modules/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/shared/ui/card';

function TechBadge({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'border-border bg-muted/50 text-muted-foreground flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-medium',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const t = useT();
    const title = t(project.titleKey);
    const description = t(project.descriptionKey);

    return (
        <Card className="group border-border/60 bg-card/70 flex flex-col rounded-md overflow-hidden shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={project.image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <CardHeader className="pt-6">
                <CardTitle className="text-foreground text-xl font-bold">{title}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col">
                <p className="text-muted-foreground mb-6 line-clamp-3 text-sm leading-relaxed">
                    {description}
                </p>

                <div className="mb-8 flex flex-wrap gap-2">
                    {project.techstack.map((tech) => (
                        <TechBadge key={tech.name}>
                            {tech.icon && (
                                <img
                                    src={tech.icon}
                                    alt={tech.name}
                                    className="mr-1.5 h-3.5 w-3.5 opacity-80"
                                />
                            )}
                            {tech.name}
                        </TechBadge>
                    ))}
                </div>

                <div className="mt-auto flex gap-3">
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-border hover:bg-accent flex-1 font-semibold"
                        asChild
                    >
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                            <img
                                src={iconUrls['github']}
                                alt="GitHub"
                                className="h-4 w-4 dark:invert"
                            />
                            {t('portfolio.projects.viewCode')}
                        </a>
                    </Button>
                    <Button size="sm" className="flex-1 font-semibold" asChild>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            {t('portfolio.projects.liveDemo')}
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

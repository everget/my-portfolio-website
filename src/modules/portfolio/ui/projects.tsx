import { projectsData } from '@/modules/portfolio/domain/projects-data';
import { useT } from '@/modules/shared/i18n/i18n-context';
import { ProjectCard } from './project-card';

export function Projects() {
    const t = useT();

    return (
        <section id="projects" className="scroll-mt-20 bg-muted/50 py-10">
            <div className="container mx-auto px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl">
                        {t('portfolio.projects.title')}
                    </h2>
                    <p className="text-muted-foreground mt-4 text-lg">
                        {t('portfolio.projects.subtitle')}
                    </p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {projectsData.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}

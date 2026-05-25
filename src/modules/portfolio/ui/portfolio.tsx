import { Footer } from './footer';
import { Header } from './header';
import { Hero } from './hero';
import { Projects } from './projects';
import { Skills } from './skills';

export function Portfolio() {
    return (
        <div className="bg-background text-foreground min-h-screen">
            <Header />
            <main>
                <Hero />
                <Projects />
                <Skills />
            </main>
            <Footer />
        </div>
    );
}

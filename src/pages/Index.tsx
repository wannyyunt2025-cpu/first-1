import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { SkillCloud } from '@/components/home/SkillCloud';
import { ProjectList } from '@/components/home/ProjectList';
import { CommentSection } from '@/components/home/CommentSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        <section aria-labelledby="hero-heading">
          <HeroSection />
        </section>
        <section aria-labelledby="skills-heading">
          <SkillCloud />
        </section>
        <section aria-labelledby="projects-heading">
          <ProjectList />
        </section>
        <section aria-labelledby="comments-heading">
          <CommentSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

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
      <main>
        <HeroSection />
        <SkillCloud />
        <ProjectList />
        <CommentSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

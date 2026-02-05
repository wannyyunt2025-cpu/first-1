import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { SkillCloud } from '@/components/home/SkillCloud';
import { ProjectList } from '@/components/home/ProjectList';
import { CommentSection } from '@/components/home/CommentSection';
import { AIChatWidget } from '@/components/ai/AIChatWidget';

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
      <AIChatWidget />
    </div>
  );
};

export default Index;

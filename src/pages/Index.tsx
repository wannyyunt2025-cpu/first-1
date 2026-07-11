import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { PositioningSection } from '@/components/home/PositioningSection';
import { CoreProjectSection } from '@/components/home/CoreProjectSection';
import { LearningSection } from '@/components/home/LearningSection';
import { AIUnderstandingSection } from '@/components/home/AIUnderstandingSection';
import { ContactSection } from '@/components/home/ContactSection';
import { AIChatWidget } from '@/components/ai/AIChatWidget';
import { useProfile } from '@/hooks/useProfile';

const Index = () => {
  const { profile } = useProfile();

  useEffect(() => {
    const name = profile?.name?.trim();
    document.title = name ? `${name} | 个人主页` : '个人主页';
  }, [profile?.name]);

  return (
    <div className="min-h-screen bg-background">
      <div>
        <Navbar />
        <main>
          <HeroSection />
          <PositioningSection />
          <CoreProjectSection />
          <LearningSection />
          <AIUnderstandingSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
      
      <AIChatWidget />
    </div>
  );
};

export default Index;

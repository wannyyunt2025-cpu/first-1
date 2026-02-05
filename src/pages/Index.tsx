import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { SkillCloud } from '@/components/home/SkillCloud';
import { ProjectList } from '@/components/home/ProjectList';
import { CommentSection } from '@/components/home/CommentSection';
import { AIChatWidget } from '@/components/ai/AIChatWidget';
import { motion } from 'framer-motion';
import { useProfile } from '@/hooks/useProfile';

const Index = () => {
  const { profile } = useProfile();

  useEffect(() => {
    const name = profile?.name?.trim();
    document.title = name ? `${name} | 动态个人主页` : '动态个人主页';
  }, [profile?.name]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* 全局背景层 - Fixed Position */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" style={{ background: 'var(--gradient-hero)' }}>
        {/* 1. 噪点纹理层 */}
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay bg-noise"></div>

        {/* 2. Lofi Image Overlay (模拟窗景/氛围图) */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20 mix-blend-soft-light"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop")',
            filter: 'blur(8px) contrast(1.2)'
          }}
        ></div>

        {/* 3. Animated Bokeh Elements (光影动画) */}
        <div className="absolute inset-0 overflow-hidden">
           {/* 暖色光斑 */}
           <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"
          />
          {/* 冷色氛围光 */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-accent/10 rounded-full blur-[120px]"
          />
        </div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <SkillCloud />
          <ProjectList />
          <CommentSection />
        </main>
        <Footer />
      </div>
      
      <AIChatWidget />
    </div>
  );
};

export default Index;

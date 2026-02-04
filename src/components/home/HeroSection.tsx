import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { ContactModal } from './ContactModal';

export function HeroSection() {
  const { profile } = useProfile();
  const [showContactModal, setShowContactModal] = useState(false);

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="about"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-aurora-1"
        />
        <div 
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] animate-aurora-2"
        />
        <div 
          className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] animate-aurora-1 delay-700"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 id="hero-heading" className="text-4xl md:text-display-lg font-bold mb-4 tracking-tight">
              <span className="text-foreground">Hi, 我是</span>{' '}
              <span className="text-gradient-primary">
                {profile.name}
              </span>
            </h1>
          </motion.div>

          {/* Title/Role */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-2xl md:text-headline-lg text-foreground font-medium mb-6"
          >
            {profile.title}
          </motion.h2>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-lg md:text-body-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {profile.slogan}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                onClick={scrollToProjects}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-10 h-14 shadow-glow rounded-full transition-all duration-300"
              >
                查看我的项目
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="border-primary/20 text-primary hover:bg-primary/5 gap-2 h-14 px-8 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <Mail className="h-4 w-4" />
                获取联系方式
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-3 text-muted-foreground/60 hover:text-primary cursor-pointer transition-colors group"
              onClick={() => {
                const element = document.getElementById('skills');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span className="text-sm font-medium tracking-widest uppercase">Explore</span>
              <ArrowDown className="h-5 w-5 group-hover:animate-bounce" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <ContactModal 
        open={showContactModal} 
        onOpenChange={setShowContactModal} 
      />
    </section>
  );
}

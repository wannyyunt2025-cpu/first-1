import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfile } from '@/hooks/useProfile';
import { ContactModal } from './ContactModal';

export function HeroSection() {
  const { profile, isLoading } = useProfile();
  const [showContactModal, setShowContactModal] = useState(false);

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine if we should show loading state (either isLoading is true OR profile data is empty)
  const showLoading = isLoading || !profile.name;

  return (
    <section 
      id="about"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      // 背景已移至全局 (Index.tsx)，此处保持透明
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-display-sm md:text-display-lg font-bold mb-4 flex flex-col md:block items-center justify-center gap-2 tracking-tight font-display">
              <span className="text-foreground drop-shadow-lg italic">Hi, 我是</span>{' '}
              {showLoading ? (
                <Skeleton className="h-20 w-64 inline-block align-middle bg-primary/10" />
              ) : (
                <span className="text-primary drop-shadow-glow">{profile.name}</span>
              )}
            </h1>
          </motion.div>

          {/* Title/Role */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            {showLoading ? (
               <Skeleton className="h-10 w-80 bg-muted/20" />
            ) : (
              <h2 className="text-headline-sm md:text-headline-lg text-foreground/90 font-light font-display italic tracking-wide">
                {profile.title}
              </h2>
            )}
          </motion.div>

          {/* Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="mb-10 max-w-2xl mx-auto flex justify-center"
          >
            {showLoading ? (
              <div className="space-y-2 w-full max-w-md">
                 <Skeleton className="h-4 w-full bg-muted/10" />
                 <Skeleton className="h-4 w-3/4 mx-auto bg-muted/10" />
              </div>
            ) : (
              <p className="text-lg md:text-headline-sm text-muted-foreground font-light leading-relaxed">
                {profile.slogan}
              </p>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              onClick={scrollToProjects}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 shadow-glow transition-all duration-300 hover:scale-105"
            >
              查看我的项目
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setShowContactModal(true)}
              className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/40 gap-2 backdrop-blur-sm"
            >
              <Mail className="h-4 w-4" />
              获取联系方式
            </Button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-16 md:mt-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary cursor-pointer transition-colors"
              onClick={() => {
                const element = document.getElementById('skills');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span className="text-base font-medium">向下滚动</span>
              <ArrowDown className="h-5 w-5" />
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

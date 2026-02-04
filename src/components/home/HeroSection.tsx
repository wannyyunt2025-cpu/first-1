import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';
import { ContactModal } from './ContactModal';

export function HeroSection() {
  const { profile } = useProfile();
  const { style } = useTheme();
  const [showContactModal, setShowContactModal] = useState(false);

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isMinimalist = style === 'minimalist';

  return (
    <section 
      id="about"
      className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden transition-colors duration-700 ${
        isMinimalist ? 'bg-white' : 'bg-background'
      }`}
    >
      <AnimatePresence mode="wait">
        {isMinimalist ? (
          /* Minimalist Background */
          <motion.div
            key="minimalist-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          </motion.div>
        ) : (
          /* Classic Aurora Background */
          <motion.div
            key="classic-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div 
              className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-aurora-1"
            />
            <div 
              className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] animate-aurora-2"
            />
            <div 
              className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] animate-aurora-1 delay-700"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${
              isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-primary/10 border-primary/20'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className={`text-xs font-bold uppercase tracking-widest ${
              isMinimalist ? 'text-slate-500' : 'text-primary'
            }`}>
              {isMinimalist ? 'Available for Projects' : '开放合作中'}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {isMinimalist ? (
              <h1 id="hero-heading" className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-slate-900 leading-[0.9]">
                Building digital <br />
                <span className="text-primary">experiences</span> that matter.
              </h1>
            ) : (
              <h1 id="hero-heading" className="text-4xl md:text-display-lg font-bold mb-4 tracking-tight">
                <span className="text-foreground">Hi, 我是</span>{' '}
                <span className="text-gradient-primary">
                  {profile.name}
                </span>
              </h1>
            )}
          </motion.div>

          {/* Role & Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col items-center gap-6 mb-12"
          >
            <p className={`text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed ${
              isMinimalist ? 'text-slate-600' : 'text-foreground'
            }`}>
              {isMinimalist ? (
                <>Hi, I'm <span className="text-slate-900 font-bold">{profile.name}</span>. {profile.slogan}</>
              ) : (
                profile.title
              )}
            </p>
            {!isMinimalist && (
              <p className="text-lg md:text-body-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {profile.slogan}
              </p>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="lg" 
                onClick={scrollToProjects}
                className={`font-bold px-12 h-16 text-lg rounded-full shadow-2xl transition-all duration-300 ${
                  isMinimalist ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200' : 'bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-primary/20'
                }`}
              >
                {isMinimalist ? 'View My Work' : '查看我的项目'}
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowContactModal(true)}
                className={`gap-3 h-16 px-10 text-lg rounded-full font-bold transition-all duration-300 ${
                  isMinimalist ? 'border-slate-200 text-slate-900 hover:bg-slate-50' : 'border-primary/20 text-primary hover:bg-primary/5 backdrop-blur-sm'
                }`}
              >
                <Mail className="h-5 w-5" />
                {isMinimalist ? 'Get in Touch' : '获取联系方式'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom info bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-0 right-0 w-full px-6 md:px-12 flex items-center justify-between pointer-events-none"
      >
        <div className={`text-[10px] font-bold uppercase tracking-[0.3em] vertical-text hidden md:block ${
          isMinimalist ? 'text-slate-300' : 'text-muted-foreground/40'
        }`}>
          Based in China
        </div>
        <div className="flex flex-col items-center gap-4 group cursor-pointer pointer-events-auto" onClick={() => {
          const element = document.getElementById('skills');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-primary transition-colors ${
            isMinimalist ? 'text-slate-400' : 'text-muted-foreground/60'
          }`}>
            {isMinimalist ? 'Scroll' : 'Explore'}
          </span>
          <div className={`w-px h-12 group-hover:bg-primary transition-colors overflow-hidden ${
            isMinimalist ? 'bg-slate-200' : 'bg-muted-foreground/20'
          }`}>
            <motion.div 
              animate={{ y: [0, 48, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-1/2 bg-primary"
            />
          </div>
        </div>
        <div className={`text-[10px] font-bold uppercase tracking-[0.3em] vertical-text hidden md:block ${
          isMinimalist ? 'text-slate-300' : 'text-muted-foreground/40'
        }`}>
          Fullstack Dev
        </div>
      </motion.div>

      <ContactModal 
        open={showContactModal} 
        onOpenChange={setShowContactModal} 
      />
    </section>
  );
}

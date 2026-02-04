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
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Subtle refined background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Available for Projects</span>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 id="hero-heading" className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-slate-900 leading-[0.9]">
              Building digital <br />
              <span className="text-primary">experiences</span> that matter.
            </h1>
          </motion.div>

          {/* Role & Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col items-center gap-6 mb-12"
          >
            <p className="text-xl md:text-2xl font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Hi, I'm <span className="text-slate-900 font-bold">{profile.name}</span>. {profile.slogan}
            </p>
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
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-12 h-16 text-lg rounded-full shadow-2xl shadow-slate-200 transition-all duration-300"
              >
                View My Work
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowContactModal(true)}
                className="border-slate-200 text-slate-900 hover:bg-slate-50 gap-3 h-16 px-10 text-lg rounded-full font-bold transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
                Get in Touch
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
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 vertical-text hidden md:block">
          Based in China
        </div>
        <div className="flex flex-col items-center gap-4 group cursor-pointer pointer-events-auto" onClick={() => {
          const element = document.getElementById('skills');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors">Scroll</span>
          <div className="w-px h-12 bg-slate-200 group-hover:bg-primary transition-colors overflow-hidden">
            <motion.div 
              animate={{ y: [0, 48, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-1/2 bg-primary"
            />
          </div>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 vertical-text hidden md:block">
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

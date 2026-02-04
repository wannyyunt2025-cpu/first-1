import { Github, Linkedin, Mail } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

export function Footer() {
  const { profile } = useProfile();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-slate-100 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-sm font-medium text-slate-500">
            © {currentYear} {profile.name}. <span className="text-slate-300 mx-2">|</span> Designed with precision.
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-slate-400 hover:text-slate-900 transition-all duration-300 transform hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-slate-900 transition-all duration-300 transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-slate-900 transition-all duration-300 transform hover:scale-110"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          <div className="text-xs font-bold uppercase tracking-widest text-slate-300">
            v1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
}

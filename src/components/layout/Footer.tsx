import { Github, Linkedin, Mail } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

export function Footer() {
  const { profile } = useProfile();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {currentYear} {profile.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          <div className="text-xs text-muted-foreground/60">
            Powered by Dynamic Portfolio
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Github, Mail } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

export function Footer() {
  const { profile } = useProfile();
  const currentYear = new Date().getFullYear();
  const displayName = profile.name || '个人主页';
  const email = profile.contact?.email;

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm" style={{ color: '#61809e' }}>
            © {currentYear} {displayName}. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/wannyyunt2025-cpu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              style={{ color: '#61809e' }}
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            {email && (
              <a
                href={`mailto:${email}`}
                className="hover:text-primary transition-colors"
                style={{ color: '#61809e' }}
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
          </div>

          <div className="text-xs" style={{ color: '#61809e' }}>
            Built with React & TypeScript
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Settings, LogIn, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const navLinks = [
  { id: 'positioning', label: '当前定位' },
  { id: 'core-project', label: '核心项目' },
  { id: 'learning', label: '学习路径' },
  { id: 'understanding', label: 'AI 理解' },
  { id: 'contact', label: '联系' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('positioning');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();
  const displayName = profile.name?.trim() || '个人主页';
  const displayTitle = profile.title?.trim() || 'Architecture → AI Practice';
  const logoInitial = displayName === '个人主页' ? 'A' : displayName.slice(0, 1).toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      navLinks.forEach((link) => {
        sectionRefs.current[link.id] = document.getElementById(link.id);
      });

      // 检测当前活跃的 section
      const current = Object.entries(sectionRefs.current).find(([id, ref]) => {
        if (!ref) return false;
        const rect = ref.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (current) {
        setActiveSection(current[0]);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 glass border-b border-border transition-shadow',
        isScrolled && 'shadow-sm'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="interactive flex items-center gap-3 rounded-full border px-3 py-2 text-left"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 rounded-full border border-border bg-gradient-to-br from-accent-soft to-surface-2 flex items-center justify-center font-display font-bold">
              {logoInitial}
            </div>
            <div>
              <div className="text-sm font-semibold">{displayName}</div>
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {displayTitle}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex" aria-label="主导航">
            {navLinks.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="interactive rounded-full px-4 py-2 text-sm"
                  style={{
                    border: `1px solid ${active ? 'var(--accent)' : 'transparent'}`,
                    background: active ? 'var(--accent-soft)' : 'transparent',
                    color: 'var(--text)',
                    fontWeight: active ? 700 : 500,
                    boxShadow: active ? `inset 0 -2px 0 var(--accent)` : 'none',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="interactive rounded-full border px-4 py-2 text-sm font-medium"
              onClick={() => handleNavClick('contact')}
            >
              <Mail className="h-4 w-4 mr-2" />
              获取联系方式
            </Button>
            {isAuthenticated ? (
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="interactive rounded-full px-4 py-2 text-sm text-muted"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  管理入口
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="interactive rounded-full px-4 py-2 text-sm text-muted"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  管理入口
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={cn(
                      'min-h-11 px-4 py-3 text-base font-medium text-left rounded-lg',
                      active ? 'bg-accent-soft text-foreground' : 'text-muted-foreground hover:text-primary'
                    )}
                  >
                    {link.label}
                  </button>
                );
              })}
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => handleNavClick('contact')}
                >
                  <Mail className="h-4 w-4" />
                  获取联系方式
                </Button>
                {isAuthenticated ? (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-muted"
                    >
                      <Settings className="h-4 w-4" />
                      管理入口
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-muted"
                    >
                      <LogIn className="h-4 w-4" />
                      管理入口
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

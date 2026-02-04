import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, LogIn, LogOut, Layout, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme, ThemeStyle } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { style, setStyle } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isMinimalist = style === 'minimalist';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = isMinimalist ? [
    { href: '/#about', label: 'About' },
    { href: '/#skills', label: 'Expertise' },
    { href: '/#projects', label: 'Projects' },
    { href: '/#comments', label: 'Contact' },
  ] : [
    { href: '/#about', label: '关于我' },
    { href: '/#skills', label: '技能' },
    { href: '/#projects', label: '项目' },
    { href: '/#comments', label: '留言' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
  };

  const toggleStyle = () => {
    setStyle(isMinimalist ? 'classic' : 'minimalist');
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? isMinimalist 
            ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm'
            : 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-md'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className={cn(
              "text-2xl font-bold tracking-tighter transition-opacity focus-visible:outline-none",
              isMinimalist ? "text-slate-900" : "text-foreground"
            )}
          >
            {isMinimalist ? <>Portfolio<span className="text-primary">.</span></> : 'Portfolio'}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  'text-sm font-semibold tracking-wide transition-all duration-300',
                  isMinimalist 
                    ? 'text-slate-600 hover:text-primary relative group'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                {link.label}
                {isMinimalist && (
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Style Toggle Switch */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleStyle}
              className={cn(
                "gap-2 font-bold rounded-full px-4 h-10 transition-all",
                isMinimalist ? "text-slate-600 hover:bg-slate-100" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              )}
              title={isMinimalist ? "切换到原版极光" : "Switch to Minimalist"}
            >
              {isMinimalist ? <Sparkles className="h-4 w-4" /> : <Layout className="h-4 w-4" />}
              <span className="text-xs uppercase tracking-widest">{isMinimalist ? 'Classic' : 'Minimalist'}</span>
            </Button>

            <div className="w-px h-4 bg-border/50 mx-2" />

            {isAuthenticated ? (
              <>
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className={cn(
                    "font-bold rounded-full px-6",
                    isMinimalist ? "text-slate-700 hover:bg-slate-100" : "text-primary hover:bg-primary/10"
                  )}>
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className={cn(
                    "font-bold rounded-full px-6",
                    isMinimalist ? "border-slate-200 text-slate-600" : "border-primary/50 text-muted-foreground hover:text-destructive"
                  )}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm" className={cn(
                  "font-bold rounded-full px-8 h-11 transition-all hover:scale-105 active:scale-95",
                  isMinimalist ? "bg-slate-900 hover:bg-slate-800 text-white" : "bg-gradient-primary text-primary-foreground shadow-glow"
                )}>
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleStyle}
              className="rounded-full"
            >
              {isMinimalist ? <Sparkles className="h-5 w-5 text-slate-600" /> : <Layout className="h-5 w-5 text-muted-foreground" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-6 overflow-hidden"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="min-h-11 px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary text-left rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
                  {isAuthenticated ? (
                    <>
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                          <Settings className="h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2 rounded-xl text-destructive">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full rounded-xl bg-slate-900 text-white">
                        Admin Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

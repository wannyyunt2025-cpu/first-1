import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Target, Lightbulb, Zap, Trophy, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { useProjects } from '@/hooks/useProjects';
import { useTheme } from '@/hooks/useTheme';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContactModal } from '@/components/home/ContactModal';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById } = useProjects();
  const { style } = useTheme();
  const [showContactModal, setShowContactModal] = useState(false);
  
  const project = getById(id || '');
  const isMinimalist = style === 'minimalist';

  if (!project) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isMinimalist ? 'bg-white' : 'bg-background'}`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{isMinimalist ? 'Project not found' : '项目不存在'}</h1>
          <Link to="/">
            <Button variant="outline">{isMinimalist ? 'Back to Home' : '返回首页'}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const format = (d: Date) => isMinimalist 
      ? d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : `${d.getFullYear()}年${d.getMonth() + 1}月`;
    return `${format(startDate)} - ${format(endDate)}`;
  };

  const starItems = [
    { 
      key: 'situation', 
      title: isMinimalist ? 'Situation' : '背景情境 (Situation)', 
      content: project.situation,
      icon: Target,
      color: 'text-blue-400'
    },
    { 
      key: 'task', 
      title: isMinimalist ? 'Task' : '任务目标 (Task)', 
      content: project.task,
      icon: Lightbulb,
      color: 'text-yellow-400'
    },
    { 
      key: 'action', 
      title: isMinimalist ? 'Action' : '行动方案 (Action)', 
      content: project.action,
      icon: Zap,
      color: 'text-green-400'
    },
    { 
      key: 'result', 
      title: isMinimalist ? 'Result' : '成果产出 (Result)', 
      content: project.result,
      icon: Trophy,
      color: 'text-purple-400'
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isMinimalist ? 'bg-white' : 'bg-background'}`}>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-12"
            >
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className={`gap-2 p-0 hover:bg-transparent ${isMinimalist ? 'text-slate-400 hover:text-slate-900' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <ArrowLeft className="h-4 w-4" />
                {isMinimalist ? 'Back' : '返回'}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h1 className={`font-black tracking-tighter mb-6 ${isMinimalist ? 'text-5xl md:text-7xl text-slate-900' : 'text-3xl md:text-display-sm text-foreground'}`}>
                {project.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6">
                <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${isMinimalist ? 'text-primary' : 'text-muted-foreground'}`}>
                  <User className="h-4 w-4" />
                  {project.role}
                </div>
                <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : 'text-muted-foreground'}`}>
                  <Calendar className="h-4 w-4" />
                  {formatDateRange(project.startDate, project.endDate)}
                </div>
              </div>
            </motion.div>

            {/* STAR Content - Reimagined for Minimalist */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-16`}>
              {starItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className={`h-full p-8 rounded-3xl border transition-all duration-500 ${
                      isMinimalist 
                        ? 'bg-slate-50 border-slate-100 hover:border-primary/20 hover:shadow-lg' 
                        : 'bg-card/50 border-border/50 hover:border-primary/30'
                    }`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-2xl ${isMinimalist ? 'bg-white shadow-sm' : 'bg-secondary'} ${item.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h2 className={`font-black tracking-tight ${isMinimalist ? 'text-xl text-slate-900' : 'text-lg text-foreground'}`}>
                          {item.title}
                        </h2>
                      </div>
                      <p className={`leading-relaxed ${isMinimalist ? 'text-slate-500' : 'text-muted-foreground'}`}>
                        {item.content}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Back to home */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-12 border-t border-slate-100"
            >
              <Link to="/#projects">
                <Button
                  variant="outline"
                  size="lg"
                  className={`h-16 px-10 rounded-full font-bold transition-all ${
                    isMinimalist ? 'border-slate-200 text-slate-900 hover:bg-slate-50' : 'border-primary/50 text-primary hover:bg-primary/10'
                  }`}
                >
                  {isMinimalist ? 'All Case Studies' : '查看更多项目'}
                </Button>
              </Link>
              <Button
                variant="default"
                size="lg"
                onClick={() => setShowContactModal(true)}
                className={`h-16 px-12 rounded-full font-bold shadow-xl transition-all ${
                  isMinimalist ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-gradient-primary hover:opacity-90 text-primary-foreground'
                }`}
              >
                {isMinimalist ? "Let's Talk" : '获取联系方式'}
              </Button>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      
      <ContactModal 
        open={showContactModal} 
        onOpenChange={setShowContactModal} 
      />
    </div>
  );
}

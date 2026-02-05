import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from './ProjectCard';

export function ProjectList() {
  const { publicProjects } = useProjects();
  const [showAll, setShowAll] = useState(false);
  
  const displayedProjects = showAll ? publicProjects : publicProjects.slice(0, 3);
  const hasMore = publicProjects.length > 3;

  const scrollToComments = () => {
    const element = document.getElementById('comments');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // 移除 bg-secondary/20，改为透明，以便透出全局背景
    <section id="projects" className="pt-12 pb-20 md:pt-16 md:pb-32 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-headline-lg font-bold text-foreground mb-4">
            项目经历
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            精选项目案例，展示我的技术实践与解决问题的能力
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index}
            />
          ))}
        </div>

        {hasMore && !showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-10"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(true)}
              className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
            >
              查看更多项目
              <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {showAll && hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-10"
          >
            <Button
              variant="ghost"
              onClick={() => setShowAll(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              收起
            </Button>
          </motion.div>
        )}

        {/* Scroll to comments indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 md:mt-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary cursor-pointer transition-colors"
            onClick={scrollToComments}
          >
            <span className="text-sm font-medium">查看留言互动</span>
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

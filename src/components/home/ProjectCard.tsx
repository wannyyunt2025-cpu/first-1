import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const format = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
    return `${format(startDate)} - ${format(endDate)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full"
    >
      <Link 
        to={`/project/${project.id}`}
        className="group relative flex flex-col h-full rounded-2xl bg-background-saliant p-6 
                   border border-border/20 backdrop-blur-sm
                   shadow-lg transition-all duration-500 
                   hover:bg-background-elevated hover:shadow-glow hover:-translate-y-1"
      >
        {/* 顶部：标题与日期 */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-foreground/90 group-hover:text-primary transition-colors tracking-tight">
              {project.name}
            </h3>
            {/* 右上角箭头，Hover 时显现并移动 */}
            <ArrowUpRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 translate-y-2 
                                     group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground/80">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary/70" />
              {project.role}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary/70" />
              {formatDateRange(project.startDate, project.endDate)}
            </span>
          </div>
        </div>

        {/* 中部：描述 (Situation + Task 简述) */}
        <p className="text-muted-foreground mb-6 line-clamp-3 text-sm leading-relaxed font-light">
          {project.situation} {project.task}
        </p>
        
        {/* 底部：核心成果 (Bento小模块) 与 标签 */}
        <div className="space-y-4 mt-auto">
          {/* Key Result */}
          <div className="relative overflow-hidden rounded-lg bg-background-elevated/50 p-3 border border-primary/10 group-hover:border-primary/20 transition-colors">
             <p className="relative text-sm font-medium text-foreground/90 leading-relaxed">
               <span className="text-primary font-bold mr-2">🎯 Key Result:</span>
               <span className="text-muted-foreground">{project.result}</span>
             </p>
          </div>

          {/* 技术栈标签 */}
          <div className="flex flex-wrap gap-2">
            {project.keywords.slice(0, 4).map((keyword, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="bg-background-elevated hover:bg-primary/20 text-muted-foreground hover:text-primary font-normal border border-white/5 transition-colors"
              >
                {keyword}
              </Badge>
            ))}
            {project.keywords.length > 4 && (
              <Badge variant="outline" className="text-xs text-muted-foreground border-white/10">
                +{project.keywords.length - 4}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

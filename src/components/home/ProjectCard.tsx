import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full"
    >
      <Card className="group h-full bg-white border border-slate-100 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] overflow-hidden relative flex flex-col">
        {/* Numbering */}
        <div className="absolute top-6 right-8 text-4xl font-black text-slate-50 group-hover:text-primary/5 transition-colors pointer-events-none">
          {String(index + 1).padStart(2, '0')}
        </div>

        <CardHeader className="pb-6 pt-10 px-8">
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors tracking-tighter leading-none">
              {project.name}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-1.5">
                {project.role}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <span className="flex items-center gap-1.5">
                {formatDateRange(project.startDate, project.endDate)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10 space-y-8 flex-1 flex flex-col">
          {/* Summary */}
          <p className="text-slate-500 leading-relaxed text-sm flex-1">
            {project.situation}
          </p>

          {/* Key Achievement */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100/50 group-hover:bg-primary/[0.02] group-hover:border-primary/10 transition-colors duration-500">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Key Impact</p>
            <p className="text-slate-700 font-bold leading-snug">
              {project.result}
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 flex items-center justify-between">
            <div className="flex -space-x-2">
              {project.keywords.slice(0, 3).map((keyword, idx) => (
                <div 
                  key={idx}
                  className="w-8 h-8 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm"
                  title={keyword}
                >
                  {keyword.charAt(0)}
                </div>
              ))}
              {project.keywords.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400">
                  +{project.keywords.length - 3}
                </div>
              )}
            </div>

            <Link to={`/project/${project.id}`}>
              <Button 
                variant="ghost" 
                size="sm"
                className="group/btn gap-2 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-primary hover:bg-transparent px-0"
              >
                Case Study
                <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

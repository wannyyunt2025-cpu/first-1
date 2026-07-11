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
        className="group flex flex-col h-full rounded-xl border border-border p-6
                   transition-all duration-300
                   hover:shadow-lg hover:-translate-y-1 card-hover"
      >
        {/* 顶部：标题与日期 */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight">
              {project.name}
            </h3>
            {/* 右上角箭头，Hover 时显现并移动 */}
            <ArrowUpRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 translate-y-2
                                     group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              {project.role}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              {formatDateRange(project.startDate, project.endDate)}
            </span>
          </div>
        </div>

        {/* 中部：描述 (Situation + Task 简述) */}
        <p className="text-muted-foreground mb-6 line-clamp-3 text-sm leading-relaxed">
          {project.situation} {project.task}
        </p>

        {/* 底部：核心成果与 标签 */}
        <div className="space-y-4 mt-auto">
          {/* Key Result */}
          <div className="rounded-lg border border-border p-3 transition-colors group-hover:border-primary/20">
             <p className="text-sm font-medium text-foreground leading-relaxed">
               <span className="text-primary font-semibold mr-2">🎯 核心成果:</span>
               <span className="text-muted-foreground">{project.result}</span>
             </p>
          </div>

          {/* 技术栈标签 */}
          <div className="flex flex-wrap gap-2">
            {project.keywords.slice(0, 4).map((keyword, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {keyword}
              </Badge>
            ))}
            {project.keywords.length > 4 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{project.keywords.length - 4}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="group h-full bg-card/40 backdrop-blur-xl border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden relative">
        {/* Hover decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500" />
        
        <CardHeader className="pb-4 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                {project.name}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground/80">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50">
                  <User className="h-3.5 w-3.5 text-primary" />
                  {project.role}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {formatDateRange(project.startDate, project.endDate)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          {/* Key Result - High Impact Design */}
          <div className="relative p-4 rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-accent/5 border border-primary/10 group-hover:border-primary/20 transition-colors duration-500">
            <div className="absolute top-2 left-2 w-1 h-4 bg-primary rounded-full opacity-60" />
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2 ml-2">Core Achievement</p>
            <p className="text-body-sm text-foreground/90 leading-relaxed line-clamp-3 ml-2">
              {project.result}
            </p>
          </div>

          {/* Keywords with glass badges */}
          <div className="flex flex-wrap gap-2">
            {project.keywords.slice(0, 5).map((keyword, idx) => (
              <Badge 
                key={idx} 
                variant="outline"
                className="text-xs font-semibold border-border/60 bg-background/20 backdrop-blur-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors py-1 px-3 rounded-full"
              >
                {keyword}
              </Badge>
            ))}
            {project.keywords.length > 5 && (
              <Badge variant="ghost" className="text-xs text-muted-foreground/60 font-medium">
                +{project.keywords.length - 5}
              </Badge>
            )}
          </div>

          {/* View Detail Button - Micro interaction */}
          <Link to={`/project/${project.id}`}>
            <Button 
              variant="ghost" 
              className="w-full justify-center gap-2 group/btn h-12 rounded-xl bg-primary/5 hover:bg-primary text-primary hover:text-white transition-all duration-300 font-bold"
            >
              了解项目全貌
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1.5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

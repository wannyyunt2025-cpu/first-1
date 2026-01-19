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
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card className="group h-full bg-card border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-card-hover overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-base text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {project.role}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDateRange(project.startDate, project.endDate)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Result - Highlighted */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-base font-medium text-primary mb-1">Key Result</p>
            <p className="text-base text-foreground line-clamp-2">
              {project.result}
            </p>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2">
            {project.keywords.slice(0, 4).map((keyword, idx) => (
              <Badge 
                key={idx} 
                variant="secondary"
                className="text-sm bg-secondary/50 text-secondary-foreground hover:bg-secondary/70"
              >
                {keyword}
              </Badge>
            ))}
            {project.keywords.length > 4 && (
              <Badge variant="outline" className="text-sm text-muted-foreground">
                +{project.keywords.length - 4}
              </Badge>
            )}
          </div>

          {/* View Detail Button */}
          <Link to={`/project/${project.id}`}>
            <Button 
              variant="ghost" 
              className="w-full justify-between group/btn hover:bg-primary/10 text-muted-foreground hover:text-primary"
            >
              查看详情
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

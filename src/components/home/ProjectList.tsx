import { motion } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
import { useTheme } from '@/hooks/useTheme';
import { ProjectCard } from './ProjectCard';

export function ProjectList() {
  const { publicProjects } = useProjects();
  const { style } = useTheme();
  const isMinimalist = style === 'minimalist';

  return (
    <section id="projects" className={`py-24 transition-colors duration-700 ${isMinimalist ? 'bg-white' : 'bg-background'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`mb-16 ${isMinimalist ? 'text-left' : 'text-center'}`}
        >
          <h2 id="projects-heading" className={`font-black tracking-tighter ${
            isMinimalist ? 'text-sm uppercase tracking-[0.2em] text-primary mb-6' : 'text-3xl md:text-headline-lg text-foreground mb-4'
          }`}>
            {isMinimalist ? 'Portfolio' : '项目经历'}
          </h2>
          <h3 className={`font-black tracking-tighter leading-tight ${
            isMinimalist ? 'text-4xl md:text-5xl text-slate-900' : 'hidden'
          }`}>
            Selected works.
          </h3>
          {!isMinimalist && (
            <p className="text-muted-foreground max-w-xl mx-auto">
              展示我近期参与的核心项目，涵盖 Web 开发、移动端及 AI 领域
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publicProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

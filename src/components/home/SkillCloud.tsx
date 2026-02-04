import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/useSkills';

const skillColors = [
  'from-indigo-600 to-blue-500',
  'from-emerald-500 to-teal-400',
  'from-violet-600 to-purple-500',
  'from-pink-500 to-rose-400',
  'from-amber-500 to-orange-400',
];

export function SkillCloud() {
  const { getTopSkills } = useSkills();
  const topSkills = getTopSkills(8); // Increased to show more skills

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="skills" className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 id="skills-heading" className="text-3xl md:text-display-sm font-bold text-foreground mb-6 tracking-tight">
            核心技术栈
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            深耕全栈开发多年，致力于构建高性能、可扩展的现代化应用，并在产品设计中融入用户体验思维。
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-5 max-w-4xl mx-auto"
        >
          {topSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              <div 
                className={`
                  px-8 py-4 rounded-2xl
                  bg-gradient-to-br ${skillColors[index % skillColors.length]}
                  text-white font-bold text-lg
                  shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/20
                  border border-white/10
                  transition-all duration-300
                  cursor-default
                `}
              >
                <span className="relative z-10">{skill.name}</span>
              </div>
              
              {/* Animated Glow effect */}
              <div 
                className={`
                  absolute inset-0 rounded-2xl
                  bg-gradient-to-br ${skillColors[index % skillColors.length]}
                  opacity-0 group-hover:opacity-40
                  blur-2xl transition-all duration-500 scale-90
                  -z-10
                `}
              />
              
              {/* Proficiency Tag */}
              <div className="absolute -bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="bg-background/90 backdrop-blur-md border border-border/50 px-2 py-0.5 rounded-full text-[10px] font-bold text-primary uppercase tracking-tighter shadow-sm">
                  {skill.weight}% Proficient
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-12"
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground/60 hover:text-primary transition-colors cursor-help">
            <span className="w-8 h-[1px] bg-muted-foreground/30" />
            探索更多技能领域
            <span className="w-8 h-[1px] bg-muted-foreground/30" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

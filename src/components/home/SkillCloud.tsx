import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/useSkills';

const skillColors = [
  'from-primary to-purple-500',
  'from-cyan-500 to-primary',
  'from-purple-500 to-pink-500',
  'from-primary to-cyan-400',
  'from-indigo-500 to-primary',
];

export function SkillCloud() {
  const { getTopSkills } = useSkills();
  const topSkills = getTopSkills(5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="skills" className="pt-20 pb-12 md:pt-32 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-headline-lg font-bold text-foreground mb-4">
            核心技能
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            多年技术沉淀，专注于全栈开发与产品设计
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto"
        >
          {topSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group relative"
            >
              <div 
                className={`
                  px-6 py-3 rounded-full
                  bg-gradient-to-r ${skillColors[index % skillColors.length]}
                  text-primary-foreground font-semibold
                  shadow-lg hover:shadow-xl
                  transition-all duration-300
                  cursor-default
                `}
              >
                <span className="relative z-10">{skill.name}</span>
              </div>
              
              {/* Glow effect on hover */}
              <div 
                className={`
                  absolute inset-0 rounded-full
                  bg-gradient-to-r ${skillColors[index % skillColors.length]}
                  opacity-0 group-hover:opacity-50
                  blur-xl transition-opacity duration-300
                  -z-10
                `}
              />
              
              {/* Weight indicator tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-card px-2 py-1 rounded text-xs text-muted-foreground whitespace-nowrap">
                  熟练度: {skill.weight}%
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional skill categories hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-base text-muted-foreground mt-8"
        >
          以及更多技术栈...
        </motion.p>
      </div>
    </section>
  );
}

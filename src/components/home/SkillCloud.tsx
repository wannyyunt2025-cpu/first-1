import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/useSkills';

export function SkillCloud() {
  const { getTopSkills } = useSkills();
  const topSkills = getTopSkills(10); // 展示更多技能

  return (
    <section id="skills" className="section">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            核心技能
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            多年技术沉淀，专注于全栈开发与产品设计
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {topSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="px-5 py-2 rounded-full border border-border
                              text-sm font-medium text-muted-foreground
                              transition-all duration-200
                              group-hover:border-primary group-hover:text-primary group-hover:shadow-sm">
                {skill.name}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional skill categories hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          以及更多技术栈...
        </motion.p>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/useSkills';

export function SkillCloud() {
  const { getTopSkills } = useSkills();
  const topSkills = getTopSkills(10); // 展示更多技能

  // 定义每个 Pill 的随机浮动动画
  const floatAnimation = (index: number) => ({
    y: ["-5%", "5%"],
    transition: {
      duration: 3 + Math.random() * 2, // 随机持续时间，避免同步
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
      delay: index * 0.2,
    }
  });

  return (
    <section id="skills" className="pt-20 pb-12 md:pt-32 md:pb-16 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative">
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

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto my-12 p-4">
          {topSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              // 基础浮动动画
              animate={floatAnimation(index)}
              // 初始入场动画
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* 背景光晕层 (Hover时显现) */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              
              {/* Pill 本体 */}
              <div className="relative px-6 py-2.5 bg-background-elevated border border-white/5 rounded-full 
                              text-sm font-medium text-muted-foreground cursor-default 
                              transition-all duration-300 backdrop-blur-md
                              group-hover:text-primary-foreground group-hover:border-primary/50 group-hover:shadow-glow-sm">
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
          className="text-center text-base text-muted-foreground mt-8"
        >
          以及更多技术栈...
        </motion.p>
      </div>
    </section>
  );
}

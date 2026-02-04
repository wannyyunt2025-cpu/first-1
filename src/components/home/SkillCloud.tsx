import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/useSkills';
import { useTheme } from '@/hooks/useTheme';

const skillColors = [
  'bg-indigo-50 text-indigo-700 border-indigo-100',
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-violet-50 text-violet-700 border-violet-100',
  'bg-blue-50 text-blue-700 border-blue-100',
  'bg-slate-50 text-slate-700 border-slate-100',
];

export function SkillCloud() {
  const { getTopSkills } = useSkills();
  const { style } = useTheme();
  const topSkills = getTopSkills(12);

  const isMinimalist = style === 'minimalist';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="skills" className={`py-24 md:py-32 transition-colors duration-700 ${
      isMinimalist ? 'bg-slate-50/30' : 'bg-background relative overflow-hidden'
    }`}>
      {!isMinimalist && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6">
        <div className={`flex flex-col gap-16 ${isMinimalist ? 'md:flex-row items-start' : 'items-center'}`}>
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: isMinimalist ? -20 : 0, y: isMinimalist ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`w-full ${isMinimalist ? 'md:w-1/3 text-left' : 'text-center mb-16'}`}
          >
            <h2 id="skills-heading" className={`text-sm font-black uppercase tracking-[0.2em] mb-6 ${
              isMinimalist ? 'text-primary' : 'text-primary'
            }`}>
              {isMinimalist ? 'Expertise' : '核心技术栈'}
            </h2>
            <h3 className={`font-black tracking-tighter leading-tight ${
              isMinimalist ? 'text-4xl md:text-5xl text-slate-900 mb-8' : 'text-3xl md:text-display-sm text-foreground mb-6'
            }`}>
              {isMinimalist ? <>Specializing in <br /> modern stacks.</> : '精通现代化技术栈'}
            </h3>
            <p className={`text-lg leading-relaxed ${
              isMinimalist ? 'text-slate-500 mb-8' : 'text-muted-foreground max-w-2xl mx-auto'
            }`}>
              {isMinimalist 
                ? 'I build scalable, performant, and accessible applications using the latest technologies and best practices in software engineering.'
                : '深耕全栈开发多年，致力于构建高性能、可扩展的现代化应用，并在产品设计中融入用户体验思维。'}
            </p>
            {isMinimalist && (
              <div className="flex items-center gap-4 text-slate-400">
                <div className="w-12 h-px bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-widest">Tech Stack 2024</span>
              </div>
            )}
          </motion.div>

          {/* Skill Cloud */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`w-full flex flex-wrap gap-3 ${isMinimalist ? 'md:w-2/3' : 'justify-center max-w-4xl mx-auto'}`}
          >
            {topSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                variants={itemVariants}
                whileHover={{ y: -2, scale: isMinimalist ? 1 : 1.05 }}
                className={isMinimalist 
                  ? `px-6 py-3 rounded-xl border text-sm font-bold transition-all duration-300 ${skillColors[index % skillColors.length]} hover:shadow-md hover:bg-white`
                  : "group relative"
                }
              >
                {isMinimalist ? (
                  skill.name
                ) : (
                  <>
                    <div className={`px-8 py-4 rounded-2xl bg-gradient-to-br ${[
                      'from-indigo-600 to-blue-500',
                      'from-emerald-500 to-teal-400',
                      'from-violet-600 to-purple-500',
                      'from-pink-500 to-rose-400',
                      'from-amber-500 to-orange-400',
                    ][index % 5]} text-white font-bold text-lg shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/20 border border-white/10 transition-all duration-300 cursor-default`}>
                      <span className="relative z-10">{skill.name}</span>
                    </div>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${[
                      'from-indigo-600 to-blue-500',
                      'from-emerald-500 to-teal-400',
                      'from-violet-600 to-purple-500',
                      'from-pink-500 to-rose-400',
                      'from-amber-500 to-orange-400',
                    ][index % 5]} opacity-0 group-hover:opacity-40 blur-2xl transition-all duration-500 scale-90 -z-10`} />
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

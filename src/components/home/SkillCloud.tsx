import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/useSkills';

const skillColors = [
  'bg-indigo-50 text-indigo-700 border-indigo-100',
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-violet-50 text-violet-700 border-violet-100',
  'bg-blue-50 text-blue-700 border-blue-100',
  'bg-slate-50 text-slate-700 border-slate-100',
];

export function SkillCloud() {
  const { getTopSkills } = useSkills();
  const topSkills = getTopSkills(12); // Show more for a professional cloud

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
    <section id="skills" className="py-24 md:py-32 bg-slate-50/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/3"
          >
            <h2 id="skills-heading" className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">
              Expertise
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
              Specializing in <br />
              modern stacks.
            </h3>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              I build scalable, performant, and accessible applications using the latest technologies and best practices in software engineering.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <div className="w-12 h-px bg-slate-200" />
              <span className="text-xs font-bold uppercase tracking-widest">Tech Stack 2024</span>
            </div>
          </motion.div>

          {/* Right: Skill Cloud */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full md:w-2/3 flex flex-wrap gap-3"
          >
            {topSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className={`
                  px-6 py-3 rounded-xl border text-sm font-bold transition-all duration-300
                  ${skillColors[index % skillColors.length]}
                  hover:shadow-md hover:bg-white
                `}
              >
                {skill.name}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

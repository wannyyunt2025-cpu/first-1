import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/useSkills';

export function PositioningSection() {
  const { getTopSkills } = useSkills();
  const topSkills = getTopSkills(6);
  const defaultSkills = ['AI 产品', '低代码', '信息结构', '用户体验', '工具链整合', '持续迭代'];
  const skillTags = topSkills.length > 0
    ? topSkills.map((skill) => ({
        name: skill.name,
        meta: skill.category || `权重 ${skill.weight}`,
      }))
    : defaultSkills.map((name) => ({ name, meta: '待沉淀' }));

  const positioningCards = [
    {
      title: "建筑学背景",
      body: "长期接触空间表达、方案汇报与复杂信息组织，习惯从结构与叙事一起思考问题。",
    },
    {
      title: "AI 工具学习",
      body: "持续上手 n8n、Coze、vibecoding、OpenClaw、Trae 等工具，把学习放到具体任务里验证。",
    },
    {
      title: "产品意识",
      body: "会主动关注真实需求、流程拆解、信息结构和用户体验，而不只是追求把工具跑通。",
    },
    {
      title: "实践项目",
      body: "正在用 AI 工具、低代码与代码协作方式，持续打磨个人主页系统，积累可复用的方法。",
    },
  ];

  return (
    <section id="positioning" className="scroll-mt-28 border-t py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
              当前定位
            </p>
            <h2 className="font-display text-3xl md:text-5xl">当前定位：成长型 AI 产品实践者</h2>
            <p className="max-w-md text-sm leading-7 md:text-base text-muted">
              我还在补足行业经验，但我希望把学习密度、工具理解、产品意识和持续迭代能力，尽可能真实地呈现在这个主页里。
            </p>
            <div className="ui-card mt-6 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                能力标签来自后台
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {skillTags.map((skill) => (
                  <span
                    key={skill.name}
                    className="rounded-full border px-3 py-2 text-xs bg-surface-2"
                    title={skill.meta}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {positioningCards.map((card, index) => (
              <motion.article
                key={card.title}
                className="ui-card interactive p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className="absolute left-0 top-5 bottom-5 w-1 rounded-full"
                  style={{ background: index === 0 ? 'var(--accent-solid)' : 'hsl(var(--border))' }}
                />
                <div className="pl-4">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {card.body}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

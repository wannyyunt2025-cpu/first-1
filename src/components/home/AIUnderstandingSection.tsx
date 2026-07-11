import { motion } from 'framer-motion';
import { useInsightCards } from '@/hooks/useInsightCards';

export function AIUnderstandingSection() {
  const { publicCards } = useInsightCards();

  const fallbackUnderstanding = [
    {
      title: "AI 擅长加速原型",
      body: "它能快速生成结构、文案、代码草稿和方案备选，适合把模糊想法推进到可讨论状态。",
    },
    {
      title: "AI 不能替代真实判断",
      body: "需求是否成立、用户是否真的需要，依然要靠人去访谈、验证和取舍。",
    },
    {
      title: "工具链比单点工具更重要",
      body: "n8n、Coze、Trae、低代码和模型能力更像是协作链路，组合方式决定结果质量。",
    },
    {
      title: "产品能力是下一阶段重点",
      body: "我正在补足需求分析、场景判断、用户访谈和结果验证能力，让实践更接近真实业务。",
    },
  ];

  const aiUnderstanding = publicCards.length > 0
    ? publicCards.slice(0, 4).map((card) => ({
        title: card.title,
        body: card.content,
      }))
    : fallbackUnderstanding;

  return (
    <section id="understanding" className="scroll-mt-28 border-t py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
              AI 理解
            </p>
            <h2 className="font-display text-3xl md:text-5xl">我对 AI 工具的理解</h2>
            <p className="text-sm leading-7 md:text-base text-muted">
              我更愿意把 AI 看成一组需要被组合、被验证、被约束的能力，而不是一个万能答案生成器。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {aiUnderstanding.map((item, index) => (
              <motion.article
                key={item.title}
                className="ui-card interactive p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{item.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

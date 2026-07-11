import { motion } from 'framer-motion';
import { useLearningRecords } from '@/hooks/useLearningRecords';

export function LearningSection() {
  const { publicRecords } = useLearningRecords();

  const fallbackRecords = [
    {
      title: "n8n 自动化练习",
      type: "工具学习",
      time: "持续学习",
      output: "做过信息同步、内容整理与流程串接的小型自动化。",
      reflection: "学习了节点编排、触发器设置和流程拆分，下一步需要补足异常处理与稳定性判断。",
    },
    {
      title: "Coze 智能体搭建",
      type: "工具学习",
      time: "持续学习",
      output: "尝试过面向问答与引导场景的基础智能体原型。",
      reflection: "理解了角色设计、对话流程和知识库组织方式，后续需要强化真实任务闭环。",
    },
    {
      title: "AI 短剧制作练习",
      type: "内容实践",
      time: "持续学习",
      output: "体验过从脚本到分镜再到生成内容的链路协作。",
      reflection: "更直观地看到 AI 在内容生产中的提效与限制，也意识到创意判断仍然重要。",
    },
    {
      title: "Vibecoding 页面 / 工具原型",
      type: "项目实践",
      time: "持续学习",
      output: "做过页面原型、小工具界面与结构调整尝试。",
      reflection: "理解自然语言与代码工具协作时的上下文组织方式，后续要更重视可维护性。",
    },
    {
      title: "动态个人主页",
      type: "持续迭代",
      time: "长期项目",
      output: "用 Trae、Codex、Supabase、Vercel 等工具持续打磨个人展示、后台管理和简历能力。",
      reflection: "它不是一次性页面，而是把学习内容转化成个人产品的长期容器。",
    },
    {
      title: "OpenClaw 自动化实践",
      type: "工具学习",
      time: "持续学习",
      output: "做过基础任务执行与操作流程验证。",
      reflection: "认识到浏览器自动化与 Agent 操作边界并不完全等同，需要结合真实场景验证。",
    },
    {
      title: "训练营志愿者 / 先锋官",
      type: "社区协作",
      time: "持续参与",
      output: "在学习社区中参与协作、答疑和共创。",
      reflection: "这类经历更能体现持续学习、沟通和协作，但还需要沉淀成具体案例。",
    },
  ];

  const learningRecords = publicRecords.length > 0
    ? publicRecords.slice(0, 8).map((record) => ({
        title: record.title,
        type: record.type === 'tool'
          ? '工具学习'
          : record.type === 'bootcamp'
            ? '训练营'
            : record.type === 'volunteer'
              ? '志愿者/先锋官'
              : record.type === 'project'
                ? '项目实践'
                : '其他',
        time: record.time,
        output: record.output || '后台已记录这段经历，后续可继续补充具体产出。',
        reflection: record.reflection || record.role || '这段经历帮助我继续理解 AI 工具的能力边界和适用场景。',
      }))
    : fallbackRecords;

  return (
    <section id="learning" className="scroll-mt-28 border-t py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
              学习路径
            </p>
            <h2 className="font-display text-3xl md:text-5xl">AI 学习与实践路径</h2>
            <p className="max-w-2xl text-sm leading-7 md:text-base text-muted">
              我还在补行业经验，但已经在持续理解工具、流程和边界。相比把经历做成证书墙，我更希望把它们呈现为一条不断推进的学习轨迹。
            </p>
          </div>
          <div className="ui-card p-5 md:w-[340px]">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              展示规则
            </div>
            <p className="mt-3 text-sm leading-7 text-muted">
              从左到右表示学习与实践推进。每个节点同样大小，可横向拖动；长期项目用标签标记，但不放大成巨卡。
            </p>
          </div>
        </div>

        <div className="mt-10 overflow-hidden">
          <div className="relative">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-border md:block" aria-hidden="true" />
            <motion.div
              className="flex cursor-grab gap-4 overflow-x-auto pb-4 pt-1 active:cursor-grabbing md:gap-5"
              drag="x"
              dragConstraints={{ left: -520, right: 0 }}
              dragElastic={0.08}
            >
              {learningRecords.map((record, index) => {
                const isLongTerm = record.type.includes('持续') || record.title.includes('个人主页');

                return (
                  <motion.article
                    key={record.title}
                    className="interactive relative flex min-h-[300px] w-[280px] shrink-0 flex-col rounded-[24px] border bg-surface p-5 md:w-[320px]"
                    style={{
                      borderColor: isLongTerm ? 'var(--accent-solid)' : 'hsl(var(--border))',
                      background: isLongTerm ? 'var(--accent-soft)' : 'var(--surface)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                  >
                    <div
                      className="absolute -top-[21px] left-6 hidden h-4 w-4 rounded-full border bg-surface md:block"
                      style={{
                        borderColor: isLongTerm ? 'var(--accent-solid)' : 'hsl(var(--border))',
                        background: isLongTerm ? 'var(--accent-solid)' : 'var(--surface)',
                      }}
                      aria-hidden="true"
                    />

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                          {record.time}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold">{record.title}</h3>
                      </div>
                      <span className="shrink-0 rounded-full border px-3 py-1.5 text-xs bg-surface-2">
                        {record.type}
                      </span>
                    </div>

                    <div className="mt-5 space-y-4 text-sm leading-7 text-muted">
                      <div>
                        <div className="text-xs font-semibold text-foreground">产出 / 做了什么</div>
                        <p className="mt-1 line-clamp-4">{record.output}</p>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">理解 / 反思</div>
                        <p className="mt-1 line-clamp-4">{record.reflection}</p>
                      </div>
                    </div>

                    {isLongTerm && (
                      <div className="mt-auto pt-5">
                        <span className="rounded-full border px-3 py-1.5 text-xs font-semibold bg-surface">
                          持续迭代中
                        </span>
                      </div>
                    )}
                  </motion.article>
                );
              })}
            </motion.div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 text-xs text-muted">
            <span>从左到右查看学习路径</span>
            <span>可横向拖动 / 滚动</span>
          </div>
        </div>
      </div>
    </section>
  );
}

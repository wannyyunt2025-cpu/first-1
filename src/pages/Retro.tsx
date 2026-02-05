import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  ArrowLeft,
  Bot,
  BookOpen,
  Brain,
  CalendarDays,
  ClipboardCheck,
  Code,
  Database,
  FileText,
  GitCommit,
  Lightbulb,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProfile } from '@/hooks/useProfile';

type AcceptanceShot = {
  key: string;
  title: string;
  note: string;
  image?: string;
};

const acceptanceShotsDefinition: AcceptanceShot[] = [
  {
    key: 'shot-hero',
    title: '首页首屏（3 秒核心认知）',
    note: '展示姓名/Title/Slogan + CTA + 氛围背景与艺术字体。',
    image: '/shots/hero.png',
  },
  {
    key: 'shot-projects',
    title: '项目列表与详情页（STAR）',
    note: '展示项目卡片与详情页结构，突出 Action/Result。',
    image: '/shots/projects.png',
  },
  {
    key: 'shot-admin',
    title: '管理后台（资料/技能/项目）',
    note: '展示 CRUD 能力与编辑后的即时生效。',
    image: '/shots/admin-profile.png',
  },
  {
    key: 'shot-migration',
    title: '数据迁移（localStorage → Supabase）',
    note: '展示迁移入口、迁移成功提示与云端表验证截图位。',
    image: '/shots/admin-migration.png',
  },
  {
    key: 'shot-comments',
    title: '留言审核链路（pending → approved）',
    note: '展示访客提交、后台审核、前台仅展示 approved。',
    image: '/shots/admin-comments.png',
  },
  {
    key: 'shot-ai',
    title: 'AI 数字分身对话',
    note: '展示“问技能/问项目/问联系方式”的三类对话结果。',
    image: '/shots/ai-chat.png',
  },
  {
    key: 'shot-resume',
    title: '简历生成（JD → 定制输出）',
    note: '展示输入 JD、生成结果与记录留存（如有）。',
    image: '/shots/admin-resume.png',
  },
];

function ShotFrame({
  src,
  title,
  note,
}: {
  src?: string;
  title: string;
  note: string;
}) {
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);
  const showImage = Boolean(src) && !hasError;

  return (
    <div className="mt-4 rounded-lg border border-white/15 bg-background/20 overflow-hidden">
      <button
        type="button"
        className="block w-full text-left"
        onClick={() => setOpen(true)}
        disabled={!showImage}
      >
        <div className={showImage ? 'relative w-full bg-background/20' : 'relative w-full bg-background/20 aspect-video'}>
          {!showImage && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/70 px-6 text-center">
              待补充截图（建议 16:9）
            </div>
          )}
          {src && (
            <img
              src={src}
              alt={title}
              className={showImage ? 'w-full h-auto object-contain' : 'hidden'}
              loading="lazy"
              onError={() => setHasError(true)}
            />
          )}
        </div>
      </button>

      <div className="flex items-center justify-between gap-4 p-3 border-t border-white/10">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground truncate">{note}</div>
        </div>
        {showImage && (
          <div className="shrink-0 text-xs text-muted-foreground/70">
            点击预览
          </div>
        )}
      </div>

      {showImage && src && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent hideClose className="max-w-[95vw] w-[95vw] max-h-[92vh] h-[92vh] p-0 overflow-hidden bg-background border-border/50">
            <div className="h-full flex flex-col">
              <DialogHeader className="p-6 pb-4">
                <div className="flex items-center justify-between gap-4">
                  <DialogTitle className="font-display">{title}</DialogTitle>
                  <div className="flex items-center gap-2">
                    <a
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      新标签打开
                    </a>
                    <DialogClose asChild>
                      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                        关闭
                      </Button>
                    </DialogClose>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">{note}</div>
              </DialogHeader>
              <div className="flex-1 overflow-auto px-6 pb-6">
                <div className="bg-background-elevated/20 border border-white/10 rounded-lg overflow-hidden">
                  <img src={src} alt={title} className="w-full h-auto object-contain" />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

const Retro = () => {
  const { profile } = useProfile();

  useEffect(() => {
    const name = profile?.name?.trim();
    document.title = name ? `复盘 | ${name}` : '复盘 | 动态个人主页';
  }, [profile?.name]);

  const journeySteps = [
    {
      index: '01',
      title: '需求洞察：为什么需要“动态个人主页”',
      goal: '把分散的个人信息整合成一个对外可传播、对内可沉淀的数据资产。',
      inputs: [
        '个人信息分散在 Word 简历 / GitHub / 多个平台，访客无法快速建立“核心认知”',
        '市面个人主页产品价格普遍偏高，且模板化严重，难体现个人独特性',
      ],
      outputs: [
        '明确目标：对外 3 秒建立核心认知；对内用结构化录入梳理经历并支持简历生成',
        '确定受众：面试官/HR（快速评估）+ 同行/伙伴（技术交流）',
      ],
      acceptance: [
        '首页 1 屏给出：身份定位（Title）+ 核心主张（Slogan）+ 代表性能力（技能/项目入口）',
        '全站信息可持续维护（有后台或可编辑的能力），不是一次性静态网页',
      ],
    },
    {
      index: '02',
      title: 'PRD 与信息架构：先定义 MVP 再谈细节',
      goal: '将“个人主页”拆成可验证的最小闭环，并明确每一块的输入/输出。',
      inputs: [
        '用户目标与受众画像（HR/同行/合作方）',
        '可展示的结构化数据：profile / skills / projects / education / portfolios / contact / comments',
      ],
      outputs: [
        'MVP 范围（V1.0 闭环）：展示前台 + CMS 后台 + 留言板（审核）+ 简历生成 + AI 数字分身',
        '页面结构：关于我 → 技能 → 项目 → 留言；新增“复盘页”用于过程沉淀',
      ],
      acceptance: [
        '访客侧：能浏览公开信息、提交留言、与数字分身对话、查看项目详情',
        '管理侧：能编辑资料/技能/项目；能审核留言；能做数据迁移',
      ],
    },
    {
      index: '03',
      title: '数据建模：从 localStorage 演进到云端数据库',
      goal: '让内容可长期维护，并支持跨设备访问；同时保留“无后端也能跑”的回退能力。',
      inputs: [
        '本地数据原型：localStorage 作为快速验证的最小数据源',
        '云端数据目标：Supabase 表结构 + 权限策略（RLS/GRANT）',
      ],
      outputs: [
        '数据库表：profiles / skills / projects / education / portfolios / comments / resume_records',
        '迁移脚本：001_initial_schema.sql + 002_comments_rls_and_grants.sql',
        '管理后台提供“一键迁移”：检测本地数据 → 写入云端 → 刷新验证',
      ],
      acceptance: [
        '关闭浏览器再打开，数据仍存在（云端持久化验证）',
        '未配置 Supabase 环境变量时，自动回退到 localStorage 模式（可用性兜底）',
      ],
    },
    {
      index: '04',
      title: '前台体验：让访客在 3 秒内建立核心认知',
      goal: '用最少的信息，呈现最强的“职业印象”，并提供清晰的下一步动作。',
      inputs: ['Profile（姓名/Title/Slogan）', 'Skills（按权重排序）', 'Projects（STAR）'],
      outputs: [
        'Hero：身份与主张 + CTA（项目/联系方式/复盘）',
        '技能云：突出 Top skills（权重）',
        '项目列表：卡片化摘要 + 详情页承载 STAR',
      ],
      acceptance: [
        '移动端与桌面端都可读；动效克制，不影响信息获取',
        '文本与背景对比度足够；按钮 hover/focus 状态清晰',
      ],
    },
    {
      index: '05',
      title: 'CMS 后台：让内容维护变成可重复流程',
      goal: '把“更新个人信息”从改代码，变成后台表单操作。',
      inputs: ['profiles/skills/projects/education/portfolios 的 CRUD 需求'],
      outputs: [
        '管理员入口 + 管理后台页面',
        'ProfileForm / SkillForm / ProjectForm / EducationForm 等编辑能力',
        '数据迁移模块（localStorage → Supabase）',
      ],
      acceptance: [
        '编辑后立即反映到前台（刷新可见）',
        '关键字段校验明确（如必填、日期格式、公开性设置）',
      ],
    },
    {
      index: '06',
      title: '留言系统：以“可控公开”为核心的审核链路',
      goal: '让访客能互动，但内容展示必须可控，避免垃圾信息影响主页质感。',
      inputs: ['访客匿名留言需求', '前台只展示 approved 的约束', '管理员审核/回复/删除需求'],
      outputs: [
        '留言状态：pending / approved（前台仅展示 approved）',
        'Supabase 权限策略：anon 可插入 pending；anon 仅可读 approved；管理员可读写全部（推荐）',
        '后台审核流程：审核/回复/删除，形成闭环',
      ],
      acceptance: [
        '访客提交后不立即公开；管理员审核通过后出现在前台',
        '云端写入不再出现“策略通过但权限不足”的插入失败（补齐 GRANT）',
      ],
    },
    {
      index: '07',
      title: 'AI 数字分身：把结构化数据变成可对话的能力展示',
      goal: '让访客用提问的方式了解你，并让回答“真实、可追溯、可控隐私”。',
      inputs: [
        'System Prompt 模板：角色定义 + 知识库（技能/项目/教育/作品）+ 互动规则',
        '结构化数据注入：skills_list / projects_list_star / education_list / portfolios_list',
      ],
      outputs: [
        '真实性原则：严禁虚构；不清楚就明确说明',
        '隐私盾：联系方式按 public/semi/private 控制披露策略',
        'STAR 法则回答项目，优先引用真实案例',
      ],
      acceptance: [
        '问技能：能给出权重/擅长程度与对应项目佐证',
        '问联系方式：严格遵守可见性策略（private 不透露，semi 先确认目的）',
      ],
    },
    {
      index: '08',
      title: '智能简历生成：从 JD 到定制简历的产品闭环',
      goal: '把“结构化录入的经历”转化为“岗位定制的表达方式”。',
      inputs: ['JD 文本', '个人项目/技能库', '目标岗位关键词'],
      outputs: [
        '解析 JD：提取关键词/职责/要求',
        '匹配经历：优先选取相关项目（STAR）与技能',
        '生成简历：可复制的结构化文本，并记录生成记录（resume_records）',
      ],
      acceptance: [
        '同一份经历在不同 JD 下表达不同重点（岗位适配）',
        '生成内容可追溯：知道使用了哪些项目/技能作为支撑',
      ],
    },
    {
      index: '09',
      title: '验收与发布：把“做出来”变成“可用、可维护、可扩展”',
      goal: '用清晰的验收清单确保每个模块能跑通，并为迭代留出空间。',
      inputs: ['前台展示清单', '后台管理清单', '数据持久化与权限策略清单'],
      outputs: [
        '前台验收：个人信息/技能云/项目列表/留言板（approved）',
        '后台验收：编辑资料、管理技能/项目、审核留言、迁移数据',
        '部署要求：配置环境变量（Supabase / AI API）并触发重新部署',
      ],
      acceptance: [
        '功能闭环：CMS 后台、展示前台、简历生成、留言板（审核）全部可用',
        '风险可控：权限策略合理、敏感信息不泄露、可回退本地模式',
      ],
    },
  ];

  const aiLearningPath = [
    {
      title: '把 PRD 写清楚再让 AI 写代码',
      desc: '先明确“目标用户/核心场景/验收标准”，再让 AI 生成实现方案；避免边写边改导致成本上升。',
    },
    {
      title: '给 AI 足够上下文，但控制任务边界',
      desc: '把相关文件/数据结构/约束发给 AI，同时把输出限制为“改哪几个文件、达到什么效果”，减少跑偏。',
    },
    {
      title: '用“小步提交”对抗不可控',
      desc: '每次只改一个模块：先跑通，再优化；把“能用”放在“好看”之前。',
    },
    {
      title: '把系统性问题沉淀为文档与脚本',
      desc: '例如 Supabase 接入、RLS/GRANT、数据迁移，都写成可执行的步骤与 SQL 脚本，降低复现成本。',
    },
    {
      title: '把“对话体验”当产品而不是功能',
      desc: '数字分身的 Prompt 必须可追溯（结构化数据注入）、可控（隐私盾）、可信（真实性原则）。',
    },
  ];

  const mvpTimeline = [
    {
      date: '2026-01-19',
      version: 'init',
      title: '项目初始化与本地数据原型',
      details: [
        '创建项目骨架与基础页面结构',
        '以 localStorage 作为最小数据源，先跑通展示与编辑的核心路径',
      ],
      verify: ['首页可访问：关于我/技能/项目/留言可渲染', '基础数据写入后刷新仍可读（localStorage）'],
    },
    {
      date: '2026-01-19',
      version: 'feat',
      title: '接入 Supabase：资料/技能/项目/留言数据云端化',
      details: [
        '建立 Supabase 表结构与迁移脚本（001 schema）',
        '实现数据层“数据库优先 + 本地回退”的策略',
        '迁移逻辑防重复，支持一键迁移本地数据到云端',
      ],
      verify: ['配置 .env.local 后数据写入云端', '未配置 Supabase 时自动回退本地模式'],
    },
    {
      date: '2026-01-19',
      version: 'feat',
      title: '后台管理员能力与留言可见性链路打通',
      details: [
        '引入 Supabase Auth 管理员登录（用于后台审核与管理能力）',
        '修复后台能看到新提交留言、提交后即时刷新等体验问题',
      ],
      verify: ['管理员登录后可读写数据', '访客留言提交后后台可见 pending'],
    },
    {
      date: '2026-01-20',
      version: 'feat',
      title: '接入“阿里百炼”智能体：简历生成能力',
      details: [
        '支持输入 JD → 抽取需求 → 匹配项目/技能 → 生成岗位定制简历',
        '形成“结构化录入 → 定制输出”的闭环',
      ],
      verify: ['同一套经历对不同 JD 输出重点不同', '生成结果可复制、可存档'],
    },
    {
      date: '2026-01-27',
      version: 'refactor',
      title: '教育经历模块数据库化与多端同步修复',
      details: [
        '教育模块重构为数据库优先模式',
        '修复教育经历无法同步到云端的问题',
      ],
      verify: ['后台编辑教育经历后刷新仍存在', '换设备登录后数据一致'],
    },
    {
      date: '2026-02-04',
      version: 'v1.1.0 ~ v1.2.1',
      title: '安全与体验强化：Serverless API + UI/UX 迭代',
      details: [
        '将简历生成 API 迁移至 Vercel Serverless Function，提升密钥安全性',
        '修复构建与语法问题，提升首屏加载（骨架屏）与视觉可读性',
        '整站 UI/UX 风格迭代（多轮），验证“氛围感”与信息层级并存',
      ],
      verify: ['构建通过，线上可用', '首屏无明显跳变，关键文字对比度充足'],
    },
    {
      date: '2026-02-05',
      version: 'v1.3.0',
      title: 'AI 数字分身上线：对话式展示能力',
      details: [
        '引入数字分身入口，支持访客对话了解技能/项目/背景',
        'System Prompt 采用结构化数据注入，项目回答优先 STAR',
      ],
      verify: ['问项目能按 STAR 回答', '问技能能结合权重与案例说明'],
    },
    {
      date: '2026-02-05',
      version: 'v1.3.1 ~ v1.3.2',
      title: '修复“简历生成 vs 数字分身”串台：隔离 AppID 与会话',
      details: [
        '拆分百炼 AppID：简历生成与聊天分开配置，避免复用导致上下文污染',
        '引入 sessionId，保证每个访客会话隔离；强制 System Prompt 注入，减少跑偏',
      ],
      verify: ['不同功能调用不同 AppID', '刷新页面不继承旧对话历史'],
    },
    {
      date: '2026-02-05',
      version: 'v1.4.0',
      title: 'Lofi Midnight 视觉定稿：全局沉浸式背景与艺术字体',
      details: [
        '全局固定背景（噪点 + 模糊图 + 光斑），滚动连贯',
        '大标题艺术字体与超大排版，强化第一印象',
      ],
      verify: ['全站滚动背景连贯，无割裂', 'Typography 层级清晰且可读'],
    },
  ];

  const decisionRecords = [
    {
      title: '数据存储：localStorage 先跑通，再升级 Supabase',
      context: '需要快速验证 MVP，但也要保证后续可维护、可跨设备。',
      options: ['直接上 Supabase（成本高、接入慢）', '只做 localStorage（上线后难维护）', 'localStorage → Supabase 演进（推荐）'],
      choice: '采用“数据库优先 + 本地回退”的双模式。',
      why: [
        '前期可快速验证；后期可迁移到云端形成长期资产',
        '出现环境变量缺失或云端不可用时仍可使用（可用性兜底）',
      ],
      impact: ['带来迁移与一致性成本，需要迁移脚本与去重策略', '需要清晰的验收步骤与文档化接入流程'],
      evidence: ['SUPABASE_SETUP.md', 'QUICK_START.md'],
    },
    {
      title: '留言系统：默认不公开，采用审核后展示（approved-only）',
      context: '主页是“个人品牌资产”，内容必须可控；同时又要保留互动感。',
      options: ['公开即展示（风险高）', '彻底关闭留言（失去互动）', '访客可提交，前台仅展示 approved（推荐）'],
      choice: '引入 pending/approved 状态，前台只展示 approved。',
      why: ['控制内容质量，避免垃圾信息污染首页', '保留互动链路，便于管理员筛选与回复'],
      impact: ['需要后台审核能力', '需要 Supabase RLS + GRANT 配置正确，否则会出现写入失败'],
      evidence: ['SUPABASE_COMMENTS_POLICY.md', 'SUPABASE_SETUP.md'],
    },
    {
      title: '后台鉴权：使用 Supabase Auth（推荐路径）',
      context: '管理员需要查看 pending/rejected、执行审核/删除等敏感操作。',
      options: ['仅用前端 anon key（权限不足）', '自建后端 + service_role（复杂）', 'Supabase Auth + admins 表 + RLS（推荐）'],
      choice: '采用 Supabase Auth 登录后台，并用 admins 表控制管理员权限。',
      why: ['不引入自建后端，安全边界清晰', '结合 RLS 策略可精细控制读写范围'],
      impact: ['需要配置管理员账号与 admins 表', '需要在项目文档中给出明确配置步骤'],
      evidence: ['SUPABASE_COMMENTS_POLICY.md'],
    },
    {
      title: 'AI 数字分身：先定 Prompt 规则，再做数据注入',
      context: '数字分身必须“可信”，不能胡编乱造，且不能泄露隐私。',
      options: ['直接让模型自由发挥（风险高）', '用模板 + 结构化数据注入 + 规则约束（推荐）'],
      choice: '采用 System Prompt 设计文档 + 数据注入方案 + 隐私盾。',
      why: ['回答可追溯（基于 skills/projects/education 数据）', '能严格执行联系方式可见性策略'],
      impact: ['需要维护 Prompt 模板与注入逻辑', '需要 AppID 隔离与会话隔离避免串台'],
      evidence: ['AI_DIGITAL_HUMAN_SYSTEM_PROMPT.md', 'SYSTEM_PROMPT_DESIGN.md'],
    },
    {
      title: '简历生成：走 Serverless，避免前端暴露密钥',
      context: '涉及第三方 API 密钥，不能放在前端环境变量中。',
      options: ['前端直连第三方 API（泄露风险）', 'Serverless Function 代理（推荐）'],
      choice: '把简历生成 API 迁移到 Vercel Serverless Function。',
      why: ['密钥不进入浏览器', '便于做权限/日志/限流等增强'],
      impact: ['本地 dev 需要相应代理或用 vercel dev', '部署需配置生产环境变量'],
      evidence: ['SUPABASE_SETUP.md（部署变量章节）'],
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* 全局背景复用 (Fixed) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay bg-noise"></div>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-20 mix-blend-soft-light"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop")',
            filter: 'blur(8px) contrast(1.2)'
          }}
        ></div>
        {/* 光影动画 */}
        <div className="absolute inset-0 overflow-hidden">
           <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-1/4 -left-1/4 w-2/3 h-2/3 bg-accent/10 rounded-full blur-[120px]"
          />
        </div>
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 md:px-6 pt-24 pb-20">
          {/* Back Button */}
          <Link to="/">
            <Button variant="ghost" className="mb-8 gap-2 text-muted-foreground hover:text-primary pl-0 hover:bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Button>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center max-w-3xl mx-auto"
          >
            <h1 className="text-display-sm md:text-display-lg font-bold mb-6 text-gradient-primary font-display tracking-tight">
              Building This Portfolio
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light font-display italic">
              从零到一的 AI 结对编程之旅：复盘与思考
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                一句话
              </div>
              <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                用结构化数据驱动的动态主页：展示 + CMS + 审核 + 对话 + 简历生成。
              </div>
            </div>
            <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Target className="h-4 w-4 text-primary" />
                目标
              </div>
              <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                对外 3 秒建立核心认知；对内把经历沉淀成可维护的数据资产。
              </div>
            </div>
            <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                V1.0 闭环
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline" className="border-white/10 text-muted-foreground">展示前台</Badge>
                <Badge variant="outline" className="border-white/10 text-muted-foreground">CMS 后台</Badge>
                <Badge variant="outline" className="border-white/10 text-muted-foreground">留言审核</Badge>
                <Badge variant="outline" className="border-white/10 text-muted-foreground">AI 对话</Badge>
                <Badge variant="outline" className="border-white/10 text-muted-foreground">简历生成</Badge>
              </div>
            </div>
            <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                关键取舍
              </div>
              <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                localStorage 快速验证 → Supabase 云端化；留言默认不公开；Prompt 强约束防胡编。
              </div>
            </div>
          </div>

          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="w-full justify-start flex flex-wrap bg-background-elevated/30 backdrop-blur-md border border-white/10">
              <TabsTrigger value="timeline" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                时间轴
              </TabsTrigger>
              <TabsTrigger value="decisions" className="gap-2">
                <Sparkles className="h-4 w-4" />
                决策
              </TabsTrigger>
              <TabsTrigger value="journey" className="gap-2">
                <Rocket className="h-4 w-4" />
                全流程
              </TabsTrigger>
              <TabsTrigger value="acceptance" className="gap-2">
                <ClipboardCheck className="h-4 w-4" />
                验收/路演
              </TabsTrigger>
              <TabsTrigger value="learning" className="gap-2">
                <BookOpen className="h-4 w-4" />
                学习复盘
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-6">
              <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl">
                <Accordion type="multiple" className="w-full">
                  {mvpTimeline.map((item) => (
                    <AccordionItem key={`${item.date}-${item.version}-${item.title}`} value={`${item.date}-${item.title}`} className="border-white/10 px-6">
                      <AccordionTrigger className="hover:no-underline py-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 text-left w-full">
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <Badge variant="outline" className="border-white/10 text-muted-foreground">{item.date}</Badge>
                            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10">
                              <GitCommit className="h-3.5 w-3.5 mr-1" />
                              {item.version}
                            </Badge>
                          </div>
                          <div className="font-display font-semibold text-foreground">{item.title}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-background-elevated/30 border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                              <Lightbulb className="h-4 w-4 text-primary" />
                              本阶段交付
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {item.details.map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                  <span className="mt-2 h-1 w-1 rounded-full bg-primary/60" />
                                  <span>{x}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-background-elevated/30 border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                              <ClipboardCheck className="h-4 w-4 text-primary" />
                              验证方式
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {item.verify.map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                  <span className="mt-2 h-1 w-1 rounded-full bg-primary/60" />
                                  <span>{x}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="decisions" className="mt-6">
              <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl">
                <Accordion type="multiple" className="w-full">
                  {decisionRecords.map((d) => (
                    <AccordionItem key={d.title} value={d.title} className="border-white/10 px-6">
                      <AccordionTrigger className="hover:no-underline py-5">
                        <div className="flex items-center gap-2 text-left w-full">
                          <Sparkles className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-display font-semibold text-foreground">{d.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="text-sm text-muted-foreground leading-relaxed">{d.context}</div>
                        <div className="grid lg:grid-cols-2 gap-6 mt-6">
                          <div className="bg-background-elevated/30 border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                              <Target className="h-4 w-4 text-primary" />
                              备选方案
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {d.options.map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                  <span className="mt-2 h-1 w-1 rounded-full bg-primary/60" />
                                  <span>{x}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-background-elevated/30 border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                              <ShieldCheck className="h-4 w-4 text-primary" />
                              最终选择
                            </div>
                            <div className="text-sm text-foreground leading-relaxed">{d.choice}</div>
                            <div className="mt-4">
                              <div className="text-sm font-semibold text-foreground mb-2">为什么这么做</div>
                              <ul className="space-y-2 text-sm text-muted-foreground">
                                {d.why.map((x) => (
                                  <li key={x} className="flex items-start gap-2">
                                    <span className="mt-2 h-1 w-1 rounded-full bg-primary/60" />
                                    <span>{x}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="mt-4">
                              <div className="text-sm font-semibold text-foreground mb-2">代价 / 影响</div>
                              <ul className="space-y-2 text-sm text-muted-foreground">
                                {d.impact.map((x) => (
                                  <li key={x} className="flex items-start gap-2">
                                    <span className="mt-2 h-1 w-1 rounded-full bg-primary/60" />
                                    <span>{x}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="mt-4">
                              <div className="text-sm font-semibold text-foreground mb-2">依据文档</div>
                              <div className="flex flex-wrap gap-2">
                                {d.evidence.map((x) => (
                                  <Badge key={x} variant="outline" className="border-white/10 text-muted-foreground">
                                    <FileText className="h-3.5 w-3.5 mr-1" />
                                    {x}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="journey" className="mt-6">
              <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl">
                <Accordion type="multiple" className="w-full">
                  {journeySteps.map((step) => (
                    <AccordionItem key={step.index} value={step.index} className="border-white/10 px-6">
                      <AccordionTrigger className="hover:no-underline py-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 text-left w-full">
                          <Badge variant="outline" className="border-white/10 text-muted-foreground w-fit">{step.index}</Badge>
                          <div className="min-w-0">
                            <div className="font-display font-semibold text-foreground">{step.title}</div>
                            <div className="text-sm text-muted-foreground mt-1">{step.goal}</div>
                          </div>
                          <div className="flex flex-wrap gap-2 md:ml-auto">
                            {step.index === '03' && (
                              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10">
                                <Database className="h-3.5 w-3.5 mr-1" />
                                Supabase
                              </Badge>
                            )}
                            {step.index === '06' && (
                              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10">
                                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                                审核
                              </Badge>
                            )}
                            {step.index === '07' && (
                              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10">
                                <Bot className="h-3.5 w-3.5 mr-1" />
                                数字分身
                              </Badge>
                            )}
                            {step.index === '08' && (
                              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10">
                                <FileText className="h-3.5 w-3.5 mr-1" />
                                简历生成
                              </Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="bg-background-elevated/30 border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                              <Target className="h-4 w-4 text-primary" />
                              输入 / 约束
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {step.inputs.map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                  <span className="mt-2 h-1 w-1 rounded-full bg-primary/60" />
                                  <span>{x}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-background-elevated/30 border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                              <Lightbulb className="h-4 w-4 text-primary" />
                              输出 / 交付物
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {step.outputs.map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                  <span className="mt-2 h-1 w-1 rounded-full bg-primary/60" />
                                  <span>{x}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-background-elevated/30 border border-white/10 rounded-xl p-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                              <ClipboardCheck className="h-4 w-4 text-primary" />
                              验收标准
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {step.acceptance.map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                  <span className="mt-2 h-1 w-1 rounded-full bg-primary/60" />
                                  <span>{x}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="acceptance" className="mt-6">
              <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                <Accordion type="multiple" defaultValue={['shots']} className="w-full">
                  <AccordionItem value="shots" className="border-white/10">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        验收截图位（逐张替换）
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2 gap-5">
                        {acceptanceShotsDefinition.map((s) => (
                          <div key={s.key} className="bg-background-elevated/30 border border-white/10 rounded-xl p-5">
                            <div className="font-semibold text-foreground">{s.title}</div>
                            <ShotFrame src={s.image} title={s.title} note={s.note} />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="learning" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground font-display">
                    <Sparkles className="h-5 w-5 text-primary" />
                    这次我验证了什么
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <div>AI 的价值不是“替我写代码”，而是提升决策与落地效率：先定范围与验收，再快速实现与排错。</div>
                    <div>真正的交付不是单页 UI，而是可维护的闭环：展示、编辑、审核、对话、生成 + 数据与权限策略。</div>
                  </div>
                </div>

                <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground font-display">
                    <BookOpen className="h-5 w-5 text-primary" />
                    给伙伴的 AI 学习路径（可复用）
                  </div>
                  <div className="mt-4 space-y-3">
                    {aiLearningPath.map((item) => (
                      <div key={item.title} className="bg-background-elevated/30 border border-white/10 rounded-xl p-5">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <Code className="h-4 w-4 text-primary" />
                          {item.title}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 font-semibold text-foreground mb-3">
                    <Bot className="h-5 w-5 text-primary" />
                    对话能力
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    Prompt 先定规则：真实性 + 隐私盾 + STAR，保证可信且可控。
                  </div>
                </div>
                <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 font-semibold text-foreground mb-3">
                    <Database className="h-5 w-5 text-primary" />
                    数据能力
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    结构化录入是底座：后台维护、对话注入、简历生成、迁移复现都依赖数据模型。
                  </div>
                </div>
                <div className="bg-background-saliant/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 font-semibold text-foreground mb-3">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    交付能力
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    把关键流程写成脚本与清单（迁移、权限、验收），才能让任何人复现与迭代。
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer CTA */}
          <div className="text-center mt-20">
            <p className="text-muted-foreground mb-6">感谢您的阅读，希望这个项目能给您带来启发。</p>
            <Link to="/">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow px-8">
                回到首页体验完整功能
              </Button>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Retro;

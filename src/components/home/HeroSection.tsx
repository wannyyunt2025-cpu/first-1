import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactModal } from './ContactModal';
import { useProfile } from '@/hooks/useProfile';

export function HeroSection() {
  const [showContactModal, setShowContactModal] = useState(false);
  const { profile } = useProfile();

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 静态兜底文案
  const defaultTitle = 'AI 产品方向的转型实践者';
  const defaultSlogan = '从建筑学出发，转向 AI 产品实践';
  const defaultDescription = '我正在从建筑学背景转向 AI 产品 / 运营方向。这个网站是我的长期实践项目，用来记录学习路径、项目尝试、工具理解和个人展示系统的持续迭代。';

  // 从 profile 读取数据，有 fallback
  const displayName = profile.name?.trim() || '';
  const displayTitle = profile.title || defaultTitle;
  const displaySlogan = profile.slogan || '';

  // 保持主叙事一致性
  const heroTitle = '从建筑学出发，转向 AI 产品实践';
  const heroSubtitle = displaySlogan || (profile.title ? displayTitle : defaultDescription);

  const statusCards = [
    { title: "转型方向", body: "AI 产品 / AI 运营 / AI 应用实践" },
    { title: "实践方式", body: "Trae、Coze、n8n、vibecoding 等工具协作" },
    { title: "当前作品", body: "动态个人主页，从 MVP 继续迭代" },
  ];

  return (
    <section
      className="relative min-h-screen flex items-center pt-24 pb-16"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
              <span className="pulse-dot" aria-hidden="true" />
              <span>持续更新中</span>
              <span className="text-muted">
                {displayName ? `${displayName} 的个人主页` : '当前版本：从 MVP 到可迭代个人产品'}
              </span>
            </div>

            <div className="max-w-4xl space-y-5">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
                个人主页 / 转型样本 / 长期项目
              </p>
              <h1 className="font-display text-5xl leading-[1.04] md:text-7xl">
                {heroTitle}
              </h1>
              <p className="max-w-2xl text-base leading-8 md:text-lg text-muted">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  size="lg"
                  className="interactive rounded-full px-5 py-3 text-sm font-semibold bg-foreground text-white"
                  onClick={() => handleNavClick('core-project')}
                >
                  查看核心项目
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="interactive rounded-full border px-5 py-3 text-sm font-semibold"
                  onClick={() => handleNavClick('learning')}
                >
                  了解学习路径
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="interactive rounded-full border px-5 py-3 text-sm font-semibold"
                  onClick={() => handleNavClick('contact')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  获取联系方式
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {statusCards.map((card) => (
                <motion.article
                  key={card.title}
                  className="ui-card interactive p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-sm font-semibold">{card.title}</div>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {card.body}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>

          <motion.aside
            className="ui-card overflow-hidden"
            style={{ boxShadow: 'var(--shadow)' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="editorial-grid p-6 md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">转型样本</div>
                  <div className="mt-1 text-sm text-muted">
                    把主页本身做成一个持续迭代的产品
                  </div>
                </div>
                <div className="rounded-full border px-3 py-1 text-xs text-muted">
                  进行中
                </div>
              </div>
              <div className="mt-8 rounded-[20px] border p-5 bg-white/72">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="text-sm font-semibold">动态个人主页系统</div>
                    <div className="mt-1 text-xs text-muted">
                      前台展示 / 后台管理 / 数据存储 / AI 能力入口
                    </div>
                  </div>
                  <div className="font-mono text-xs text-muted">v0.9 → v1.0</div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border p-4 bg-surface">
                    <div className="font-mono text-xs uppercase tracking-[0.16em] text-muted">前台层</div>
                    <div className="mt-3 text-3xl font-bold">01</div>
                    <p className="mt-3 text-sm leading-7 text-muted">
                      个人介绍、项目展示、学习记录与联系方式。
                    </p>
                  </div>
                  <div className="rounded-2xl border p-4 bg-surface">
                    <div className="font-mono text-xs uppercase tracking-[0.16em] text-muted">系统层</div>
                    <div className="mt-3 text-3xl font-bold">02</div>
                    <p className="mt-3 text-sm leading-7 text-muted">
                      Supabase、CMS、留言审核、简历系统与部署流程。
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border p-4 bg-gradient-to-br from-accent-soft to-surface-2">
                  <div className="text-sm font-semibold">为什么把它当核心项目</div>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    因为它不是一次性页面，而是一个不断加入内容管理、交互入口、数据结构和叙事优化的个人产品实验场。
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      <ContactModal
        open={showContactModal}
        onOpenChange={setShowContactModal}
      />
    </section>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useSkills } from '@/hooks/useSkills';

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [copiedWechat, setCopiedWechat] = useState(false);
  const { toast } = useToast();
  const { profile } = useProfile();
  const { getTopSkills } = useSkills();

  // 从 profile 读取联系方式，有 fallback
  const contactEmail = profile.contact.email || '';
  const contactWechat = profile.contact.wechat || '';

  // 脱敏处理
  const getMaskedEmail = (email: string) => {
    if (!email) return '请在后台补充邮箱';
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const username = parts[0];
    const domain = parts[1];
    if (username.length <= 2) {
      return `${username[0]}***@${domain}`;
    }
    return `${username.substring(0, 1)}***@${domain}`;
  };

  const getMaskedWechat = (wechat: string) => {
    if (!wechat) return '请在后台补充微信';
    if (wechat.length <= 3) {
      return `${wechat[0]}***`;
    }
    return `${wechat.substring(0, 2)}***${wechat.substring(wechat.length - 1)}`;
  };

  const maskedEmail = getMaskedEmail(contactEmail);
  const maskedWechat = getMaskedWechat(contactWechat);
  const githubHandle = 'wannyyunt2025-cpu';

  // 获取高权重技能作为能力标签
  const topSkills = getTopSkills(8);
  const defaultSkills = ["AI 产品", "AI 运营", "工具链整合", "低代码", "产品思维", "信息结构", "用户体验", "持续迭代"];
  const skillsToDisplay = topSkills.length > 0 ? topSkills.map(skill => skill.name) : defaultSkills;

  const handleCopyEmail = async () => {
    if (!profile.contact.email) {
      toast({
        title: '暂未设置邮箱',
        description: '请先在后台个人信息里补充邮箱地址',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(profile.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      toast({
        title: '复制成功',
        description: '邮箱地址已复制到剪贴板',
      });
    } catch (e) {
      toast({
        title: '复制失败',
        description: '请手动复制邮箱地址',
        variant: 'destructive',
      });
    }
  };

  const handleCopyWechat = async () => {
    if (!profile.contact.wechat) {
      toast({
        title: '暂未设置微信',
        description: '请先在后台个人信息里补充微信号',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(profile.contact.wechat);
      setCopiedWechat(true);
      setTimeout(() => setCopiedWechat(false), 1800);
      toast({
        title: '复制成功',
        description: '微信号已复制到剪贴板',
      });
    } catch (e) {
      toast({
        title: '复制失败',
        description: '请手动复制微信号',
        variant: 'destructive',
      });
    }
  };

  return (
    <section id="contact" className="scroll-mt-28 border-t py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
                联系与后续
              </p>
              <h2 className="font-display text-3xl md:text-5xl">联系与后续</h2>
              <p className="text-sm leading-7 md:text-base text-muted">
                我正在寻找 AI 产品、AI 运营或相关方向的机会，也欢迎就工具使用、学习路径等话题交流。
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <motion.div
                className="ui-card interactive p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold">联系方式</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-accent" />
                      <span className="text-sm">{maskedEmail}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleCopyEmail}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </div>
                      <span className="text-sm">{maskedWechat}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleCopyWechat}
                    >
                      {copiedWechat ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </div>
                    <span className="text-sm">@{githubHandle}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="ui-card interactive p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-lg font-semibold">后续计划</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>持续迭代个人主页，完善展示叙事与系统能力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>深入学习产品思维与用户研究方法</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>尝试更多 AI 工具组合与实际场景落地</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-accent">•</span>
                    <span>建立更系统的学习与实践记录</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="ui-card p-6 md:p-8"
            style={{ boxShadow: 'var(--shadow)' }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold">关于简历系统</h3>
            <p className="mt-4 text-sm leading-7 text-muted">
              我把简历生成作为后台能力的一部分，而不是首页的核心。如果你需要我的详细简历，欢迎通过以上方式联系我，我会根据具体机会提供定制版本。
            </p>
            <div className="mt-6 rounded-[20px] border p-5 bg-surface-2">
              <div className="text-sm font-semibold">核心能力标签</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {skillsToDisplay.map((tag) => (
                  <span key={tag} className="rounded-full border px-3 py-2 text-xs bg-surface">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Github, Monitor, User } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

export function CoreProjectSection() {
  const { publicProjects } = useProjects();

  const featuredProjects = publicProjects.filter((project) => project.featured);
  const homepageProjects = publicProjects.filter((project) => {
    const name = project.name.toLowerCase();
    const keywords = project.keywords.map((keyword) => keyword.toLowerCase());
    return (
      name.includes('个人主页') ||
      name.includes('homepage') ||
      keywords.some((keyword) => keyword.includes('个人主页') || keyword.includes('homepage'))
    );
  });

  const projectSource = featuredProjects.length > 0
    ? featuredProjects
    : homepageProjects.length > 0
      ? homepageProjects
      : publicProjects;

  const sortedProjects = [...projectSource].sort((a, b) => a.sortOrder - b.sortOrder);
  const mainProject = sortedProjects[0];
  const supportingProjects = [...publicProjects]
    .filter((project) => project.id !== mainProject?.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 2);

  const selectionLabel = featuredProjects.length > 0
    ? '后台指定主项目'
    : homepageProjects.length > 0
      ? '关键词匹配主项目'
      : mainProject
        ? '公开项目排序第一'
        : '待补充';

  return (
    <section id="core-project" className="scroll-mt-28 border-t py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
                核心项目
              </p>
              <h2 className="font-display text-3xl md:text-5xl">
                {mainProject ? mainProject.name : '先在后台指定一个核心项目'}
              </h2>
              <p className="text-sm leading-7 md:text-base text-muted">
                首页只保留一个主项目，用它证明“我不是只学工具，而是在把学习转化成可维护的产品实践”。
              </p>
            </div>

            <div className="ui-card p-5">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                展示逻辑
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">
                优先读取后台勾选“设为首页主项目”的公开项目；如果没有，就匹配“个人主页 / homepage”关键词；再没有则使用公开项目排序第一条。
              </p>
              <div className="mt-4 inline-flex rounded-full border px-3 py-1.5 text-xs font-medium bg-surface-2">
                当前：{selectionLabel}
              </div>
            </div>
          </div>

          {mainProject ? (
            <motion.article
              className="ui-card overflow-hidden"
              style={{ boxShadow: 'var(--shadow)' }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <div className="border-b p-6 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                      Main project
                    </div>
                    <h3 className="mt-3 text-2xl font-bold md:text-3xl">{mainProject.name}</h3>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
                      {mainProject.role && (
                        <span className="inline-flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {mainProject.role}
                        </span>
                      )}
                      {(mainProject.startDate || mainProject.endDate) && (
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {[mainProject.startDate, mainProject.endDate].filter(Boolean).join(' - ')}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/project/${mainProject.id}`}
                    className="interactive inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold bg-surface-2"
                  >
                    查看详情
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                <p className="mt-6 text-sm leading-8 md:text-base text-muted">
                  {mainProject.summary || mainProject.result || mainProject.action || '这个项目已在后台公开展示，建议补充“首页短摘要”，让首页更像项目介绍而不是字段拼接。'}
                </p>

                {mainProject.keywords.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {mainProject.keywords.slice(0, 8).map((keyword) => (
                      <span key={keyword} className="rounded-full border px-3 py-1.5 text-xs bg-surface-2">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {(mainProject.githubUrl || mainProject.demoUrl || mainProject.portfolioUrl) && (
                <div className="grid gap-3 p-6 md:grid-cols-3 md:p-8">
                  {mainProject.githubUrl && (
                    <a
                      href={mainProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="interactive rounded-2xl border p-4 bg-surface-2"
                    >
                      <Github className="h-5 w-5" />
                      <div className="mt-3 text-sm font-semibold">GitHub</div>
                    </a>
                  )}
                  {mainProject.demoUrl && (
                    <a
                      href={mainProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="interactive rounded-2xl border p-4 bg-surface-2"
                    >
                      <Monitor className="h-5 w-5" />
                      <div className="mt-3 text-sm font-semibold">在线演示</div>
                    </a>
                  )}
                  {mainProject.portfolioUrl && (
                    <a
                      href={mainProject.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="interactive rounded-2xl border p-4 bg-surface-2"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                      <div className="mt-3 text-sm font-semibold">作品链接</div>
                    </a>
                  )}
                </div>
              )}

              {supportingProjects.length > 0 && (
                <div className="border-t p-6 md:p-8">
                  <div className="mb-4 text-sm font-semibold">补充项目</div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {supportingProjects.map((project) => (
                      <Link
                        key={project.id}
                        to={`/project/${project.id}`}
                        className="interactive rounded-2xl border p-4 bg-surface-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold">{project.name}</div>
                            <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted">
                              {project.summary || project.result || project.role}
                            </p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.article>
          ) : (
            <div className="ui-card p-6 md:p-8">
              <h3 className="text-xl font-semibold">后台还没有可展示项目</h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                请到后台“项目经历”里添加项目，打开“公开展示”，并建议勾选“设为首页主项目”。
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

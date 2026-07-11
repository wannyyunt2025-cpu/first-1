import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types';
import { generateId } from '@/lib/storage';

const emptyProject: Omit<Project, 'id' | 'sortOrder'> = {
  name: '',
  role: '',
  startDate: '',
  endDate: '',
  summary: '',
  situation: '',
  task: '',
  action: '',
  result: '',
  reflection: '',
  images: [],
  keywords: [],
  isPublic: true,
  featured: false,
  githubUrl: '',
  demoUrl: '',
  portfolioUrl: '',
};

export function ProjectForm() {
  const { projects, add, update, remove } = useProjects();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'sortOrder'>>(emptyProject);
  const [keywordInput, setKeywordInput] = useState('');

  const openCreateDialog = () => {
    setEditingProject(null);
    setFormData(emptyProject);
    setKeywordInput('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      role: project.role,
      startDate: project.startDate,
      endDate: project.endDate,
      summary: project.summary || '',
      situation: project.situation,
      task: project.task,
      action: project.action,
      result: project.result,
      reflection: project.reflection || '',
      images: project.images,
      keywords: project.keywords,
      isPublic: project.isPublic,
      featured: project.featured || false,
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      portfolioUrl: project.portfolioUrl || '',
    });
    setKeywordInput('');
    setIsDialogOpen(true);
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()],
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword),
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.role || !formData.startDate || !formData.endDate) {
      toast({
        title: '请填写必填字段',
        description: '项目名称、角色和时间是必填的',
        variant: 'destructive',
      });
      return;
    }

    if (editingProject) {
      update({
        ...editingProject,
        ...formData,
      });
      toast({
        title: '更新成功',
        description: `项目 "${formData.name}" 已更新`,
      });
    } else {
      add(formData);
      toast({
        title: '添加成功',
        description: `项目 "${formData.name}" 已添加`,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (project: Project) => {
    remove(project.id);
    toast({
      title: '删除成功',
      description: `项目 "${project.name}" 已删除`,
    });
  };

  const toggleVisibility = (project: Project) => {
    update({ ...project, isPublic: !project.isPublic });
  };

  return (
    <>
      <Card className="bg-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>项目经历</CardTitle>
            <CardDescription>
              管理首页和简历系统会读取的项目经历。建议优先补充“动态个人主页”，并用 STAR 法则写清楚背景、目标、行动和结果。
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog} className="bg-gradient-primary hover:opacity-90 gap-2">
            <Plus className="h-4 w-4" />
            添加项目
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate">
                        {project.name}
                      </h4>
                    {!project.isPublic && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          私密
                        </Badge>
                      )}
                      {project.featured && (
                        <Badge variant="secondary" className="text-xs">
                          首页主项目
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {project.role} | {project.startDate} - {project.endDate}
                    </p>
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      {project.summary || project.result}
                    </p>
                    {project.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.keywords.slice(0, 5).map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {project.keywords.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.keywords.length - 5}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleVisibility(project)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {project.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(project)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(project)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {projects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              还没有添加项目，点击上方按钮添加
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? '编辑项目' : '添加项目'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>项目名称 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="建议：动态个人主页（请优先添加这个核心项目）"
                  className="bg-secondary/50 mt-1"
                />
              </div>
              <div>
                <Label>角色 *</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="如：个人项目负责人 / 产品设计与开发"
                  className="bg-secondary/50 mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>开始时间 *</Label>
                <Input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="bg-secondary/50 mt-1"
                />
              </div>
              <div>
                <Label>结束时间 *</Label>
                <Input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="bg-secondary/50 mt-1"
                />
              </div>
            </div>

            <div>
              <Label>首页短摘要</Label>
              <Textarea
                value={formData.summary || ''}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="用于首页项目卡片，建议 40-90 字。不要写完整 STAR，只写访问者一眼能理解的项目价值。"
                className="bg-secondary/50 mt-1 resize-none"
                rows={3}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                这个字段属于“前台摘要”，比直接截取成果产出更适合首页展示。
              </p>
            </div>

            {/* STAR */}
            <div>
              <Label>背景情境 (Situation)</Label>
              <Textarea
                value={formData.situation}
                onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                placeholder="示例：个人信息分散在简历、GitHub 和训练营经历中，缺少一个能持续更新、统一展示转型路径和项目实践的入口。"
                className="bg-secondary/50 mt-1 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label>任务目标 (Task)</Label>
              <Textarea
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                placeholder="示例：搭建一个动态个人主页系统，能展示个人定位、项目经历、技能标签、联系方式，并保留后台维护和简历生成能力。"
                className="bg-secondary/50 mt-1 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label>行动方案 (Action)</Label>
              <Textarea
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                placeholder="示例：使用 Trae/Codex 协作完成前台 UI、后台 CMS、Supabase 数据接入、Vercel 部署和多轮文案迭代。"
                className="bg-secondary/50 mt-1 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label>成果产出 (Result) - Key Result</Label>
              <Textarea
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                placeholder="示例：完成可持续维护的个人展示系统，首页可读取后台数据，联系方式脱敏展示，并形成从 MVP 到 v1.0 的迭代记录。"
                className="bg-secondary/50 mt-1 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label>项目复盘 / 下一步</Label>
              <Textarea
                value={formData.reflection || ''}
                onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                placeholder="示例：本轮完成了前后台数据接线，但内容模型仍需继续抽象，下一步会补充学习经历表和更稳定的简历系统。"
                className="bg-secondary/50 mt-1 resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>GitHub 链接</Label>
                <Input
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="bg-secondary/50 mt-1"
                />
              </div>
              <div>
                <Label>在线演示链接</Label>
                <Input
                  value={formData.demoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-secondary/50 mt-1"
                />
              </div>
              <div>
                <Label>作品集链接</Label>
                <Input
                  value={formData.portfolioUrl || ''}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-secondary/50 mt-1"
                />
              </div>
            </div>

            {/* Keywords */}
            <div>
              <Label>关键词标签</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  placeholder="建议关键词：个人主页、AI 产品、Supabase、Trae、Vercel、CMS、简历系统"
                  className="bg-secondary/50"
                />
                <Button type="button" variant="outline" onClick={handleAddKeyword}>
                  添加
                </Button>
              </div>
              {formData.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.keywords.map((keyword, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1">
                      {keyword}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemoveKeyword(keyword)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility */}
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
              <Label>公开展示（打开后会被首页和项目页读取）</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={Boolean(formData.featured)}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label>设为首页主项目（推荐只打开一个）</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90 gap-2">
              <Save className="h-4 w-4" />
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

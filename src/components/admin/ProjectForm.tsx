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
  situation: '',
  task: '',
  action: '',
  result: '',
  images: [],
  keywords: [],
  isPublic: true,
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
      situation: project.situation,
      task: project.task,
      action: project.action,
      result: project.result,
      images: project.images,
      keywords: project.keywords,
      isPublic: project.isPublic,
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
            <CardDescription>管理您的项目经历，使用STAR法则描述</CardDescription>
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
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {project.role} | {project.startDate} - {project.endDate}
                    </p>
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      {project.result}
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
                  placeholder="项目名称"
                  className="bg-secondary/50 mt-1"
                />
              </div>
              <div>
                <Label>角色 *</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="如：技术负责人"
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

            {/* STAR */}
            <div>
              <Label>背景情境 (Situation)</Label>
              <Textarea
                value={formData.situation}
                onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                placeholder="描述项目的背景和面临的问题..."
                className="bg-secondary/50 mt-1 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label>任务目标 (Task)</Label>
              <Textarea
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                placeholder="描述您需要完成的任务和目标..."
                className="bg-secondary/50 mt-1 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label>行动方案 (Action)</Label>
              <Textarea
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                placeholder="描述您采取的具体行动和方法..."
                className="bg-secondary/50 mt-1 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label>成果产出 (Result) - Key Result</Label>
              <Textarea
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                placeholder="描述您取得的成果和数据..."
                className="bg-secondary/50 mt-1 resize-none"
                rows={3}
              />
            </div>

            {/* Keywords */}
            <div>
              <Label>关键词标签</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  placeholder="输入关键词按回车添加"
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
              <Label>公开展示</Label>
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

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
import { useTheme } from '@/hooks/useTheme';
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
  const { style } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'sortOrder'>>(emptyProject);
  const [keywordInput, setKeywordInput] = useState('');

  const isMinimalist = style === 'minimalist';

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
      <Card className={`border-none shadow-sm ${isMinimalist ? 'bg-white' : 'bg-card'}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-8">
          <div>
            <CardTitle className={`font-black tracking-tight ${isMinimalist ? 'text-2xl text-slate-900' : ''}`}>
              {isMinimalist ? 'Project Showcase' : '项目经历'}
            </CardTitle>
            <CardDescription className={isMinimalist ? 'text-slate-500 font-medium' : ''}>
              {isMinimalist ? 'Showcase your best work using the STAR method.' : '管理您的项目经历，使用STAR法则描述'}
            </CardDescription>
          </div>
          <Button 
            onClick={openCreateDialog} 
            className={`h-11 px-6 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all ${
              isMinimalist ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-gradient-primary hover:opacity-90'
            }`}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isMinimalist ? 'Add Project' : '添加项目'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`group p-5 rounded-2xl border transition-all duration-300 ${
                  isMinimalist 
                    ? 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-md' 
                    : 'bg-secondary/30 border-border/30 hover:border-primary/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold tracking-tight truncate ${isMinimalist ? 'text-slate-900' : 'text-foreground'}`}>
                        {project.name}
                      </h4>
                      {!project.isPublic && (
                        <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest ${isMinimalist ? 'border-slate-200 text-slate-400' : 'text-muted-foreground'}`}>
                          {isMinimalist ? 'Private' : '私密'}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm font-medium mb-3 ${isMinimalist ? 'text-primary' : 'text-muted-foreground'}`}>
                      {project.role} | {project.startDate} - {project.endDate}
                    </p>
                    <p className={`text-sm line-clamp-2 leading-relaxed ${isMinimalist ? 'text-slate-600' : 'text-foreground/80'}`}>
                      {project.result}
                    </p>
                    {project.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {project.keywords.slice(0, 5).map((keyword, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 ${
                              isMinimalist ? 'bg-slate-50 text-slate-500 border-none' : 'text-xs'
                            }`}
                          >
                            {keyword}
                          </Badge>
                        ))}
                        {project.keywords.length > 5 && (
                          <Badge variant="outline" className="text-[10px] font-black">
                            +{project.keywords.length - 5}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleVisibility(project)}
                      className="text-slate-300 hover:text-slate-900 hover:bg-transparent transition-colors"
                    >
                      {project.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(project)}
                      className="text-slate-300 hover:text-primary hover:bg-transparent transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(project)}
                      className="text-slate-300 hover:text-destructive hover:bg-transparent transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {projects.length === 0 && (
            <div className={`text-center py-12 border-2 border-dashed rounded-3xl ${
              isMinimalist ? 'border-slate-100 bg-slate-50/30' : 'border-border/50 bg-card/20'
            }`}>
              <p className="font-bold text-slate-400">
                {isMinimalist ? 'No projects added yet. Start by adding one.' : '还没有添加项目，点击上方按钮添加'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto border-none ${isMinimalist ? 'bg-white rounded-3xl shadow-2xl' : 'bg-card'}`}>
          <DialogHeader>
            <DialogTitle className={`text-xl font-black tracking-tight ${isMinimalist ? 'text-slate-900' : ''}`}>
              {editingProject 
                ? (isMinimalist ? 'Edit Project' : '编辑项目') 
                : (isMinimalist ? 'Add Project' : '添加项目')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                  {isMinimalist ? 'Project Name *' : '项目名称 *'}
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isMinimalist ? "Project Title" : "项目名称"}
                  className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                />
              </div>
              <div className="space-y-2">
                <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                  {isMinimalist ? 'Role *' : '角色 *'}
                </Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder={isMinimalist ? "e.g. Lead Developer" : "如：技术负责人"}
                  className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                  {isMinimalist ? 'Start Date *' : '开始时间 *'}
                </Label>
                <Input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                />
              </div>
              <div className="space-y-2">
                <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                  {isMinimalist ? 'End Date *' : '结束时间 *'}
                </Label>
                <Input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                />
              </div>
            </div>

            {/* STAR */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                  {isMinimalist ? 'Situation' : '背景情境 (Situation)'}
                </Label>
                <Textarea
                  value={formData.situation}
                  onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                  placeholder={isMinimalist ? "What was the context?" : "描述项目的背景和面临的问题..."}
                  className={`rounded-xl focus:ring-primary/20 transition-all resize-none ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                  {isMinimalist ? 'Task' : '任务目标 (Task)'}
                </Label>
                <Textarea
                  value={formData.task}
                  onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                  placeholder={isMinimalist ? "What were your objectives?" : "描述您需要完成的任务和目标..."}
                  className={`rounded-xl focus:ring-primary/20 transition-all resize-none ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                  {isMinimalist ? 'Action' : '行动方案 (Action)'}
                </Label>
                <Textarea
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  placeholder={isMinimalist ? "How did you achieve it?" : "描述您采取的具体行动和方法..."}
                  className={`rounded-xl focus:ring-primary/20 transition-all resize-none ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                  {isMinimalist ? 'Result' : '成果产出 (Result)'}
                </Label>
                <Textarea
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  placeholder={isMinimalist ? "What were the outcomes?" : "描述您取得的成果和数据..."}
                  className={`rounded-xl focus:ring-primary/20 transition-all resize-none ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                  rows={3}
                />
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                {isMinimalist ? 'Keywords & Stack' : '关键词标签'}
              </Label>
              <div className="flex gap-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  placeholder={isMinimalist ? "Add tags..." : "输入关键词按回车添加"}
                  className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddKeyword}
                  className={`h-12 px-6 rounded-xl font-bold ${isMinimalist ? 'border-slate-200' : ''}`}
                >
                  {isMinimalist ? 'Add' : '添加'}
                </Button>
              </div>
              {formData.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.keywords.map((keyword, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary" 
                      className={`gap-1.5 py-1.5 px-3 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        isMinimalist ? 'bg-slate-50 text-slate-500 border-none' : ''
                      }`}
                    >
                      {keyword}
                      <X
                        className="h-3.5 w-3.5 cursor-pointer hover:text-destructive transition-colors"
                        onClick={() => handleRemoveKeyword(keyword)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility */}
            <div className="flex items-center gap-3 pt-4">
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
              <Label className={`font-bold ${isMinimalist ? 'text-slate-700' : ''}`}>
                {isMinimalist ? 'Publicly Visible' : '公开展示'}
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
            <Button 
              variant="ghost" 
              onClick={() => setIsDialogOpen(false)}
              className={`font-bold rounded-xl ${isMinimalist ? 'text-slate-400 hover:text-slate-600' : ''}`}
            >
              {isMinimalist ? 'Cancel' : '取消'}
            </Button>
            <Button 
              onClick={handleSave} 
              className={`h-11 px-8 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all ${
                isMinimalist ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-gradient-primary hover:opacity-90'
              }`}
            >
              <Save className="h-4 w-4 mr-2" />
              {isMinimalist ? 'Save Project' : '保存'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Education } from '@/types';
import { getEducation, saveEducation, generateId } from '@/lib/storage';
import { database, isDatabaseAvailable } from '@/lib/database';

const emptyEducation: Omit<Education, 'id'> = {
  school: '',
  degree: '',
  major: '',
  startDate: '',
  endDate: '',
  description: '',
};

export function EducationForm() {
  const { toast } = useToast();
  const [educationList, setEducationList] = useState<Education[]>(() => getEducation());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [formData, setFormData] = useState<Omit<Education, 'id'>>(emptyEducation);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (await isDatabaseAvailable()) {
        try {
          const data = await database.getEducation();
          if (data && data.length > 0) {
            setEducationList(data);
            saveEducation(data); // Sync to local
          }
        } catch (error) {
          console.error('Failed to load education from database:', error);
        }
      }
    };
    loadData();
  }, []);

  const refresh = () => {
    setEducationList(getEducation());
  };

  const openCreateDialog = () => {
    setEditingEducation(null);
    setFormData(emptyEducation);
    setIsDialogOpen(true);
  };

  const openEditDialog = (edu: Education) => {
    setEditingEducation(edu);
    setFormData({
      school: edu.school,
      degree: edu.degree,
      major: edu.major,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.school || !formData.degree || !formData.major) {
      toast({
        title: '请填写必填字段',
        description: '学校、学位和专业是必填的',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (editingEducation) {
        // Database update first
        if (await isDatabaseAvailable()) {
          await database.updateEducation(editingEducation.id, formData);
          
          // Refresh list from DB to ensure consistency
          const updatedList = await database.getEducation();
          setEducationList(updatedList);
          saveEducation(updatedList); // Update local cache
        } else {
           // Fallback for offline (optional, but keeping for safety)
           const newList = educationList.map((edu) =>
            edu.id === editingEducation.id ? { ...edu, ...formData } : edu
          );
          setEducationList(newList);
          saveEducation(newList);
        }
        
        toast({
          title: '更新成功',
          description: `教育经历已更新`,
        });
      } else {
        // Database create first
        if (await isDatabaseAvailable()) {
          const created = await database.createEducation(formData);
          if (created) {
             // Refresh list from DB to ensure sorting and ID consistency
             const updatedList = await database.getEducation();
             setEducationList(updatedList);
             saveEducation(updatedList); // Update local cache
          }
        } else {
           // Fallback for offline
           const newId = generateId();
           const newEdu: Education = {
             id: newId,
             ...formData,
           };
           const newList = [...educationList, newEdu];
           setEducationList(newList);
           saveEducation(newList);
        }
        
        toast({
          title: '添加成功',
          description: `教育经历已添加`,
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to save education:', error);
      toast({
        title: '保存失败',
        description: '无法同步到云端数据库',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (edu: Education) => {
    try {
      if (await isDatabaseAvailable()) {
        await database.deleteEducation(edu.id);
        
        // Refresh list from DB
        const updatedList = await database.getEducation();
        setEducationList(updatedList);
        saveEducation(updatedList);
      } else {
        // Fallback for offline
        const newList = educationList.filter((e) => e.id !== edu.id);
        setEducationList(newList);
        saveEducation(newList);
      }

      toast({
        title: '删除成功',
        description: `教育经历已删除`,
      });
    } catch (error) {
      console.error('Failed to delete education:', error);
      toast({
        title: '删除失败',
        description: '无法从云端数据库删除',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card className="bg-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>教育背景</CardTitle>
            <CardDescription>管理您的教育经历</CardDescription>
          </div>
          <Button onClick={openCreateDialog} className="bg-gradient-primary hover:opacity-90 gap-2">
            <Plus className="h-4 w-4" />
            添加
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {educationList.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground">
                      {edu.school}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {edu.degree} - {edu.major}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {edu.startDate} - {edu.endDate}
                    </p>
                    {edu.description && (
                      <p className="text-sm text-foreground/80 mt-2">
                        {edu.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(edu)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(edu)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {educationList.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              还没有添加教育经历，点击上方按钮添加
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle>
              {editingEducation ? '编辑教育经历' : '添加教育经历'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>学校 *</Label>
              <Input
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="学校名称"
                className="bg-secondary/50 mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>学位 *</Label>
                <Input
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="如：本科、硕士"
                  className="bg-secondary/50 mt-1"
                />
              </div>
              <div>
                <Label>专业 *</Label>
                <Input
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  placeholder="专业名称"
                  className="bg-secondary/50 mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>入学时间</Label>
                <Input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="bg-secondary/50 mt-1"
                />
              </div>
              <div>
                <Label>毕业时间</Label>
                <Input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="bg-secondary/50 mt-1"
                />
              </div>
            </div>

            <div>
              <Label>描述（选填）</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="如：主修课程、GPA、获奖情况等"
                className="bg-secondary/50 mt-1 resize-none"
                rows={3}
              />
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

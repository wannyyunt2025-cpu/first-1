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
import { useTheme } from '@/hooks/useTheme';
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
  const { style } = useTheme();
  const [educationList, setEducationList] = useState<Education[]>(() => getEducation());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [formData, setFormData] = useState<Omit<Education, 'id'>>(emptyEducation);
  const [isLoading, setIsLoading] = useState(false);

  const isMinimalist = style === 'minimalist';

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
      <Card className={`border-none shadow-sm ${isMinimalist ? 'bg-white' : 'bg-card'}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className={`font-black tracking-tight ${isMinimalist ? 'text-2xl text-slate-900' : ''}`}>
              {isMinimalist ? 'Education Background' : '教育背景'}
            </CardTitle>
            <CardDescription className={isMinimalist ? 'text-slate-500 font-medium' : ''}>
              {isMinimalist ? 'Manage your academic history and qualifications.' : '管理您的教育经历'}
            </CardDescription>
          </div>
          <Button 
            onClick={openCreateDialog} 
            className={`h-11 px-6 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all ${
              isMinimalist ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-gradient-primary hover:opacity-90'
            }`}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isMinimalist ? 'Add' : '添加'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {educationList.map((edu, index) => (
              <motion.div
                key={edu.id}
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
                    <h4 className={`font-bold tracking-tight ${isMinimalist ? 'text-slate-900' : 'text-foreground'}`}>
                      {edu.school}
                    </h4>
                    <p className={`text-sm font-medium ${isMinimalist ? 'text-primary' : 'text-muted-foreground'}`}>
                      {edu.degree} - {edu.major}
                    </p>
                    <p className={`text-xs mt-1 ${isMinimalist ? 'text-slate-400 font-bold uppercase tracking-wider' : 'text-muted-foreground'}`}>
                      {edu.startDate} - {edu.endDate}
                    </p>
                    {edu.description && (
                      <p className={`text-sm mt-3 leading-relaxed ${isMinimalist ? 'text-slate-600' : 'text-foreground/80'}`}>
                        {edu.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(edu)}
                      className="text-slate-300 hover:text-primary hover:bg-transparent transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(edu)}
                      className="text-slate-300 hover:text-destructive hover:bg-transparent transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {educationList.length === 0 && (
            <div className={`text-center py-12 border-2 border-dashed rounded-3xl ${
              isMinimalist ? 'border-slate-100 bg-slate-50/30' : 'border-border/50 bg-card/20'
            }`}>
              <p className="font-bold text-slate-400">
                {isMinimalist ? 'No education history yet. Click the button to add.' : '还没有添加教育经历，点击上方按钮添加'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className={`max-w-lg border-none ${isMinimalist ? 'bg-white rounded-3xl shadow-2xl' : 'bg-card'}`}>
          <DialogHeader>
            <DialogTitle className={`text-xl font-black tracking-tight ${isMinimalist ? 'text-slate-900' : ''}`}>
              {editingEducation 
                ? (isMinimalist ? 'Edit Education' : '编辑教育经历') 
                : (isMinimalist ? 'Add Education' : '添加教育经历')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                {isMinimalist ? 'School Name *' : '学校 *'}
              </Label>
              <Input
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder={isMinimalist ? "e.g. Stanford University" : "学校名称"}
                className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                  {isMinimalist ? 'Degree *' : '学位 *'}
                </Label>
                <Input
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder={isMinimalist ? "e.g. Bachelor" : "如：本科、硕士"}
                  className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                />
              </div>
              <div className="space-y-2">
                <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                  {isMinimalist ? 'Major *' : '专业 *'}
                </Label>
                <Input
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  placeholder={isMinimalist ? "e.g. Computer Science" : "专业名称"}
                  className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                  {isMinimalist ? 'Start Date' : '入学时间'}
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
                  {isMinimalist ? 'End Date' : '毕业时间'}
                </Label>
                <Input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className={`text-xs font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : ''}`}>
                {isMinimalist ? 'Description (Optional)' : '描述（选填）'}
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={isMinimalist ? "Key achievements, GPA, etc." : "如：主修课程、GPA、获奖情况等"}
                className={`rounded-xl focus:ring-primary/20 transition-all resize-none ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
                rows={3}
              />
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
              {isMinimalist ? 'Save Changes' : '保存'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSkills } from '@/hooks/useSkills';
import { useToast } from '@/hooks/use-toast';
import { Skill } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export function SkillForm() {
  const { skills, add, update, remove } = useSkills();
  const { style } = useTheme();
  const { toast } = useToast();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');

  const isMinimalist = style === 'minimalist';

  const handleAddSkill = () => {
    if (!newSkillName.trim()) {
      toast({
        title: isMinimalist ? 'Skill name required' : '请输入技能名称',
        variant: 'destructive',
      });
      return;
    }

    add(newSkillName.trim(), 50, newSkillCategory.trim() || undefined);
    setNewSkillName('');
    setNewSkillCategory('');
    toast({
      title: isMinimalist ? 'Skill Added' : '添加成功',
      description: isMinimalist ? `"${newSkillName}" has been added to your stack.` : `技能 "${newSkillName}" 已添加`,
    });
  };

  const handleWeightChange = (skill: Skill, newWeight: number[]) => {
    update({ ...skill, weight: newWeight[0] });
  };

  const handleRemove = (skill: Skill) => {
    remove(skill.id);
    toast({
      title: isMinimalist ? 'Skill Removed' : '删除成功',
      description: isMinimalist ? `"${skill.name}" has been deleted.` : `技能 "${skill.name}" 已删除`,
    });
  };

  // 按权重排序
  const sortedSkills = [...skills].sort((a, b) => b.weight - a.weight);

  return (
    <Card className={`border-none shadow-sm ${isMinimalist ? 'bg-white' : 'bg-card'}`}>
      <CardHeader className="pb-8">
        <CardTitle className={`font-black tracking-tight ${isMinimalist ? 'text-2xl text-slate-900' : ''}`}>
          {isMinimalist ? 'Expertise & Skills' : '技能管理'}
        </CardTitle>
        <CardDescription className={isMinimalist ? 'text-slate-500 font-medium' : ''}>
          {isMinimalist ? 'Manage your technical stack and proficiency levels.' : '添加和管理您的技能标签，调整权重以决定展示顺序'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Add new skill */}
        <div className="flex flex-col sm:flex-row gap-4 p-6 rounded-2xl bg-slate-50/50 border border-slate-100">
          <div className="flex-1 space-y-2">
            <Input
              placeholder={isMinimalist ? "Skill Name (e.g. React)" : "技能名称"}
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-white border-slate-200' : 'bg-secondary/50'}`}
            />
          </div>
          <div className="sm:w-48 space-y-2">
            <Input
              placeholder={isMinimalist ? "Category (Optional)" : "分类（选填）"}
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-white border-slate-200' : 'bg-secondary/50'}`}
            />
          </div>
          <Button 
            onClick={handleAddSkill}
            className={`h-12 px-8 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all ${
              isMinimalist ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-gradient-primary hover:opacity-90'
            }`}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isMinimalist ? 'Add Skill' : '添加'}
          </Button>
        </div>

        {/* Skills list */}
        <div className="space-y-4">
          <AnimatePresence>
            {sortedSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.03 }}
                className={`group flex items-center gap-6 p-5 rounded-2xl border transition-all duration-300 ${
                  isMinimalist 
                    ? 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-md' 
                    : 'bg-secondary/30 border-border/30 hover:border-primary/30'
                }`}
              >
                <div className={`p-2 rounded-lg ${isMinimalist ? 'bg-slate-50' : 'bg-primary/5'}`}>
                  <GripVertical className="h-4 w-4 text-slate-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`font-bold tracking-tight truncate ${isMinimalist ? 'text-slate-900' : 'text-foreground'}`}>
                      {skill.name}
                    </span>
                    {skill.category && (
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        isMinimalist ? 'bg-primary/5 text-primary' : 'bg-primary/10 text-primary'
                      }`}>
                        {skill.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[skill.weight]}
                      onValueChange={(value) => handleWeightChange(skill, value)}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className={`text-xs font-black w-10 text-right ${isMinimalist ? 'text-slate-400' : 'text-muted-foreground'}`}>
                      {skill.weight}%
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(skill)}
                  className="text-slate-300 hover:text-destructive hover:bg-transparent transition-colors shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          {skills.length === 0 && (
            <div className={`text-center py-12 border-2 border-dashed rounded-3xl ${
              isMinimalist ? 'border-slate-100 bg-slate-50/30' : 'border-border/50 bg-card/20'
            }`}>
              <p className="font-bold text-slate-400">
                {isMinimalist ? 'No skills added yet. Start by adding one above.' : '还没有添加技能，点击上方按钮添加'}
              </p>
            </div>
          )}
        </div>

        {/* Hint */}
        <div className={`p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${
          isMinimalist ? 'bg-slate-50 text-slate-400' : 'bg-primary/5 text-muted-foreground'
        }`}>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          {isMinimalist 
            ? 'Higher proficiency skills are prioritized in the expertise cloud.' 
            : '提示：权重越高的技能会在首页技能云中优先展示'}
        </div>
      </CardContent>
    </Card>
  );
}

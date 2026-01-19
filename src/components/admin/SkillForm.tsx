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

export function SkillForm() {
  const { skills, add, update, remove, reorder } = useSkills();
  const { toast } = useToast();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');

  const handleAddSkill = () => {
    if (!newSkillName.trim()) {
      toast({
        title: '请输入技能名称',
        variant: 'destructive',
      });
      return;
    }

    add(newSkillName.trim(), 50, newSkillCategory.trim() || undefined);
    setNewSkillName('');
    setNewSkillCategory('');
    toast({
      title: '添加成功',
      description: `技能 "${newSkillName}" 已添加`,
    });
  };

  const handleWeightChange = (skill: Skill, newWeight: number[]) => {
    update({ ...skill, weight: newWeight[0] });
  };

  const handleRemove = (skill: Skill) => {
    remove(skill.id);
    toast({
      title: '删除成功',
      description: `技能 "${skill.name}" 已删除`,
    });
  };

  // 按权重排序
  const sortedSkills = [...skills].sort((a, b) => b.weight - a.weight);

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle>技能管理</CardTitle>
        <CardDescription>添加和管理您的技能标签，调整权重以决定展示顺序</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new skill */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="技能名称"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            className="bg-secondary/50 flex-1"
          />
          <Input
            placeholder="分类（选填）"
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value)}
            className="bg-secondary/50 sm:w-32"
          />
          <Button 
            onClick={handleAddSkill}
            className="bg-gradient-primary hover:opacity-90 gap-2"
          >
            <Plus className="h-4 w-4" />
            添加
          </Button>
        </div>

        {/* Skills list */}
        <div className="space-y-3">
          <AnimatePresence>
            {sortedSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.03 }}
                className="group flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab transition-opacity" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-foreground truncate">
                      {skill.name}
                    </span>
                    {skill.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {skill.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[skill.weight]}
                      onValueChange={(value) => handleWeightChange(skill, value)}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {skill.weight}%
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(skill)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          {skills.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              还没有添加技能，点击上方按钮添加
            </div>
          )}
        </div>

        {/* Hint */}
        <p className="text-xs text-muted-foreground">
          提示：权重越高的技能会在首页技能云中优先展示，前5个高权重技能会被展示
        </p>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Skill } from '@/types';
import { getSkills, saveSkills, addSkill, updateSkill, deleteSkill, generateId } from '@/lib/storage';
import { database, isDatabaseAvailable } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>(() => getSkills());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    if (await isDatabaseAvailable()) {
      try {
        const data = await database.getSkills();
        if (data && data.length > 0) {
          setSkills(data);
          saveSkills(data);
        }
      } catch (error) {
        console.error('Failed to load skills:', error);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = loadData;

  const add = useCallback(async (name: string, weight: number = 50, category?: string) => {
    setIsLoading(true);
    try {
      if (await isDatabaseAvailable()) {
        // Database First
        const skillData = {
          name,
          weight,
          category,
        };
        const createdSkill = await database.createSkill(skillData);
        
        if (createdSkill) {
          setSkills(prev => {
            const newList = [...prev, createdSkill];
            saveSkills(newList); // Sync to local
            return newList;
          });
          toast({ title: "添加成功" });
        } else {
          throw new Error('Database creation failed');
        }
      } else {
        // Fallback to local
        const newSkill: Skill = {
          id: generateId(),
          name,
          weight,
          category,
        };
        addSkill(newSkill);
        setSkills(prev => [...prev, newSkill]);
        toast({ title: "添加成功 (本地模式)" });
      }
    } catch (error) {
      console.error('Failed to add skill:', error);
      toast({ title: "添加失败", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const update = useCallback(async (skill: Skill) => {
    setIsLoading(true);
    try {
      if (await isDatabaseAvailable()) {
        await database.updateSkill(skill.id, skill);
        // Refresh or Optimistic update
        setSkills(prev => {
           const newList = prev.map(s => s.id === skill.id ? skill : s);
           saveSkills(newList);
           return newList;
        });
      } else {
        updateSkill(skill);
        setSkills(prev => prev.map(s => s.id === skill.id ? skill : s));
      }
      
      toast({ title: "更新成功" });
    } catch (error) {
      console.error('Failed to update skill:', error);
      toast({ title: "更新失败", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const remove = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      if (await isDatabaseAvailable()) {
        await database.deleteSkill(id);
        setSkills(prev => {
          const newList = prev.filter(s => s.id !== id);
          saveSkills(newList);
          return newList;
        });
      } else {
        deleteSkill(id);
        setSkills(prev => prev.filter(s => s.id !== id));
      }
      
      toast({ title: "删除成功" });
    } catch (error) {
      console.error('Failed to delete skill:', error);
      toast({ title: "删除失败", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const reorder = useCallback(async (newSkills: Skill[]) => {
    setIsLoading(true);
    try {
      saveSkills(newSkills);
      setSkills(newSkills);
      // 暂时只同步本地顺序
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTopSkills = useCallback((n: number = 5) => {
    return [...skills].sort((a, b) => b.weight - a.weight).slice(0, n);
  }, [skills]);

  return {
    skills,
    isLoading,
    add,
    update,
    remove,
    reorder,
    getTopSkills,
    refresh,
  };
}

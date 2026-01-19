import { useState, useEffect, useCallback } from 'react';
import { Skill } from '@/types';
import { getSkills, saveSkills, addSkill, updateSkill, deleteSkill, generateId } from '@/lib/storage';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>(() => getSkills());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSkills(getSkills());
  }, []);

  const refresh = useCallback(() => {
    setSkills(getSkills());
  }, []);

  const add = useCallback((name: string, weight: number = 50, category?: string) => {
    setIsLoading(true);
    try {
      const newSkill: Skill = {
        id: generateId(),
        name,
        weight,
        category,
      };
      addSkill(newSkill);
      refresh();
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const update = useCallback((skill: Skill) => {
    setIsLoading(true);
    try {
      updateSkill(skill);
      refresh();
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const remove = useCallback((id: string) => {
    setIsLoading(true);
    try {
      deleteSkill(id);
      refresh();
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const reorder = useCallback((newSkills: Skill[]) => {
    setIsLoading(true);
    try {
      saveSkills(newSkills);
      refresh();
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  // 获取按权重排序的前N个技能
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

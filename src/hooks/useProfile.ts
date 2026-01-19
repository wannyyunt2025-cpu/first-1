import { useState, useEffect, useCallback } from 'react';
import { Profile } from '@/types';
import { getProfile, saveProfile } from '@/lib/storage';
import { database, isDatabaseAvailable } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(() => getProfile());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    // 1. 本地优先显示
    setProfile(getProfile());
    
    // 2. 尝试从 Supabase 加载
    if (await isDatabaseAvailable()) {
      try {
        const data = await database.getProfile();
        if (data) {
          setProfile(data);
          saveProfile(data); // Sync to local
        }
      } catch (error) {
        console.error('Failed to load profile from database:', error);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateProfile = useCallback(async (newProfile: Profile) => {
    setIsLoading(true);
    try {
      // Optimistic update
      saveProfile(newProfile);
      setProfile(newProfile);

      if (await isDatabaseAvailable()) {
        const exists = await database.getProfile();
        if (exists) {
          await database.updateProfile(exists.id, newProfile);
        } else {
          // 如果是第一次创建，排除ID让数据库生成
          const { id, ...rest } = newProfile;
          await database.createProfile(rest as any);
        }
      }
      
      toast({ title: "保存成功", description: "个人信息已更新" });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({ title: "保存失败", description: "无法同步到云端", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateField = useCallback(<K extends keyof Profile>(field: K, value: Profile[K]) => {
    const newProfile = { ...profile, [field]: value };
    updateProfile(newProfile);
  }, [profile, updateProfile]);

  return {
    profile,
    isLoading,
    updateProfile,
    updateField,
    refresh: loadData,
  };
}

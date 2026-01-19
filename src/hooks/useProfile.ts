import { useState, useEffect, useCallback } from 'react';
import { Profile } from '@/types';
import { getProfile, saveProfile } from '@/lib/storage';

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(() => getProfile());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const updateProfile = useCallback((newProfile: Profile) => {
    setIsLoading(true);
    try {
      saveProfile(newProfile);
      setProfile(newProfile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateField = useCallback(<K extends keyof Profile>(field: K, value: Profile[K]) => {
    const newProfile = { ...profile, [field]: value };
    updateProfile(newProfile);
  }, [profile, updateProfile]);

  return {
    profile,
    isLoading,
    updateProfile,
    updateField,
    refresh: () => setProfile(getProfile()),
  };
}

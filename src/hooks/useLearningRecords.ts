import { useCallback, useEffect, useState } from 'react';
import { LearningRecord } from '@/types';
import {
  addLearningRecord,
  deleteLearningRecord,
  generateId,
  getLearningRecords,
  saveLearningRecords,
  updateLearningRecord,
} from '@/lib/storage';
import { database, isDatabaseAvailable } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export function useLearningRecords() {
  const [records, setRecords] = useState<LearningRecord[]>(() => getLearningRecords());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    if (await isDatabaseAvailable()) {
      try {
        const data = await database.getLearningRecords();
        if (data && data.length > 0) {
          setRecords(data);
          saveLearningRecords(data);
        }
      } catch (error) {
        console.error('Failed to load learning records:', error);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const publicRecords = records.filter((record) => record.isPublic);

  const add = useCallback(async (record: Omit<LearningRecord, 'id' | 'sortOrder'>) => {
    setIsLoading(true);
    try {
      if (await isDatabaseAvailable()) {
        const created = await database.createLearningRecord({
          ...record,
          sortOrder: records.length + 1,
        });

        if (created) {
          setRecords((prev) => {
            const next = [...prev, created];
            saveLearningRecords(next);
            return next;
          });
          toast({ title: '学习经历添加成功' });
          return;
        }
      }

      const newRecord: LearningRecord = {
        ...record,
        id: generateId(),
        sortOrder: records.length + 1,
      };
      addLearningRecord(newRecord);
      setRecords((prev) => [...prev, newRecord]);
      toast({ title: '学习经历添加成功 (本地模式)' });
    } catch (error) {
      console.error('Failed to add learning record:', error);
      toast({ title: '添加失败', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [records.length, toast]);

  const update = useCallback(async (record: LearningRecord) => {
    setIsLoading(true);
    try {
      if (await isDatabaseAvailable()) {
        const ok = await database.updateLearningRecord(record.id, record);
        if (!ok) {
          console.warn('Learning record database update skipped; falling back to local cache.');
        }
      }

      updateLearningRecord(record);
      setRecords((prev) => prev.map((item) => item.id === record.id ? record : item));
      toast({ title: '学习经历更新成功' });
    } catch (error) {
      console.error('Failed to update learning record:', error);
      toast({ title: '更新失败', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const remove = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      if (await isDatabaseAvailable()) {
        const ok = await database.deleteLearningRecord(id);
        if (!ok) {
          console.warn('Learning record database delete skipped; falling back to local cache.');
        }
      }

      deleteLearningRecord(id);
      setRecords((prev) => prev.filter((item) => item.id !== id));
      toast({ title: '学习经历删除成功' });
    } catch (error) {
      console.error('Failed to delete learning record:', error);
      toast({ title: '删除失败', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    records,
    publicRecords,
    isLoading,
    add,
    update,
    remove,
    refresh: loadData,
  };
}

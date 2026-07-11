import { useCallback, useEffect, useState } from 'react';
import { InsightCard } from '@/types';
import {
  addInsightCard,
  deleteInsightCard,
  generateId,
  getInsightCards,
  saveInsightCards,
  updateInsightCard,
} from '@/lib/storage';
import { database, isDatabaseAvailable } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export function useInsightCards() {
  const [cards, setCards] = useState<InsightCard[]>(() => getInsightCards());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    if (await isDatabaseAvailable()) {
      try {
        const data = await database.getInsightCards();
        if (data && data.length > 0) {
          setCards(data);
          saveInsightCards(data);
        }
      } catch (error) {
        console.error('Failed to load insight cards:', error);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const publicCards = cards.filter((card) => card.isPublic);

  const add = useCallback(async (card: Omit<InsightCard, 'id' | 'sortOrder'>) => {
    setIsLoading(true);
    try {
      if (await isDatabaseAvailable()) {
        const created = await database.createInsightCard({
          ...card,
          sortOrder: cards.length + 1,
        });

        if (created) {
          setCards((prev) => {
            const next = [...prev, created];
            saveInsightCards(next);
            return next;
          });
          toast({ title: '观点卡片添加成功' });
          return;
        }
      }

      const newCard: InsightCard = {
        ...card,
        id: generateId(),
        sortOrder: cards.length + 1,
      };
      addInsightCard(newCard);
      setCards((prev) => [...prev, newCard]);
      toast({ title: '观点卡片添加成功 (本地模式)' });
    } catch (error) {
      console.error('Failed to add insight card:', error);
      toast({ title: '添加失败', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [cards.length, toast]);

  const update = useCallback(async (card: InsightCard) => {
    setIsLoading(true);
    try {
      if (await isDatabaseAvailable()) {
        const ok = await database.updateInsightCard(card.id, card);
        if (!ok) {
          console.warn('Insight card database update skipped; falling back to local cache.');
        }
      }

      updateInsightCard(card);
      setCards((prev) => prev.map((item) => item.id === card.id ? card : item));
      toast({ title: '观点卡片更新成功' });
    } catch (error) {
      console.error('Failed to update insight card:', error);
      toast({ title: '更新失败', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const remove = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      if (await isDatabaseAvailable()) {
        const ok = await database.deleteInsightCard(id);
        if (!ok) {
          console.warn('Insight card database delete skipped; falling back to local cache.');
        }
      }

      deleteInsightCard(id);
      setCards((prev) => prev.filter((item) => item.id !== id));
      toast({ title: '观点卡片删除成功' });
    } catch (error) {
      console.error('Failed to delete insight card:', error);
      toast({ title: '删除失败', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    cards,
    publicCards,
    isLoading,
    add,
    update,
    remove,
    refresh: loadData,
  };
}

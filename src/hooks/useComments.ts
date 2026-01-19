import { useState, useEffect, useCallback } from 'react';
import { Comment } from '@/types';
import { 
  getComments, 
  addComment, 
  updateComment, 
  deleteComment, 
  generateId 
} from '@/lib/storage';
import { database, isDatabaseAvailable } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';
import { saveComments } from '@/lib/storage';

// 敏感词列表（简化版）
const SENSITIVE_WORDS = [
  '广告', '推广', '加微', '加我', '免费领',
  '赚钱', '兼职', '日入', '月入', '躺赚',
];

export function useComments() {
  const [comments, setComments] = useState<Comment[]>(() => getComments());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    const localComments = getComments();
    setComments(localComments);

    if (await isDatabaseAvailable()) {
      try {
        const remoteComments = await database.getComments();
        const mergedById = new Map<string, Comment>();

        for (const c of localComments) mergedById.set(c.id, c);
        for (const c of remoteComments) mergedById.set(c.id, c);

        const merged = Array.from(mergedById.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setComments(merged);
        saveComments(merged);
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = loadData;

  const approved = comments.filter(c => c.status === 'approved');
  const pending = comments.filter(c => c.status === 'pending');

  const containsSensitiveWords = useCallback((content: string): boolean => {
    return SENSITIVE_WORDS.some(word => content.includes(word));
  }, []);

  const submit = useCallback(async (content: string, nickname?: string): Promise<{ success: boolean; message: string }> => {
    if (content.length < 5) return { success: false, message: '留言内容至少5个字符' };
    if (content.length > 500) return { success: false, message: '留言内容不能超过500个字符' };
    if (containsSensitiveWords(content)) return { success: false, message: '留言包含敏感词，请修改后重试' };

    setIsLoading(true);
    try {
      const newComment: Comment = {
        id: generateId(),
        nickname: nickname?.trim() || undefined,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      
      // Local
      addComment(newComment);
      setComments(prev => [newComment, ...prev]);

      // Remote
      if (await isDatabaseAvailable()) {
        const created = await database.createComment(newComment);
        if (!created) {
          return { success: true, message: '留言已保存到本地，云端同步失败（不影响本机管理后台查看）' };
        }
      }
      
      return { success: true, message: '留言提交成功，等待审核' };
    } catch (error) {
      console.error('Failed to submit comment:', error);
      return { success: false, message: '提交失败，请重试' };
    } finally {
      setIsLoading(false);
    }
  }, [containsSensitiveWords]);

  const approve = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Local
      const comment = comments.find(c => c.id === id);
      if (comment) {
        const updated = { ...comment, status: 'approved' as const };
        updateComment(updated);
        setComments(prev => prev.map(c => c.id === id ? updated : c));

        // Remote
        if (await isDatabaseAvailable()) {
          await database.approveComment(id);
        }
        toast({ title: "留言已审核通过" });
      }
    } finally {
      setIsLoading(false);
    }
  }, [comments, toast]);

  const reject = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Local
      const comment = comments.find(c => c.id === id);
      if (comment) {
        const updated = { ...comment, status: 'rejected' as const };
        updateComment(updated);
        setComments(prev => prev.map(c => c.id === id ? updated : c));

        // Remote
        if (await isDatabaseAvailable()) {
          await database.rejectComment(id);
        }
        toast({ title: "留言已拒绝" });
      }
    } finally {
      setIsLoading(false);
    }
  }, [comments, toast]);

  const reply = useCallback(async (id: string, replyContent: string) => {
    setIsLoading(true);
    try {
      const comment = comments.find(c => c.id === id);
      if (comment) {
        const updated = { 
          ...comment, 
          reply: replyContent.trim(),
          replyAt: new Date().toISOString(),
        };
        updateComment(updated);
        setComments(prev => prev.map(c => c.id === id ? updated : c));

        // Remote
        if (await isDatabaseAvailable()) {
          await database.approveComment(id, replyContent);
        }
        toast({ title: "回复成功" });
      }
    } finally {
      setIsLoading(false);
    }
  }, [comments, toast]);

  const remove = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      deleteComment(id);
      setComments(prev => prev.filter(c => c.id !== id));

      if (await isDatabaseAvailable()) {
        await database.deleteComment(id);
      }
      toast({ title: "删除成功" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    comments,
    approved,
    pending,
    isLoading,
    submit,
    approve,
    reject,
    reply,
    remove,
    refresh,
  };
}

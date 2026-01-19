import { useState, useEffect, useCallback } from 'react';
import { Comment } from '@/types';
import { 
  getComments, 
  getApprovedComments, 
  getPendingComments,
  addComment, 
  updateComment, 
  deleteComment, 
  generateId 
} from '@/lib/storage';

// 敏感词列表（简化版）
const SENSITIVE_WORDS = [
  '广告', '推广', '加微', '加我', '免费领',
  '赚钱', '兼职', '日入', '月入', '躺赚',
];

export function useComments() {
  const [comments, setComments] = useState<Comment[]>(() => getComments());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setComments(getComments());
  }, []);

  const refresh = useCallback(() => {
    setComments(getComments());
  }, []);

  const approved = getApprovedComments();
  const pending = getPendingComments();

  // 检测敏感词
  const containsSensitiveWords = useCallback((content: string): boolean => {
    return SENSITIVE_WORDS.some(word => content.includes(word));
  }, []);

  // 提交留言
  const submit = useCallback((content: string, nickname?: string): { success: boolean; message: string } => {
    // 内容长度校验
    if (content.length < 5) {
      return { success: false, message: '留言内容至少5个字符' };
    }
    if (content.length > 500) {
      return { success: false, message: '留言内容不能超过500个字符' };
    }

    // 敏感词检测
    if (containsSensitiveWords(content)) {
      return { success: false, message: '留言包含敏感词，请修改后重试' };
    }

    setIsLoading(true);
    try {
      const newComment: Comment = {
        id: generateId(),
        nickname: nickname?.trim() || undefined,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      addComment(newComment);
      refresh();
      return { success: true, message: '留言提交成功，等待审核' };
    } finally {
      setIsLoading(false);
    }
  }, [containsSensitiveWords, refresh]);

  // 审核通过
  const approve = useCallback((id: string) => {
    setIsLoading(true);
    try {
      const comment = comments.find(c => c.id === id);
      if (comment) {
        updateComment({ ...comment, status: 'approved' });
        refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }, [comments, refresh]);

  // 审核拒绝
  const reject = useCallback((id: string) => {
    setIsLoading(true);
    try {
      const comment = comments.find(c => c.id === id);
      if (comment) {
        updateComment({ ...comment, status: 'rejected' });
        refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }, [comments, refresh]);

  // 回复留言
  const reply = useCallback((id: string, replyContent: string) => {
    setIsLoading(true);
    try {
      const comment = comments.find(c => c.id === id);
      if (comment) {
        updateComment({ 
          ...comment, 
          reply: replyContent.trim(),
          replyAt: new Date().toISOString(),
        });
        refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }, [comments, refresh]);

  // 删除留言
  const remove = useCallback((id: string) => {
    setIsLoading(true);
    try {
      deleteComment(id);
      refresh();
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Trash2, MessageSquare, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useComments } from '@/hooks/useComments';
import { useToast } from '@/hooks/use-toast';
import { Comment } from '@/types';

export function CommentManager() {
  const { comments, pending, approved, approve, reject, reply, remove } = useComments();
  const { toast } = useToast();
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyingComment, setReplyingComment] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN');
  };

  const handleApprove = (comment: Comment) => {
    approve(comment.id);
    toast({
      title: '审核通过',
      description: '留言已公开展示',
    });
  };

  const handleReject = (comment: Comment) => {
    reject(comment.id);
    toast({
      title: '已拒绝',
      description: '留言已被拒绝',
    });
  };

  const handleDelete = (comment: Comment) => {
    remove(comment.id);
    toast({
      title: '删除成功',
      description: '留言已删除',
    });
  };

  const openReplyDialog = (comment: Comment) => {
    setReplyingComment(comment);
    setReplyContent(comment.reply || '');
    setReplyDialogOpen(true);
  };

  const handleReply = () => {
    if (replyingComment && replyContent.trim()) {
      reply(replyingComment.id, replyContent);
      toast({
        title: '回复成功',
        description: '回复已发布',
      });
      setReplyDialogOpen(false);
    }
  };

  const getStatusBadge = (status: Comment['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">待审核</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-500 border-green-500/50">已通过</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-500 border-red-500/50">已拒绝</Badge>;
    }
  };

  const rejectedComments = comments.filter(c => c.status === 'rejected');

  const CommentItem = ({ comment, showActions = true }: { comment: Comment; showActions?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 rounded-lg bg-secondary/30 border border-border/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-foreground">
              {comment.nickname || '匿名用户'}
            </span>
            {getStatusBadge(comment.status)}
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-foreground/90 mb-2">
            {comment.content}
          </p>
          {comment.reply && (
            <div className="mt-2 p-3 rounded-lg bg-primary/5 border-l-2 border-primary">
              <p className="text-xs text-primary mb-1">我的回复</p>
              <p className="text-sm text-foreground/80">{comment.reply}</p>
              {comment.replyAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(comment.replyAt)}
                </p>
              )}
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex items-center gap-1 shrink-0">
            {comment.status === 'pending' && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleApprove(comment)}
                  className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleReject(comment)}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            {comment.status === 'approved' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openReplyDialog(comment)}
                className="text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                <Reply className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(comment)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>留言管理</CardTitle>
          <CardDescription>审核和管理访客留言</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="pending" className="gap-2">
                待审核
                {pending.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {pending.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">已通过</TabsTrigger>
              <TabsTrigger value="rejected">已拒绝</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <AnimatePresence>
                {pending.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </AnimatePresence>
              {pending.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>暂无待审核的留言</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <AnimatePresence>
                {approved.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </AnimatePresence>
              {approved.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>暂无已通过的留言</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <AnimatePresence>
                {rejectedComments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} showActions={false} />
                ))}
              </AnimatePresence>
              {rejectedComments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>暂无已拒绝的留言</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle>回复留言</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {replyingComment && (
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">
                  {replyingComment.nickname || '匿名用户'} 说：
                </p>
                <p className="text-sm text-foreground">{replyingComment.content}</p>
              </div>
            )}

            <div>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="输入您的回复..."
                className="bg-secondary/50 resize-none"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={handleReply} 
              disabled={!replyContent.trim()}
              className="bg-gradient-primary hover:opacity-90 gap-2"
            >
              <Reply className="h-4 w-4" />
              发布回复
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

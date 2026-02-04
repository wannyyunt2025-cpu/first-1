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
import { useTheme } from '@/hooks/useTheme';
import { Comment } from '@/types';
import { cn } from '@/lib/utils';

export function CommentManager() {
  const { comments, pending, approved, approve, reject, reply, remove } = useComments();
  const { toast } = useToast();
  const { style } = useTheme();
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyingComment, setReplyingComment] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const isMinimalist = style === 'minimalist';

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "p-5 rounded-2xl border transition-all duration-300",
        isMinimalist 
          ? "bg-white border-slate-100 hover:border-primary/20 hover:shadow-md" 
          : "bg-secondary/30 border-border/30"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className={cn(
              "font-bold tracking-tight",
              isMinimalist ? "text-slate-900" : "text-foreground"
            )}>
              {comment.nickname || (isMinimalist ? 'Anonymous' : '匿名用户')}
            </span>
            {getStatusBadge(comment.status)}
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              isMinimalist ? "text-slate-400" : "text-muted-foreground"
            )}>
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className={cn(
            "text-sm leading-relaxed",
            isMinimalist ? "text-slate-600" : "text-foreground/90"
          )}>
            {comment.content}
          </p>
          {comment.reply && (
            <div className={cn(
              "mt-4 p-4 rounded-xl border-l-4 transition-all",
              isMinimalist 
                ? "bg-slate-50 border-slate-900" 
                : "bg-primary/5 border-primary"
            )}>
              <p className={cn(
                "text-[10px] font-black uppercase tracking-widest mb-2",
                isMinimalist ? "text-slate-900" : "text-primary"
              )}>
                {isMinimalist ? 'My Reply' : '我的回复'}
              </p>
              <p className={cn(
                "text-sm leading-relaxed",
                isMinimalist ? "text-slate-600" : "text-foreground/80"
              )}>
                {comment.reply}
              </p>
              {comment.replyAt && (
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest mt-2",
                  isMinimalist ? "text-slate-400" : "text-muted-foreground"
                )}>
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
                  className="text-slate-300 hover:text-green-500 hover:bg-transparent transition-colors"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleReject(comment)}
                  className="text-slate-300 hover:text-red-500 hover:bg-transparent transition-colors"
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
                className="text-slate-300 hover:text-primary hover:bg-transparent transition-colors"
              >
                <Reply className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(comment)}
              className="text-slate-300 hover:text-destructive hover:bg-transparent transition-colors"
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
      <Card className={cn(
        "border-none shadow-sm",
        isMinimalist ? "bg-white" : "bg-card"
      )}>
        <CardHeader className="pb-8">
          <CardTitle className={cn(
            "font-black tracking-tight",
            isMinimalist ? "text-2xl text-slate-900" : ""
          )}>
            {isMinimalist ? 'Engagement & Feedback' : '留言管理'}
          </CardTitle>
          <CardDescription className={isMinimalist ? "text-slate-500 font-medium" : ""}>
            {isMinimalist ? 'Review and respond to visitor messages.' : '审核和管理访客留言'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className={cn(
              "grid w-full grid-cols-3 mb-8 p-1 rounded-2xl",
              isMinimalist ? "bg-slate-50" : "bg-secondary"
            )}>
              <TabsTrigger 
                value="pending" 
                className={cn(
                  "gap-2 rounded-xl font-bold transition-all",
                  isMinimalist ? "data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm" : ""
                )}
              >
                {isMinimalist ? 'Pending' : '待审核'}
                {pending.length > 0 && (
                  <Badge variant="secondary" className={cn(
                    "ml-1 h-5 min-w-[20px] px-1 font-black",
                    isMinimalist ? "bg-slate-900 text-white" : ""
                  )}>
                    {pending.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="approved"
                className={cn(
                  "rounded-xl font-bold transition-all",
                  isMinimalist ? "data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm" : ""
                )}
              >
                {isMinimalist ? 'Approved' : '已通过'}
              </TabsTrigger>
              <TabsTrigger 
                value="rejected"
                className={cn(
                  "rounded-xl font-bold transition-all",
                  isMinimalist ? "data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm" : ""
                )}
              >
                {isMinimalist ? 'Rejected' : '已拒绝'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 focus-visible:outline-none">
              <AnimatePresence>
                {pending.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </AnimatePresence>
              {pending.length === 0 && (
                <div className={cn(
                  "text-center py-16 border-2 border-dashed rounded-3xl transition-all",
                  isMinimalist ? "border-slate-100 bg-slate-50/30" : "border-border/50 bg-card/20"
                )}>
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-200" />
                  <p className="font-bold text-slate-400">
                    {isMinimalist ? 'No pending messages' : '暂无待审核的留言'}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4 focus-visible:outline-none">
              <AnimatePresence>
                {approved.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </AnimatePresence>
              {approved.length === 0 && (
                <div className={cn(
                  "text-center py-16 border-2 border-dashed rounded-3xl transition-all",
                  isMinimalist ? "border-slate-100 bg-slate-50/30" : "border-border/50 bg-card/20"
                )}>
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-200" />
                  <p className="font-bold text-slate-400">
                    {isMinimalist ? 'No approved messages' : '暂无已通过的留言'}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4 focus-visible:outline-none">
              <AnimatePresence>
                {rejectedComments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} showActions={false} />
                ))}
              </AnimatePresence>
              {rejectedComments.length === 0 && (
                <div className={cn(
                  "text-center py-16 border-2 border-dashed rounded-3xl transition-all",
                  isMinimalist ? "border-slate-100 bg-slate-50/30" : "border-border/50 bg-card/20"
                )}>
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-200" />
                  <p className="font-bold text-slate-400">
                    {isMinimalist ? 'No rejected messages' : '暂无已拒绝的留言'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className={cn(
          "max-w-lg border-none shadow-2xl",
          isMinimalist ? "bg-white rounded-3xl" : "bg-card"
        )}>
          <DialogHeader>
            <DialogTitle className={cn(
              "text-xl font-black tracking-tight",
              isMinimalist ? "text-slate-900" : ""
            )}>
              {isMinimalist ? 'Reply to Message' : '回复留言'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {replyingComment && (
              <div className={cn(
                "p-4 rounded-2xl border transition-all",
                isMinimalist ? "bg-slate-50 border-slate-100" : "bg-secondary/50 border-border/50"
              )}>
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest mb-2",
                  isMinimalist ? "text-slate-400" : "text-muted-foreground"
                )}>
                  {replyingComment.nickname || (isMinimalist ? 'Anonymous' : '匿名用户')} {isMinimalist ? 'said' : '说'}：
                </p>
                <p className={cn(
                  "text-sm leading-relaxed",
                  isMinimalist ? "text-slate-600" : "text-foreground"
                )}>
                  {replyingComment.content}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                isMinimalist ? "text-slate-400" : ""
              )}>
                {isMinimalist ? 'Your Reply' : '输入您的回复'}
              </Label>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={isMinimalist ? "Write your response..." : "输入您的回复..."}
                className={cn(
                  "min-h-[120px] rounded-2xl focus:ring-primary/20 transition-all resize-none",
                  isMinimalist ? "bg-slate-50 border-slate-100" : "bg-secondary/50"
                )}
                rows={4}
              />
            </div>
          </div>

          <div className={cn(
            "flex justify-end gap-3 pt-6 border-t",
            isMinimalist ? "border-slate-50" : "border-border"
          )}>
            <Button 
              variant="ghost" 
              onClick={() => setReplyDialogOpen(false)}
              className={cn(
                "font-bold rounded-xl",
                isMinimalist ? "text-slate-400 hover:text-slate-600" : ""
              )}
            >
              {isMinimalist ? 'Cancel' : '取消'}
            </Button>
            <Button 
              onClick={handleReply} 
              disabled={!replyContent.trim()}
              className={cn(
                "h-11 px-8 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all",
                isMinimalist ? "bg-slate-900 hover:bg-slate-800 text-white" : "bg-gradient-primary hover:opacity-90"
              )}
            >
              <Reply className="h-4 w-4 mr-2" />
              {isMinimalist ? 'Send Reply' : '发布回复'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

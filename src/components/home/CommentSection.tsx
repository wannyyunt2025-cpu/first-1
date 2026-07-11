import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useComments } from '@/hooks/useComments';
import { useToast } from '@/hooks/use-toast';

export function CommentSection() {
  const { approved, submit, isLoading } = useComments();
  const { toast } = useToast();
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submit(content, nickname);
    
    if (result.success) {
      toast({
        title: '提交成功',
        description: result.message,
      });
      setNickname('');
      setContent('');
    } else {
      toast({
        title: '提交失败',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section id="comments" className="section">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            留言互动
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            欢迎留言交流，我会尽快回复
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Comment Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border border-border">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="comment-nickname" className="sr-only">昵称</label>
                      <Input
                        id="comment-nickname"
                        placeholder="昵称（选填）"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        maxLength={20}
                        className="border-border"
                      />
                    </div>
                    <div>
                      <label htmlFor="comment-content" className="sr-only">留言内容</label>
                      <Textarea
                        id="comment-content"
                        placeholder="写下你的留言... (5-500字)"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        maxLength={500}
                        aria-describedby="comment-content-counter"
                        className="border-border resize-none"
                      />
                      <div className="flex justify-between mt-1">
                        <span id="comment-content-counter" className="text-sm text-muted-foreground">
                          {content.length}/500
                        </span>
                      </div>
                    </div>
                    <div>
                      <Button
                        type="submit"
                        disabled={isLoading || content.length < 5}
                        className="w-full btn-hover"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        提交留言
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Comments List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {approved.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
                  <p>还没有留言，来做第一个吧</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {approved.slice(0, 10).map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border border-border">
                        <CardContent className="pt-4 pb-3">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {comment.nickname || '匿名用户'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(comment.createdAt)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {comment.content}
                          </p>
                          {comment.reply && (
                            <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                              <p className="text-xs font-medium text-primary mb-1">作者回复</p>
                              <p className="text-sm text-muted-foreground">
                                {comment.reply}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

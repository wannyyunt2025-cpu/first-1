import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, User, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useComments } from '@/hooks/useComments';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';

export function CommentSection() {
  const { comments, addComment, isLoading } = useComments();
  const { style } = useTheme();
  const { toast } = useToast();
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMinimalist = style === 'minimalist';

  const publicComments = comments.filter((c) => c.isPublic);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) return;

    setIsSubmitting(true);
    try {
      await addComment({
        author,
        content,
        isPublic: false, // Default to hidden until review
      });
      setAuthor('');
      setContent('');
      toast({
        title: isMinimalist ? 'Message Sent' : '提交成功',
        description: isMinimalist ? 'Your message is waiting for review.' : '您的留言已提交，审核后将公开显示',
      });
    } catch (error) {
      toast({
        title: isMinimalist ? 'Error' : '提交失败',
        description: isMinimalist ? 'Failed to send message.' : '无法提交留言，请稍后再试',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="comments" className={`py-24 transition-colors duration-700 ${isMinimalist ? 'bg-white' : 'bg-background'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`mb-16 ${isMinimalist ? 'text-center' : 'text-center'}`}
          >
            <h2 id="comments-heading" className={`font-black tracking-tighter ${
              isMinimalist ? 'text-sm uppercase tracking-[0.2em] text-primary mb-6' : 'text-3xl md:text-headline-lg text-foreground mb-4'
            }`}>
              {isMinimalist ? 'Connect' : '留言互动'}
            </h2>
            <h3 className={`font-black tracking-tighter leading-tight ${
              isMinimalist ? 'text-4xl md:text-5xl text-slate-900' : 'hidden'
            }`}>
              Let's collaborate.
            </h3>
            {!isMinimalist && (
              <p className="text-muted-foreground">
                欢迎在这里留下你的想法或建议
              </p>
            )}
          </motion.div>

          <div className={`grid gap-12 items-start ${isMinimalist ? 'md:grid-cols-2' : 'md:grid-cols-5'}`}>
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={isMinimalist 
                ? "bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm"
                : "md:col-span-2 p-6 rounded-2xl bg-card/50 backdrop-blur-md border border-border/50"
              }
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="author" className={isMinimalist ? "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" : ""}>
                    {isMinimalist ? 'Name' : '称呼'}
                  </Label>
                  <Input
                    id="author"
                    placeholder={isMinimalist ? "Your name" : "如何称呼您？"}
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={isMinimalist ? "bg-white border-slate-200 h-12 rounded-xl focus:ring-primary/20" : "bg-background/50"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className={isMinimalist ? "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" : ""}>
                    {isMinimalist ? 'Message' : '内容'}
                  </Label>
                  <Textarea
                    id="content"
                    placeholder={isMinimalist ? "Tell me about your project..." : "想说点什么..."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={isMinimalist ? "bg-white border-slate-200 min-h-[150px] rounded-xl focus:ring-primary/20 resize-none" : "bg-background/50 min-h-[120px]"}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full h-14 font-bold rounded-xl transition-all active:scale-[0.98] ${
                    isMinimalist ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-gradient-primary hover:opacity-90'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isMinimalist ? 'Sending...' : '发送中...'}
                    </div>
                  ) : (
                    isMinimalist ? 'Send Message' : '提交留言'
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Comments List */}
            <div className={isMinimalist ? "space-y-6" : "md:col-span-3 space-y-4"}>
              <AnimatePresence mode="popLayout">
                {publicComments.length > 0 ? (
                  publicComments.slice(0, 4).map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={isMinimalist 
                        ? "p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                        : "p-4 rounded-xl border border-border/30 bg-card/50 hover:border-primary/30 transition-colors"
                      }
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={`font-bold ${isMinimalist ? 'text-slate-900' : 'text-primary'}`}>{comment.author}</span>
                        <span className={`text-[10px] font-bold ${isMinimalist ? 'text-slate-300' : 'text-muted-foreground'}`}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${isMinimalist ? 'text-slate-500 italic' : 'text-foreground'}`}>
                        {isMinimalist ? `"${comment.content}"` : comment.content}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className={`h-full flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-3xl ${
                    isMinimalist ? 'bg-slate-50/50 border-slate-200' : 'bg-card/20 border-border/50'
                  }`}>
                    <MessageSquare className={`h-8 w-8 mb-4 opacity-20 ${isMinimalist ? 'text-slate-400' : 'text-muted-foreground'}`} />
                    <p className={`font-bold text-sm tracking-tight ${isMinimalist ? 'text-slate-400' : 'text-muted-foreground'}`}>
                      {isMinimalist ? 'No messages yet. Be the first!' : '暂无留言，快来抢沙发吧~'}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

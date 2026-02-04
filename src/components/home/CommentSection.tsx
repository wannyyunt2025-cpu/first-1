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
    <section id="comments" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 id="comments-heading" className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">
              Connect
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter">
              Let's collaborate.
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Name</Label>
                  <Input
                    id="nickname"
                    placeholder="Your name"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="bg-white border-slate-200 h-12 rounded-xl focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</Label>
                  <Textarea
                    id="content"
                    placeholder="Tell me about your project..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-white border-slate-200 min-h-[150px] rounded-xl focus:ring-primary/20 resize-none"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || content.length < 5}
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Comments List */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {approved.length > 0 ? (
                  approved.slice(0, 4).map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-slate-900">{comment.nickname || 'Anonymous'}</span>
                        <span className="text-[10px] font-bold text-slate-300">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed italic">
                        "{comment.content}"
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <MessageSquare className="h-8 w-8 text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold text-sm tracking-tight">No messages yet. Be the first!</p>
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

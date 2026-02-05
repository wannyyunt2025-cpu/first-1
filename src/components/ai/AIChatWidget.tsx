import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useSkills } from '@/hooks/useSkills';
import { useProjects } from '@/hooks/useProjects';
import { useEducation } from '@/hooks/useEducation';
import { generateSystemPrompt } from '@/lib/system-prompt';
import { cn } from '@/lib/utils';
import { getEducation, getPortfolios } from '@/lib/storage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // 新增 sessionId 状态，每次刷新页面生成一个新的，确保会话隔离
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 获取所有必要数据用于生成 Prompt
  const { profile } = useProfile();
  const { skills } = useSkills();
  const { publicProjects } = useProjects();
  // Education 和 Portfolios 目前没有专门的 hook 暴露 data，直接从 storage 或数据库获取
  // 为了确保是最新的，这里简单处理，实际应统一通过 hook 或 context 管理
  // 由于我们已经重构了 storage 为 database-first，但 useEducation hook 还是基于 storage 的简单封装
  // 这里暂时直接读取 storage 作为 fallback，理想情况应使用 hook
  const education = getEducation();
  const portfolios = getPortfolios();

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isOpen]);

  // 首次打开时发送欢迎语
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `你好！我是 ${profile.name || '博主'} 的 AI 数字分身。你可以问我关于技术栈、项目经历或者合作机会的问题。请问有什么可以帮你的吗？`
        }
      ]);
    }
  }, [isOpen, messages.length, profile.name]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // 动态生成最新的 System Prompt
      const systemPrompt = generateSystemPrompt({
        profile,
        skills,
        projects: publicProjects,
        education,
        portfolios,
        comments: [], // 聊天暂不需要留言数据
        resumeRecords: []
      });

      // 准备历史消息上下文 (百炼 API 格式可能需要调整，这里先传最后几轮)
      // 为了节省 token，只传最近 6 条
      const historyContext = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          systemPrompt,
          history: historyContext,
          sessionId // 传递 sessionId 给后端
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      // 解析百炼 API 返回结构，通常在 output.text 中
      const aiResponse = data.output?.text || "抱歉，我暂时无法回答这个问题。";

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "发送失败",
        description: "AI 暂时无法响应，请稍后再试",
        variant: "destructive"
      });
      setMessages(prev => [...prev, { role: 'assistant', content: "抱歉，连接出了点问题，请稍后再试。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-[350px] md:w-[400px] h-[500px] bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI 数字分身</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-primary/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                      msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted/50 text-foreground border border-border/50 rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 max-w-[85%] mr-auto">
                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-muted/50 border border-border/50 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">思考中...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-background/50">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="问我任何问题..."
                  className="flex-1 bg-background/50 border-border/50 focus-visible:ring-primary/20"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !inputValue.trim()}
                  size="icon"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/50">
                <Sparkles className="w-3 h-3" />
                <span>Powered by Aliyun Bailian</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "pointer-events-auto relative group flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          isOpen 
            ? "bg-muted text-muted-foreground hover:bg-muted/80" 
            : "bg-gradient-primary text-white shadow-glow"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification Dot (optional logic could be added here) */}
        {!isOpen && messages.length === 0 && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
}

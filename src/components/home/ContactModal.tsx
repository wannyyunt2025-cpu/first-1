import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Copy, Check, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';
import { decodeContact, encodeContact } from '@/lib/encryption';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const { profile } = useProfile();
  const { style } = useTheme();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isMinimalist = style === 'minimalist';

  // 只显示非私密的联系方式
  const contactItems = [
    {
      key: 'email',
      label: isMinimalist ? 'Email' : '邮箱',
      value: profile.contact.email,
      visibility: profile.visibility.email,
      icon: Mail,
      encoded: encodeContact(profile.contact.email),
    },
    {
      key: 'wechat',
      label: isMinimalist ? 'WeChat' : '微信',
      value: profile.contact.wechat,
      visibility: profile.visibility.wechat,
      icon: MessageSquare,
      encoded: encodeContact(profile.contact.wechat),
    },
  ].filter(item => item.visibility !== 'private' && item.value);

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(key);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-md border-none ${isMinimalist ? 'bg-white shadow-2xl rounded-3xl' : 'bg-card border border-border'}`}>
        {/* Watermark */}
        <div className={`watermark select-none ${isMinimalist ? 'text-slate-100 opacity-50' : 'text-foreground opacity-10'}`}>
          {isMinimalist ? 'CONFIDENTIAL' : '请勿外传'}
        </div>

        <DialogHeader className="relative z-10">
          <DialogTitle className={`font-black tracking-tight ${isMinimalist ? 'text-2xl text-slate-900' : 'text-foreground'}`}>
            {isMinimalist ? "Let's Connect" : '联系方式'}
          </DialogTitle>
          <DialogDescription className={isMinimalist ? 'text-slate-500 font-medium' : 'text-muted-foreground'}>
            {isMinimalist ? 'Feel free to reach out for collaborations or inquiries.' : '感谢您的关注！以下是我的联系方式'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6 relative z-10">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const isCopied = copiedField === item.key;
            // 从编码值解码显示
            const displayValue = decodeContact(item.encoded);

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                  isMinimalist 
                    ? 'bg-slate-50 border-slate-100 hover:border-primary/20' 
                    : 'bg-secondary/30 border border-border/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isMinimalist ? 'bg-white shadow-sm' : 'bg-primary/10'}`}>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isMinimalist ? 'text-slate-400' : 'text-muted-foreground'}`}>
                      {item.label}
                    </p>
                    <p className={`font-bold ${isMinimalist ? 'text-slate-900' : 'text-foreground'}`}>
                      {displayValue}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(displayValue, item.key)}
                  className="shrink-0 text-muted-foreground hover:text-primary hover:bg-transparent"
                  aria-label={`复制${item.label}`}
                >
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            );
          })}

          {contactItems.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              {isMinimalist ? 'No contact methods available' : '暂无公开的联系方式'}
            </p>
          )}
        </div>

        <div className="text-center relative z-10">
          <p className={`text-xs font-medium ${isMinimalist ? 'text-slate-400' : 'text-muted-foreground'}`}>
            {isMinimalist ? 'Personal use only. Please respect privacy.' : '请尊重隐私，仅用于正当沟通目的'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

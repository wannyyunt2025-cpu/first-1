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
import { decodeContact, encodeContact } from '@/lib/encryption';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const { profile } = useProfile();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // 只显示非私密的联系方式
  const contactItems = [
    {
      key: 'email',
      label: '邮箱',
      value: profile.contact.email,
      visibility: profile.visibility.email,
      icon: Mail,
      encoded: encodeContact(profile.contact.email),
    },
    {
      key: 'wechat',
      label: '微信',
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
      <DialogContent className="sm:max-w-md bg-card border-border">
        {/* Watermark */}
        <div className="watermark text-foreground select-none">
          请勿外传
        </div>

        <DialogHeader>
          <DialogTitle className="text-foreground">联系方式</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            感谢您的关注！以下是我的联系方式
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 relative z-10">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const isCopied = copiedField === item.key;
            // 从编码值解码显示
            const displayValue = decodeContact(item.encoded);

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-foreground">{displayValue}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(displayValue, item.key)}
                  className="shrink-0 text-muted-foreground hover:text-primary"
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
              暂无公开的联系方式
            </p>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            请尊重隐私，仅用于正当沟通目的
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

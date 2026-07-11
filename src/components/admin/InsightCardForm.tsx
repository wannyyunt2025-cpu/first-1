import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Eye, EyeOff, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useInsightCards } from '@/hooks/useInsightCards';
import { InsightCard } from '@/types';

const emptyCard: Omit<InsightCard, 'id' | 'sortOrder'> = {
  title: '',
  content: '',
  sourceProjectId: '',
  isPublic: true,
};

export function InsightCardForm() {
  const { cards, add, update, remove, isLoading } = useInsightCards();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<InsightCard | null>(null);
  const [formData, setFormData] = useState<Omit<InsightCard, 'id' | 'sortOrder'>>(emptyCard);

  const sortedCards = [...cards].sort((a, b) => a.sortOrder - b.sortOrder);

  const openCreateDialog = () => {
    setEditingCard(null);
    setFormData(emptyCard);
    setIsDialogOpen(true);
  };

  const openEditDialog = (card: InsightCard) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      content: card.content,
      sourceProjectId: card.sourceProjectId || '',
      isPublic: card.isPublic,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    const payload = {
      ...formData,
      sourceProjectId: formData.sourceProjectId?.trim() || undefined,
    };

    if (editingCard) {
      await update({ ...editingCard, ...payload });
    } else {
      await add(payload);
    }

    setIsDialogOpen(false);
  };

  return (
    <>
      <Card className="bg-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>观点卡片</CardTitle>
            <CardDescription>
              管理首页“AI 理解”模块。这里适合写判断、方法论和工具边界，不适合写流水账。
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog} className="bg-gradient-primary hover:opacity-90 gap-2">
            <Plus className="h-4 w-4" />
            添加观点
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {sortedCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.04 }}
                className="group rounded-lg border border-border/30 bg-secondary/30 p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-foreground">{card.title}</h4>
                      {!card.isPublic && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">私密</Badge>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm text-foreground/80">{card.content}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => update({ ...card, isPublic: !card.isPublic })}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {card.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(card)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(card.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {cards.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              还没有观点卡片。建议先写 3-4 条你对 AI 工具、产品判断、落地边界的理解。
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl bg-card">
          <DialogHeader>
            <DialogTitle>{editingCard ? '编辑观点卡片' : '添加观点卡片'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>标题 *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="如：AI 擅长加速原型，但不能替代判断"
                className="mt-1 bg-secondary/50"
              />
            </div>

            <div>
              <Label>内容 *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="用 1-3 句话说清楚你的理解，避免写得像口号。"
                rows={5}
                className="mt-1 resize-none bg-secondary/50"
              />
            </div>

            <div>
              <Label>关联项目 ID（可选）</Label>
              <Input
                value={formData.sourceProjectId || ''}
                onChange={(e) => setFormData({ ...formData, sourceProjectId: e.target.value })}
                placeholder="后续可用于把观点和项目复盘关联起来"
                className="mt-1 bg-secondary/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
              <Label>公开展示到首页 AI 理解</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-gradient-primary hover:opacity-90 gap-2">
              <Save className="h-4 w-4" />
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

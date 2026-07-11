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
import { useLearningRecords } from '@/hooks/useLearningRecords';
import { LearningRecord } from '@/types';

const recordTypes: Array<{ value: LearningRecord['type']; label: string }> = [
  { value: 'tool', label: '工具学习' },
  { value: 'bootcamp', label: '训练营' },
  { value: 'volunteer', label: '志愿者/先锋官' },
  { value: 'project', label: '项目实践' },
  { value: 'other', label: '其他' },
];

const emptyRecord: Omit<LearningRecord, 'id' | 'sortOrder'> = {
  title: '',
  type: 'tool',
  time: '',
  role: '',
  output: '',
  reflection: '',
  isPublic: true,
};

export function LearningRecordForm() {
  const { records, add, update, remove, isLoading } = useLearningRecords();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LearningRecord | null>(null);
  const [formData, setFormData] = useState<Omit<LearningRecord, 'id' | 'sortOrder'>>(emptyRecord);

  const sortedRecords = [...records].sort((a, b) => a.sortOrder - b.sortOrder);

  const openCreateDialog = () => {
    setEditingRecord(null);
    setFormData(emptyRecord);
    setIsDialogOpen(true);
  };

  const openEditDialog = (record: LearningRecord) => {
    setEditingRecord(record);
    setFormData({
      title: record.title,
      type: record.type,
      time: record.time,
      role: record.role || '',
      output: record.output || '',
      reflection: record.reflection || '',
      isPublic: record.isPublic,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.time.trim()) return;

    if (editingRecord) {
      await update({ ...editingRecord, ...formData });
    } else {
      await add(formData);
    }

    setIsDialogOpen(false);
  };

  const getTypeLabel = (type: LearningRecord['type']) => {
    return recordTypes.find((item) => item.value === type)?.label || '其他';
  };

  return (
    <>
      <Card className="bg-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>学习经历</CardTitle>
            <CardDescription>
              管理首页“学习路径”读取的训练营、工具学习、志愿者和项目实践经历。
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog} className="bg-gradient-primary hover:opacity-90 gap-2">
            <Plus className="h-4 w-4" />
            添加经历
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {sortedRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.04 }}
                className="group rounded-lg border border-border/30 bg-secondary/30 p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-foreground">{record.title}</h4>
                      <Badge variant="secondary" className="text-xs">{getTypeLabel(record.type)}</Badge>
                      {!record.isPublic && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">私密</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{record.time}{record.role ? ` | ${record.role}` : ''}</p>
                    {record.output && (
                      <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{record.output}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => update({ ...record, isPublic: !record.isPublic })}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {record.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(record)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(record.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {records.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              还没有学习经历。建议先添加 n8n、Coze、Vibecoding、OpenClaw、训练营志愿者等记录。
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-card">
          <DialogHeader>
            <DialogTitle>{editingRecord ? '编辑学习经历' : '添加学习经历'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>标题 *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="如：Coze 智能体训练营"
                  className="mt-1 bg-secondary/50"
                />
              </div>
              <div>
                <Label>时间 *</Label>
                <Input
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="如：2025.08 / 2025 上半年"
                  className="mt-1 bg-secondary/50"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>类型</Label>
                <Input
                  list="learning-record-types"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as LearningRecord['type'] })}
                  className="mt-1 bg-secondary/50"
                />
                <datalist id="learning-record-types">
                  {recordTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </datalist>
              </div>
              <div>
                <Label>角色</Label>
                <Input
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="如：学员 / 志愿者 / 先锋官"
                  className="mt-1 bg-secondary/50"
                />
              </div>
            </div>

            <div>
              <Label>产出 / 做了什么</Label>
              <Textarea
                value={formData.output || ''}
                onChange={(e) => setFormData({ ...formData, output: e.target.value })}
                placeholder="简要写清楚这段经历带来了什么产出，而不是只写参加过。"
                rows={3}
                className="mt-1 resize-none bg-secondary/50"
              />
            </div>

            <div>
              <Label>反思 / 学到了什么</Label>
              <Textarea
                value={formData.reflection || ''}
                onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                placeholder="写工具理解、边界、下一步补足方向。"
                rows={3}
                className="mt-1 resize-none bg-secondary/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
              <Label>公开展示到首页学习路径</Label>
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

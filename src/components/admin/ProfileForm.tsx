import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types';

const profileSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  title: z.string().min(1, '请输入职业定位'),
  slogan: z.string().min(1, '请输入一句话介绍'),
  avatar: z.string().optional(),
  email: z.string().email('请输入有效的邮箱地址'),
  wechat: z.string().min(1, '请输入微信号'),
  phone: z.string().optional(),
  emailVisibility: z.enum(['public', 'semi', 'private']),
  wechatVisibility: z.enum(['public', 'semi', 'private']),
  phoneVisibility: z.enum(['public', 'semi', 'private']),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { profile, updateProfile, isLoading } = useProfile();
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      title: profile.title,
      slogan: profile.slogan,
      avatar: profile.avatar || '',
      email: profile.contact.email,
      wechat: profile.contact.wechat,
      phone: profile.contact.phone || '',
      emailVisibility: profile.visibility.email,
      wechatVisibility: profile.visibility.wechat,
      phoneVisibility: profile.visibility.phone,
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const newProfile: Profile = {
      ...profile,
      name: data.name,
      title: data.title,
      slogan: data.slogan,
      avatar: data.avatar,
      contact: {
        email: data.email,
        wechat: data.wechat,
        phone: data.phone,
      },
      visibility: {
        email: data.emailVisibility,
        wechat: data.wechatVisibility,
        phone: data.phoneVisibility,
      },
    };
    updateProfile(newProfile);
    toast({
      title: '保存成功',
      description: '基础信息已更新',
    });
  };

  const visibilityOptions = [
    { value: 'public', label: '公开' },
    { value: 'semi', label: '半公开（点击显示）' },
    { value: 'private', label: '私密' },
  ];

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle>基础信息</CardTitle>
        <CardDescription>管理您的个人信息和联系方式</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-secondary/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>职业定位</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="如：全栈开发工程师" className="bg-secondary/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="slogan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>一句话介绍</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="用一句话描述您的核心价值主张"
                      className="bg-secondary/50 resize-none"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>头像URL（选填）</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." className="bg-secondary/50" />
                  </FormControl>
                  <FormDescription>输入头像图片的URL地址</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Info */}
            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">联系方式</h3>
              
              <div className="space-y-4">
                {/* Email */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>邮箱</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="bg-secondary/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="emailVisibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>可见性</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-secondary/50">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {visibilityOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* WeChat */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="wechat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>微信号</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-secondary/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="wechatVisibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>可见性</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-secondary/50">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {visibilityOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>手机号（选填）</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-secondary/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phoneVisibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>可见性</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-secondary/50">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {visibilityOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-primary hover:opacity-90 gap-2"
              >
                <Save className="h-4 w-4" />
                保存更改
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

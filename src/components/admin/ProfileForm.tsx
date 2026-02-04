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
import { useTheme } from '@/hooks/useTheme';

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
  const { style } = useTheme();
  const { toast } = useToast();

  const isMinimalist = style === 'minimalist';

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
      title: isMinimalist ? 'Settings Saved' : '保存成功',
      description: isMinimalist ? 'Profile information updated.' : '基础信息已更新',
    });
  };

  const visibilityOptions = [
    { value: 'public', label: isMinimalist ? 'Public' : '公开' },
    { value: 'semi', label: isMinimalist ? 'Click to show' : '半公开（点击显示）' },
    { value: 'private', label: isMinimalist ? 'Private' : '私密' },
  ];

  return (
    <Card className={`border-none shadow-sm ${isMinimalist ? 'bg-white' : 'bg-card'}`}>
      <CardHeader className="pb-8">
        <CardTitle className={`font-black tracking-tight ${isMinimalist ? 'text-2xl text-slate-900' : ''}`}>
          {isMinimalist ? 'Basic Information' : '基础信息'}
        </CardTitle>
        <CardDescription className={isMinimalist ? 'text-slate-500 font-medium' : ''}>
          {isMinimalist ? 'Manage your personal details and contact methods.' : '管理您的个人信息和联系方式'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={isMinimalist ? "text-[10px] font-black uppercase tracking-widest text-slate-400" : ""}>
                      {isMinimalist ? 'Name' : '姓名'}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`} />
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
                    <FormLabel className={isMinimalist ? "text-[10px] font-black uppercase tracking-widest text-slate-400" : ""}>
                      {isMinimalist ? 'Professional Title' : '职业定位'}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={isMinimalist ? "e.g. Fullstack Developer" : "如：全栈开发工程师"} className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`} />
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
                  <FormLabel className={isMinimalist ? "text-[10px] font-black uppercase tracking-widest text-slate-400" : ""}>
                    {isMinimalist ? 'Headline / Slogan' : '一句话介绍'}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder={isMinimalist ? "Describe your value proposition..." : "用一句话描述您的核心价值主张"}
                      className={`min-h-[100px] rounded-2xl focus:ring-primary/20 transition-all resize-none ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}
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
                  <FormLabel className={isMinimalist ? "text-[10px] font-black uppercase tracking-widest text-slate-400" : ""}>
                    {isMinimalist ? 'Avatar URL (Optional)' : '头像URL（选填）'}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Info */}
            <div className={`pt-8 border-t ${isMinimalist ? 'border-slate-50' : 'border-border'}`}>
              <h3 className={`font-black tracking-tight mb-6 ${isMinimalist ? 'text-lg text-slate-900' : 'text-lg font-semibold'}`}>
                {isMinimalist ? 'Contact Details' : '联系方式'}
              </h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isMinimalist ? "text-[10px] font-black uppercase tracking-widest text-slate-400" : ""}>
                            {isMinimalist ? 'Email' : '邮箱'}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`} />
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
                        <FormLabel className={isMinimalist ? "text-[10px] font-black uppercase tracking-widest text-slate-400" : ""}>
                          {isMinimalist ? 'Visibility' : '可见性'}
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={isMinimalist ? "rounded-xl border-slate-100" : ""}>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="wechat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isMinimalist ? "text-[10px] font-black uppercase tracking-widest text-slate-400" : ""}>
                            {isMinimalist ? 'WeChat ID' : '微信号'}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`} />
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
                        <FormLabel className={isMinimalist ? "text-[10px] font-black uppercase tracking-widest text-slate-400" : ""}>
                          {isMinimalist ? 'Visibility' : '可见性'}
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={`h-12 rounded-xl focus:ring-primary/20 transition-all ${isMinimalist ? 'bg-slate-50 border-slate-100' : 'bg-secondary/50'}`}>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={isMinimalist ? "rounded-xl border-slate-100" : ""}>
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

            <div className="flex justify-end pt-8 border-t border-slate-50">
              <Button 
                type="submit" 
                disabled={isLoading}
                className={`h-14 px-10 rounded-full font-bold shadow-xl transition-all active:scale-[0.98] ${
                  isMinimalist ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200' : 'bg-gradient-primary hover:opacity-90 gap-2'
                }`}
              >
                {!isMinimalist && <Save className="h-4 w-4" />}
                {isMinimalist ? 'Save Changes' : '保存更改'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Wrench, FolderOpen, GraduationCap, MessageSquare, Download, Upload, LogOut, Database, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/admin/ProfileForm';
import { SkillForm } from '@/components/admin/SkillForm';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { EducationForm } from '@/components/admin/EducationForm';
import { CommentManager } from '@/components/admin/CommentManager';
import { DataMigration } from '@/components/admin/DataMigration';
import { ResumeGenerator } from '@/components/admin/ResumeGenerator';
import { exportData, importData } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Admin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    logout();
    toast({
      title: '已登出',
      description: '您已安全登出',
    });
    navigate('/login');
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: '导出成功',
      description: '数据已下载到本地',
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (importData(content)) {
            toast({
              title: '导入成功',
              description: '数据已更新，刷新页面查看',
            });
            window.location.reload();
          } else {
            toast({
              title: '导入失败',
              description: '文件格式不正确',
              variant: 'destructive',
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const tabs = [
    { id: 'profile', label: '基础信息', icon: User },
    { id: 'skills', label: '技能管理', icon: Wrench },
    { id: 'projects', label: '项目经历', icon: FolderOpen },
    { id: 'education', label: '教育背景', icon: GraduationCap },
    { id: 'comments', label: '留言管理', icon: MessageSquare },
    { id: 'resume', label: '简历生成', icon: FileText },
    { id: 'database', label: '数据库迁移', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-foreground">管理后台</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleImport}
                className="gap-2 border-border"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">导入</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">导出</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">登出</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 h-auto bg-transparent p-0 mb-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-secondary/50 border border-border/50 rounded-lg"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>

            <TabsContent value="skills">
              <SkillForm />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectForm />
            </TabsContent>

            <TabsContent value="education">
              <EducationForm />
            </TabsContent>

            <TabsContent value="comments">
              <CommentManager />
            </TabsContent>

            <TabsContent value="resume">
              <ResumeGenerator />
            </TabsContent>

            <TabsContent value="database">
              <DataMigration />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}

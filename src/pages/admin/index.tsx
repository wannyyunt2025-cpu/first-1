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
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export default function Admin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { style } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  const isMinimalist = style === 'minimalist';

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Signed Out',
      description: 'You have been safely signed out.',
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
      title: 'Export Successful',
      description: 'Data has been downloaded to your device.',
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
              title: 'Import Successful',
              description: 'Data has been updated. Refreshing...',
            });
            window.location.reload();
          } else {
            toast({
              title: 'Import Failed',
              description: 'Invalid file format.',
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
    { id: 'profile', label: 'Basic Info', icon: User },
    { id: 'skills', label: 'Expertise', icon: Wrench },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'resume', label: 'Resume AI', icon: FileText },
    { id: 'database', label: 'Migration', icon: Database },
  ];

  return (
    <div className={cn(
      "min-h-screen flex flex-col md:flex-row transition-colors duration-500",
      isMinimalist ? "bg-slate-50/50" : "bg-slate-950"
    )}>
      {/* Sidebar Navigation */}
      <aside className={cn(
        "w-full md:w-64 lg:w-72 border-r flex flex-col sticky top-0 h-auto md:h-screen z-20 transition-all duration-500",
        isMinimalist 
          ? "bg-white border-slate-200" 
          : "bg-slate-900/50 border-slate-800 backdrop-blur-xl"
      )}>
        <div className={cn(
          "p-8 border-b",
          isMinimalist ? "border-slate-50" : "border-slate-800/50"
        )}>
          <Link 
            to="/" 
            className={cn(
              "text-2xl font-black tracking-tighter flex items-center gap-2",
              isMinimalist ? "text-slate-900" : "text-white"
            )}
          >
            Portfolio<span className="text-primary">.</span>
          </Link>
          <p className={cn(
            "text-[10px] font-black uppercase tracking-[0.2em] mt-2",
            isMinimalist ? "text-slate-400" : "text-slate-500"
          )}>Admin Dashboard</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                  isActive 
                    ? (isMinimalist 
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                        : "bg-primary text-white shadow-lg shadow-primary/20")
                    : (isMinimalist
                        ? "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        : "text-slate-400 hover:bg-white/5 hover:text-white")
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : (isMinimalist ? "text-slate-400" : "text-slate-500"))} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className={cn(
          "p-4 border-t space-y-2",
          isMinimalist ? "border-slate-50" : "border-slate-800/50"
        )}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleExport}
            className={cn(
              "w-full justify-start gap-3 font-bold rounded-xl",
              isMinimalist 
                ? "text-slate-500 hover:text-primary" 
                : "text-slate-400 hover:text-primary hover:bg-white/5"
            )}
          >
            <Upload className="h-4 w-4" />
            Export Data
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className={cn(
              "w-full justify-start gap-3 font-bold rounded-xl",
              isMinimalist 
                ? "text-slate-500 hover:text-destructive" 
                : "text-slate-400 hover:text-destructive hover:bg-white/5"
            )}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className={cn(
          "h-20 border-b flex items-center justify-between px-8 sticky top-0 z-10 transition-all duration-500",
          isMinimalist 
            ? "bg-white border-slate-100" 
            : "bg-slate-950/80 border-slate-800/50 backdrop-blur-md"
        )}>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-full",
                  isMinimalist ? "text-slate-400 hover:text-slate-900" : "text-slate-500 hover:text-white"
                )}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className={cn(
              "text-lg font-black tracking-tight",
              isMinimalist ? "text-slate-900" : "text-white"
            )}>
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleImport}
              className={cn(
                "font-bold rounded-full px-6 h-10 transition-all",
                isMinimalist 
                  ? "border-slate-200 text-slate-600 hover:bg-slate-50" 
                  : "border-slate-800 text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl"
          >
            {activeTab === 'profile' && <ProfileForm />}
            {activeTab === 'skills' && <SkillForm />}
            {activeTab === 'projects' && <ProjectForm />}
            {activeTab === 'education' && <EducationForm />}
            {activeTab === 'comments' && <CommentManager />}
            {activeTab === 'resume' && <ResumeGenerator />}
            {activeTab === 'database' && <DataMigration />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

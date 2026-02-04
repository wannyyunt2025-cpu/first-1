import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Trash2,
  Info
} from 'lucide-react';
import { 
  hasLocalStorageData, 
  getLocalStorageStats, 
  migrateToDatabase,
  clearLocalStorage,
  downloadBackup,
  type MigrationProgress
} from '@/lib/migration';
import { isDatabaseAvailable } from '@/lib/database';
import { isSupabaseConfigured } from '@/lib/supabase';

export function DataMigration() {
  const { style } = useTheme();
  const [hasLocalData, setHasLocalData] = useState(false);
  const [localStats, setLocalStats] = useState(getLocalStorageStats());
  const [dbConfigured, setDbConfigured] = useState(false);
  const [dbAvailable, setDbAvailable] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState<MigrationProgress | null>(null);
  const [migrationComplete, setMigrationComplete] = useState(false);

  const isMinimalist = style === 'minimalist';

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setHasLocalData(hasLocalStorageData());
    setLocalStats(getLocalStorageStats());
    setDbConfigured(isSupabaseConfigured());
    if (isSupabaseConfigured()) {
      const available = await isDatabaseAvailable();
      setDbAvailable(available);
    }
  };

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationComplete(false);
    
    const success = await migrateToDatabase((progress) => {
      setMigrationProgress(progress);
    });
    
    setIsMigrating(false);
    if (success) {
      setMigrationComplete(true);
      // 迁移成功后重新检查状态
      setTimeout(() => {
        checkStatus();
      }, 1000);
    }
  };

  const handleClearLocal = () => {
    if (confirm('确定要清除本地数据吗？请确保已成功迁移到数据库！')) {
      clearLocalStorage();
      checkStatus();
    }
  };

  // 如果没有配置数据库，显示配置提示
  if (!dbConfigured) {
    return (
      <Card className={cn(
        "border-none shadow-sm",
        isMinimalist ? "bg-white" : "border-amber-500/50 bg-amber-500/5"
      )}>
        <CardHeader className="pb-8">
          <div className="flex items-center gap-3">
            <Info className={cn("h-5 w-5", isMinimalist ? "text-slate-900" : "text-amber-500")} />
            <CardTitle className={cn("font-black tracking-tight", isMinimalist ? "text-2xl text-slate-900" : "")}>
              {isMinimalist ? 'Cloud Sync Required' : '数据库未配置'}
            </CardTitle>
          </div>
          <CardDescription className={isMinimalist ? "text-slate-500 font-medium" : ""}>
            {isMinimalist ? 'Configure Supabase to enable multi-device synchronization and cloud storage.' : '配置Supabase数据库以实现云端数据存储和多端同步'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className={cn(
            "rounded-2xl border-none",
            isMinimalist ? "bg-slate-50" : ""
          )}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={isMinimalist ? "text-slate-600 font-medium" : ""}>
              {isMinimalist ? 'Currently using local storage. Data is bound to this browser.' : '当前使用localStorage存储数据，数据仅保存在本地浏览器中。'}
              <ul className="mt-4 ml-4 list-disc space-y-2">
                <li>{isMinimalist ? 'Secure cloud backups' : '云端数据存储，防止数据丢失'}</li>
                <li>{isMinimalist ? 'Multi-device access' : '多端同步访问'}</li>
                <li>{isMinimalist ? 'Unlimited storage capacity' : '更大的存储容量'}</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <p className={cn("text-xs font-black uppercase tracking-widest", isMinimalist ? "text-slate-400" : "text-muted-foreground")}>
              {isMinimalist ? 'Setup Steps' : '配置步骤'}：
            </p>
            <ol className={cn("text-sm space-y-2 ml-4 list-decimal", isMinimalist ? "text-slate-600 font-medium" : "")}>
              <li>{isMinimalist ? 'Visit Supabase Dashboard' : '访问 Supabase Dashboard'}</li>
              <li>{isMinimalist ? 'Create a new project' : '创建新项目或选择现有项目'}</li>
              <li>{isMinimalist ? 'Copy API keys & URL' : '获取 Project URL 和 Anon Key'}</li>
              <li>{isMinimalist ? 'Update .env.local file' : '在项目根目录创建 .env.local 文件'}</li>
            </ol>
          </div>
          
          <Button asChild variant="outline" className={cn(
            "w-full h-12 rounded-xl font-bold",
            isMinimalist ? "border-slate-200 text-slate-900 hover:bg-slate-50" : ""
          )}>
            <a href="/SUPABASE_SETUP.md" target="_blank" rel="noopener noreferrer">
              <Database className="mr-2 h-4 w-4" />
              {isMinimalist ? 'View Documentation' : '查看详细配置指引'}
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 如果数据库不可用，显示连接错误
  if (!dbAvailable) {
    return (
      <Card className={cn(
        "border-none shadow-sm",
        isMinimalist ? "bg-white" : "border-destructive/50 bg-destructive/5"
      )}>
        <CardHeader className="pb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className={cn("h-5 w-5", isMinimalist ? "text-destructive" : "text-destructive")} />
            <CardTitle className={cn("font-black tracking-tight", isMinimalist ? "text-2xl text-slate-900" : "")}>
              {isMinimalist ? 'Connection Failure' : '数据库连接失败'}
            </CardTitle>
          </div>
          <CardDescription className={isMinimalist ? "text-slate-500 font-medium" : ""}>
            {isMinimalist ? 'Unable to reach Supabase. Please verify your credentials.' : '无法连接到Supabase数据库，请检查配置'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive" className="rounded-2xl border-none">
            <AlertDescription>
              {isMinimalist ? 'Potential issues:' : '可能的原因：'}
              <ul className="mt-4 ml-4 list-disc space-y-2">
                <li>{isMinimalist ? 'Invalid environment variables' : '环境变量配置错误'}</li>
                <li>{isMinimalist ? 'Network connectivity problems' : '网络连接问题'}</li>
                <li>{isMinimalist ? 'Project initialization incomplete' : 'Supabase项目未正确创建'}</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <Button 
            variant="outline" 
            onClick={checkStatus} 
            className={cn(
              "w-full h-12 rounded-xl font-bold",
              isMinimalist ? "border-slate-200 text-slate-900 hover:bg-slate-50" : ""
            )}
          >
            {isMinimalist ? 'Retry Connection' : '重新检测连接'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 如果没有本地数据且迁移已完成
  if (!hasLocalData && migrationComplete) {
    return (
      <Card className={cn(
        "border-none shadow-sm",
        isMinimalist ? "bg-white" : "border-green-500/50 bg-green-500/5"
      )}>
        <CardHeader className="pb-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className={cn("h-5 w-5", isMinimalist ? "text-green-500" : "text-green-500")} />
            <CardTitle className={cn("font-black tracking-tight", isMinimalist ? "text-2xl text-slate-900" : "")}>
              {isMinimalist ? 'Migration Complete' : '数据迁移完成'}
            </CardTitle>
          </div>
          <CardDescription className={isMinimalist ? "text-slate-500 font-medium" : ""}>
            {isMinimalist ? 'All your data is now securely stored in the cloud.' : '所有数据已成功迁移到云端数据库'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className={cn("text-sm leading-relaxed", isMinimalist ? "text-slate-600 font-medium" : "text-muted-foreground")}>
            {isMinimalist ? 'Your profile is now synced across all devices via Supabase.' : '现在你的数据已安全存储在Supabase云端，可以在任何设备上访问。'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // 显示迁移工具
  return (
    <Card className={cn(
      "border-none shadow-sm",
      isMinimalist ? "bg-white" : ""
    )}>
      <CardHeader className="pb-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={cn("flex items-center gap-3 font-black tracking-tight", isMinimalist ? "text-2xl text-slate-900" : "")}>
              <Database className={cn("h-5 w-5", isMinimalist ? "text-slate-900" : "")} />
              {isMinimalist ? 'Migration Toolkit' : '数据迁移工具'}
            </CardTitle>
            <CardDescription className={isMinimalist ? "text-slate-500 font-medium mt-1" : "mt-1.5"}>
              {isMinimalist ? 'Move your local browser data to the cloud database.' : '将localStorage数据迁移到Supabase云端数据库'}
            </CardDescription>
          </div>
          <Badge variant="outline" className={cn(
            "h-6 px-3 rounded-full font-black text-[10px] uppercase tracking-widest",
            isMinimalist ? "border-green-100 text-green-600 bg-green-50" : ""
          )}>
            {dbAvailable ? (isMinimalist ? 'Connected' : '数据库已连接') : (isMinimalist ? 'Disconnected' : '数据库未连接')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* 本地数据统计 */}
        {hasLocalData && (
          <div className="space-y-4">
            <h4 className={cn("text-[10px] font-black uppercase tracking-widest", isMinimalist ? "text-slate-400" : "text-sm font-medium")}>
              {isMinimalist ? 'Local Data Stats' : '本地数据概览'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label={isMinimalist ? "Profile" : "个人信息"} value={localStats.hasProfile ? '1' : '0'} isMinimalist={isMinimalist} />
              <StatCard label={isMinimalist ? "Skills" : "技能"} value={localStats.skillsCount} isMinimalist={isMinimalist} />
              <StatCard label={isMinimalist ? "Projects" : "项目"} value={localStats.projectsCount} isMinimalist={isMinimalist} />
              <StatCard label={isMinimalist ? "Education" : "教育背景"} value={localStats.educationCount} isMinimalist={isMinimalist} />
              <StatCard label={isMinimalist ? "Portfolios" : "作品集"} value={localStats.portfoliosCount} isMinimalist={isMinimalist} />
              <StatCard label={isMinimalist ? "Messages" : "留言"} value={localStats.commentsCount} isMinimalist={isMinimalist} />
            </div>
          </div>
        )}

        {/* 迁移进度 */}
        {isMigrating && migrationProgress && (
          <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-sm">
              <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">{migrationProgress.step}</span>
              <span className="font-black text-[10px] tracking-widest text-primary">
                {migrationProgress.current}/{migrationProgress.total}
              </span>
            </div>
            <Progress value={(migrationProgress.current / migrationProgress.total) * 100} className="h-2" />
            {migrationProgress.message && (
              <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">{migrationProgress.message}</p>
            )}
          </div>
        )}

        {/* 迁移成功提示 */}
        {migrationComplete && (
          <Alert className={cn(
            "rounded-2xl border-none",
            isMinimalist ? "bg-green-50" : "border-green-500/50 bg-green-500/5"
          )}>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className={cn(
              "font-bold",
              isMinimalist ? "text-green-700" : "text-green-700 dark:text-green-400"
            )}>
              {isMinimalist ? 'Data successfully moved to cloud!' : '数据迁移成功！所有数据已安全存储到云端数据库。'}
            </AlertDescription>
          </Alert>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-4 pt-4">
          {hasLocalData && !migrationComplete && (
            <Button
              onClick={handleMigration}
              disabled={isMigrating || !dbAvailable}
              className={cn(
                "flex-1 h-14 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all",
                isMinimalist ? "bg-slate-900 hover:bg-slate-800 text-white" : ""
              )}
            >
              {isMigrating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isMinimalist ? 'Migrating...' : '迁移中...'}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {isMinimalist ? 'Start Migration' : '开始迁移到数据库'}
                </>
              )}
            </Button>
          )}

          <Button
            onClick={downloadBackup}
            variant="outline"
            className={cn(
              "h-14 rounded-xl font-bold",
              isMinimalist ? "border-slate-200 text-slate-900 hover:bg-slate-50" : "",
              hasLocalData && !migrationComplete ? "px-8" : "flex-1"
            )}
          >
            <Download className="mr-2 h-4 w-4" />
            {isMinimalist ? 'Export Backup' : '下载JSON备份'}
          </Button>

          {hasLocalData && migrationComplete && (
            <Button
              onClick={handleClearLocal}
              variant="destructive"
              className="flex-1 h-14 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isMinimalist ? 'Wipe Local Data' : '清除本地数据'}
            </Button>
          )}
        </div>

        {/* 提示信息 */}
        <Alert className={cn(
          "rounded-2xl border-none",
          isMinimalist ? "bg-slate-50" : ""
        )}>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs leading-relaxed">
            <strong className="font-black uppercase tracking-wider">{isMinimalist ? 'Important' : '重要提示'}：</strong>
            {isMinimalist 
              ? 'Always backup before migrating. Migration does not delete local data automatically.' 
              : '迁移前建议先下载JSON备份。迁移不会自动删除本地数据，迁移成功后可手动清除。'}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value, isMinimalist }: { label: string; value: string | number; isMinimalist?: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all",
      isMinimalist ? "bg-white border-slate-100" : "bg-card"
    )}>
      <div className={cn("text-2xl font-black tracking-tighter", isMinimalist ? "text-slate-900" : "")}>{value}</div>
      <div className={cn("text-[10px] font-black uppercase tracking-widest mt-1", isMinimalist ? "text-slate-400" : "text-muted-foreground")}>{label}</div>
    </div>
  );
}

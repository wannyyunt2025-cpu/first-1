import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  const [hasLocalData, setHasLocalData] = useState(false);
  const [localStats, setLocalStats] = useState(getLocalStorageStats());
  const [dbConfigured, setDbConfigured] = useState(false);
  const [dbAvailable, setDbAvailable] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState<MigrationProgress | null>(null);
  const [migrationComplete, setMigrationComplete] = useState(false);

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
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-amber-500" />
            <CardTitle>数据库未配置</CardTitle>
          </div>
          <CardDescription>
            配置Supabase数据库以实现云端数据存储和多端同步
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              当前使用localStorage存储数据，数据仅保存在本地浏览器中。
              配置Supabase后可实现：
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>云端数据存储，防止数据丢失</li>
                <li>多端同步访问</li>
                <li>更大的存储容量</li>
                <li>更好的数据安全性</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">配置步骤：</p>
            <ol className="text-sm space-y-1 ml-4 list-decimal">
              <li>访问 <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase Dashboard</a></li>
              <li>创建新项目或选择现有项目</li>
              <li>获取 Project URL 和 Anon Key</li>
              <li>在项目根目录创建 .env.local 文件</li>
              <li>填写配置并重启服务器</li>
            </ol>
          </div>
          
          <Button asChild variant="outline" className="w-full">
            <a href="/SUPABASE_SETUP.md" target="_blank" rel="noopener noreferrer">
              <Database className="mr-2 h-4 w-4" />
              查看详细配置指引
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 如果数据库不可用，显示连接错误
  if (!dbAvailable) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>数据库连接失败</CardTitle>
          </div>
          <CardDescription>
            无法连接到Supabase数据库，请检查配置
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              可能的原因：
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>环境变量配置错误</li>
                <li>网络连接问题</li>
                <li>Supabase项目未正确创建</li>
                <li>数据库表未创建</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <Button variant="outline" onClick={checkStatus} className="w-full">
            重新检测连接
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 如果没有本地数据且迁移已完成
  if (!hasLocalData && migrationComplete) {
    return (
      <Card className="border-green-500/50 bg-green-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <CardTitle>数据迁移完成</CardTitle>
          </div>
          <CardDescription>
            所有数据已成功迁移到云端数据库
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            现在你的数据已安全存储在Supabase云端，可以在任何设备上访问。
          </p>
        </CardContent>
      </Card>
    );
  }

  // 显示迁移工具
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              数据迁移工具
            </CardTitle>
            <CardDescription className="mt-1.5">
              将localStorage数据迁移到Supabase云端数据库
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {dbAvailable ? '数据库已连接' : '数据库未连接'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 本地数据统计 */}
        {hasLocalData && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">本地数据概览</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatCard label="个人信息" value={localStats.hasProfile ? '1' : '0'} />
              <StatCard label="技能" value={localStats.skillsCount} />
              <StatCard label="项目" value={localStats.projectsCount} />
              <StatCard label="教育背景" value={localStats.educationCount} />
              <StatCard label="作品集" value={localStats.portfoliosCount} />
              <StatCard label="留言" value={localStats.commentsCount} />
            </div>
          </div>
        )}

        {/* 迁移进度 */}
        {isMigrating && migrationProgress && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{migrationProgress.step}</span>
              <span className="text-muted-foreground">
                {migrationProgress.current}/{migrationProgress.total}
              </span>
            </div>
            <Progress value={(migrationProgress.current / migrationProgress.total) * 100} />
            {migrationProgress.message && (
              <p className="text-sm text-muted-foreground">{migrationProgress.message}</p>
            )}
          </div>
        )}

        {/* 迁移成功提示 */}
        {migrationComplete && (
          <Alert className="border-green-500/50 bg-green-500/5">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              数据迁移成功！所有数据已安全存储到云端数据库。
            </AlertDescription>
          </Alert>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-3">
          {hasLocalData && !migrationComplete && (
            <Button
              onClick={handleMigration}
              disabled={isMigrating || !dbAvailable}
              className="flex-1"
            >
              {isMigrating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  迁移中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  开始迁移到数据库
                </>
              )}
            </Button>
          )}

          <Button
            onClick={downloadBackup}
            variant="outline"
            className={hasLocalData && !migrationComplete ? '' : 'flex-1'}
          >
            <Download className="mr-2 h-4 w-4" />
            下载JSON备份
          </Button>

          {hasLocalData && migrationComplete && (
            <Button
              onClick={handleClearLocal}
              variant="destructive"
              className="flex-1"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              清除本地数据
            </Button>
          )}
        </div>

        {/* 提示信息 */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>重要提示：</strong>
            迁移前建议先下载JSON备份。迁移不会自动删除本地数据，迁移成功后可手动清除。
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

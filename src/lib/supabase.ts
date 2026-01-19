import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase配置
// 请在Supabase控制台获取以下值：https://supabase.com/dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 检查Supabase是否已配置
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');
}

// 懒加载Supabase客户端（只在配置后创建）
let _supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  if (!_supabaseClient) {
    _supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  
  return _supabaseClient;
}

// 导出Supabase客户端（可能为null）
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      // 如果未配置，返回一个不会抛出错误的占位对象
      console.warn('Supabase未配置，请先配置环境变量');
      return () => Promise.resolve({ data: null, error: new Error('Supabase未配置') });
    }
    return Reflect.get(client, prop, client);
  },
});

// 数据库连接状态检查
export async function checkDatabaseConnection(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }
  
  try {
    const client = getSupabaseClient();
    if (!client) {
      return false;
    }
    const { error } = await client.from('profiles').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}

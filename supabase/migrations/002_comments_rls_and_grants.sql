-- 动态个人主页 - 留言（comments）RLS/权限修复与加固
-- 用途：
-- 1) 解决“匿名插入 comments 被 RLS/权限阻止”的问题
-- 2) 提供更安全的策略：访客仅可插入 pending，只有管理员可审核/删除/回复
--
-- 使用方式：复制整个脚本到 Supabase Dashboard -> SQL Editor 执行

-- ============================================
-- 0. 前置：确保表已存在
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'comments'
  ) THEN
    RAISE EXCEPTION 'public.comments does not exist. Please run 001_initial_schema.sql first.';
  END IF;
END $$;

-- ============================================
-- 1) 补齐 GRANT（没有 GRANT 时，RLS 通过也会写不进去）
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

REVOKE ALL ON TABLE public.comments FROM anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.comments TO anon, authenticated;
GRANT UPDATE, DELETE ON TABLE public.comments TO authenticated;

-- ============================================
-- 2) 开启 RLS
-- ============================================
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3) 管理员表（可选但推荐）
--    说明：需要你使用 Supabase Auth 登录后台（authenticated 角色）
-- ============================================
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

REVOKE ALL ON TABLE public.admins FROM anon, authenticated;
GRANT SELECT ON TABLE public.admins TO authenticated;

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read themselves" ON public.admins;
CREATE POLICY "Admins can read themselves" ON public.admins
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- 4) 重建 comments 策略（更安全的默认值）
-- ============================================
DROP POLICY IF EXISTS "Approved comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can manage comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can delete comments" ON public.comments;
DROP POLICY IF EXISTS "Public can read approved comments" ON public.comments;
DROP POLICY IF EXISTS "Public can insert pending comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can read all comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can update comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can delete comments" ON public.comments;

-- 访客/普通用户：只能读取已审核通过的留言
CREATE POLICY "Public can read approved comments" ON public.comments
  FOR SELECT TO anon, authenticated
  USING (status = 'approved');

-- 访客/普通用户：只能插入 pending，并且不能携带 reply
CREATE POLICY "Public can insert pending comments" ON public.comments
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND reply IS NULL
    AND reply_at IS NULL
    AND length(content) >= 5
    AND length(content) <= 500
  );

-- 管理员：可查看全部留言（含 pending/rejected）
CREATE POLICY "Admins can read all comments" ON public.comments
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- 管理员：可插入留言（用于迁移/导入历史数据，允许写入任意状态与 reply）
CREATE POLICY "Admins can insert comments" ON public.comments
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- 管理员：可更新/审核/回复
CREATE POLICY "Admins can update comments" ON public.comments
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- 管理员：可删除
CREATE POLICY "Admins can delete comments" ON public.comments
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));


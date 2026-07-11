-- 内容模型升级：让后台成为“素材库”，首页只读取摘要和主项目标记。

-- ============================================
-- 1. Projects: 首页摘要、主项目、复盘和外链
-- ============================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS reflection TEXT,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS github_url TEXT,
  ADD COLUMN IF NOT EXISTS demo_url TEXT,
  ADD COLUMN IF NOT EXISTS portfolio_url TEXT;

CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- ============================================
-- 2. Learning Records: 学习 / 训练营 / 志愿者经历
-- ============================================

CREATE TABLE IF NOT EXISTS learning_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('tool', 'bootcamp', 'volunteer', 'project', 'other')) DEFAULT 'other',
  time TEXT NOT NULL DEFAULT '',
  role TEXT,
  output TEXT,
  reflection TEXT,
  is_public BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_records_public ON learning_records(is_public);
CREATE INDEX IF NOT EXISTS idx_learning_records_sort ON learning_records(sort_order);

-- ============================================
-- 3. Insight Cards: AI 理解 / 方法论卡片
-- ============================================

CREATE TABLE IF NOT EXISTS insight_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_insight_cards_public ON insight_cards(is_public);
CREATE INDEX IF NOT EXISTS idx_insight_cards_sort ON insight_cards(sort_order);

-- ============================================
-- 4. Updated_at triggers
-- ============================================

DROP TRIGGER IF EXISTS update_learning_records_updated_at ON learning_records;
CREATE TRIGGER update_learning_records_updated_at BEFORE UPDATE ON learning_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_insight_cards_updated_at ON insight_cards;
CREATE TRIGGER update_insight_cards_updated_at BEFORE UPDATE ON insight_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. RLS: 公开读取，管理员登录后写入
-- ============================================

ALTER TABLE learning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE insight_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public learning records are viewable by everyone" ON learning_records;
DROP POLICY IF EXISTS "Authenticated users can manage learning records" ON learning_records;

CREATE POLICY "Public learning records are viewable by everyone" ON learning_records
  FOR SELECT USING (is_public = true);
CREATE POLICY "Authenticated users can manage learning records" ON learning_records
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public insight cards are viewable by everyone" ON insight_cards;
DROP POLICY IF EXISTS "Authenticated users can manage insight cards" ON insight_cards;

CREATE POLICY "Public insight cards are viewable by everyone" ON insight_cards
  FOR SELECT USING (is_public = true);
CREATE POLICY "Authenticated users can manage insight cards" ON insight_cards
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 收紧已有内容表的写入策略：前台可读公开内容，写入只允许登录后的管理员。
-- 如果你还没有完成 Supabase Auth 登录，请先不要在线上执行这一段。

DROP POLICY IF EXISTS "Anyone can update profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can update profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can insert profile" ON profiles;

CREATE POLICY "Authenticated users can update profile" ON profiles
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can insert profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can manage skills" ON skills;
DROP POLICY IF EXISTS "Authenticated users can manage skills" ON skills;
CREATE POLICY "Authenticated users can manage skills" ON skills
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can manage projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON projects;
CREATE POLICY "Authenticated users can manage projects" ON projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can manage education" ON education;
DROP POLICY IF EXISTS "Authenticated users can manage education" ON education;
CREATE POLICY "Authenticated users can manage education" ON education
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can manage portfolios" ON portfolios;
DROP POLICY IF EXISTS "Authenticated users can manage portfolios" ON portfolios;
CREATE POLICY "Authenticated users can manage portfolios" ON portfolios
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can manage comments" ON comments;
DROP POLICY IF EXISTS "Anyone can delete comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can moderate comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can delete comments" ON comments;

CREATE POLICY "Authenticated users can moderate comments" ON comments
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete comments" ON comments
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can view resume records" ON resume_records;
DROP POLICY IF EXISTS "Anyone can manage resume records" ON resume_records;
DROP POLICY IF EXISTS "Authenticated users can manage resume records" ON resume_records;

CREATE POLICY "Authenticated users can manage resume records" ON resume_records
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 动态个人主页 - 数据库初始化脚本
-- 执行方式：在Supabase控制台的SQL Editor中运行此脚本

-- ============================================
-- 核心表结构创建（渐进式迁移 - 阶段1）
-- ============================================

-- 1. profiles 表（个人信息）- 单用户场景，只存储一条记录
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  slogan TEXT NOT NULL DEFAULT '',
  avatar TEXT,
  email TEXT NOT NULL DEFAULT '',
  wechat TEXT NOT NULL DEFAULT '',
  phone TEXT,
  email_visibility TEXT CHECK (email_visibility IN ('public', 'semi', 'private')) DEFAULT 'semi',
  wechat_visibility TEXT CHECK (wechat_visibility IN ('public', 'semi', 'private')) DEFAULT 'semi',
  phone_visibility TEXT CHECK (phone_visibility IN ('public', 'semi', 'private')) DEFAULT 'private',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. skills 表（技能）
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  weight INTEGER CHECK (weight >= 0 AND weight <= 100) DEFAULT 50,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. projects 表（项目经历）
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  situation TEXT,
  task TEXT,
  action TEXT,
  result TEXT,
  images TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. education 表（教育背景）
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school TEXT NOT NULL,
  degree TEXT NOT NULL,
  major TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. portfolios 表（作品集链接）
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('github', 'behance', 'dribbble', 'website', 'other')) DEFAULT 'other',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. comments 表（留言）
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT,
  content TEXT NOT NULL CHECK (length(content) >= 5 AND length(content) <= 500),
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reply TEXT,
  reply_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. resume_records 表（简历生成记录）
CREATE TABLE IF NOT EXISTS resume_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jd TEXT NOT NULL,
  project_order TEXT[] DEFAULT '{}',
  custom_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 索引创建（提升查询性能）
-- ============================================

CREATE INDEX IF NOT EXISTS idx_projects_public ON projects(is_public);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_skills_weight ON skills(weight DESC);

-- ============================================
-- Row Level Security (RLS) 配置
-- ============================================

-- 启用RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_records ENABLE ROW LEVEL SECURITY;

-- RLS策略：单用户场景，无需认证
-- 所有数据公开可读，所有操作无需认证（因为前端已有localStorage认证）

-- Profile策略
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Anyone can update profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert profile" ON profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Anyone can update profile" ON profiles
  FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert profile" ON profiles
  FOR INSERT WITH CHECK (true);

-- Skills策略
DROP POLICY IF EXISTS "Public skills are viewable by everyone" ON skills;
DROP POLICY IF EXISTS "Anyone can manage skills" ON skills;

CREATE POLICY "Public skills are viewable by everyone" ON skills
  FOR SELECT USING (true);
CREATE POLICY "Anyone can manage skills" ON skills
  FOR ALL USING (true);

-- Projects策略
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Anyone can manage projects" ON projects;

CREATE POLICY "Public projects are viewable by everyone" ON projects
  FOR SELECT USING (is_public = true);
CREATE POLICY "Anyone can manage projects" ON projects
  FOR ALL USING (true);

-- Education策略
DROP POLICY IF EXISTS "Education is viewable by everyone" ON education;
DROP POLICY IF EXISTS "Anyone can manage education" ON education;

CREATE POLICY "Education is viewable by everyone" ON education
  FOR SELECT USING (true);
CREATE POLICY "Anyone can manage education" ON education
  FOR ALL USING (true);

-- Portfolios策略
DROP POLICY IF EXISTS "Portfolios are viewable by everyone" ON portfolios;
DROP POLICY IF EXISTS "Anyone can manage portfolios" ON portfolios;

CREATE POLICY "Portfolios are viewable by everyone" ON portfolios
  FOR SELECT USING (true);
CREATE POLICY "Anyone can manage portfolios" ON portfolios
  FOR ALL USING (true);

-- Comments策略
DROP POLICY IF EXISTS "Approved comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
DROP POLICY IF EXISTS "Anyone can manage comments" ON comments;
DROP POLICY IF EXISTS "Anyone can delete comments" ON comments;

CREATE POLICY "Approved comments are viewable by everyone" ON comments
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can manage comments" ON comments
  FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete comments" ON comments
  FOR DELETE USING (true);

-- Resume Records策略
DROP POLICY IF EXISTS "Anyone can view resume records" ON resume_records;
DROP POLICY IF EXISTS "Anyone can manage resume records" ON resume_records;

CREATE POLICY "Anyone can view resume records" ON resume_records
  FOR SELECT USING (true);
CREATE POLICY "Anyone can manage resume records" ON resume_records
  FOR ALL USING (true);

-- ============================================
-- 数据库函数和触发器
-- ============================================

-- 确保profiles表只有一条记录（单用户场景）
CREATE OR REPLACE FUNCTION enforce_single_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM profiles) >= 1 AND TG_OP = 'INSERT' THEN
    RAISE EXCEPTION 'Only one profile allowed. Please update the existing profile instead.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_single_profile ON profiles;
CREATE TRIGGER ensure_single_profile
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION enforce_single_profile();

-- 自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_education_updated_at ON education;
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolios_updated_at ON portfolios;
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 完成提示
-- ============================================

-- 执行成功！数据库表结构已创建。
-- 接下来请：
-- 1. 确认所有表已创建成功
-- 2. 返回前端项目配置 .env.local 文件
-- 3. 运行数据迁移工具导入现有数据

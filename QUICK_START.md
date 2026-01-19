# 🚀 快速开始 - Supabase数据库接入

## ⏱️ 5分钟完成配置

### 第1步：创建Supabase项目（2分钟）
1. 访问 https://supabase.com/dashboard
2. 点击"New Project"
3. 填写项目名称和密码
4. 选择区域（推荐：Tokyo或Singapore）
5. 等待项目创建完成

### 第2步：获取凭证（30秒）
1. 进入项目设置：⚙️ Settings → API
2. 复制两个值：
   - **Project URL**
   - **anon public key**

### 第3步：配置项目（30秒）
创建 `.env.local` 文件：
```bash
VITE_SUPABASE_URL=你的Project_URL
VITE_SUPABASE_ANON_KEY=你的anon_public_key
```

### 第4步：创建数据库表（1分钟）
1. 打开Supabase SQL Editor
2. 复制 `supabase/migrations/001_initial_schema.sql` 文件内容
3. 粘贴并点击"Run"执行

### 第5步：迁移数据（1分钟）
1. 重启开发服务器：`pnpm dev`
2. 访问管理后台：`http://localhost:5173/admin`
3. 点击"数据库迁移"标签
4. 点击"开始迁移到数据库"按钮
5. 等待迁移完成 ✅

## ✨ 完成！

现在你的数据已安全存储在云端，可以在任何设备访问！

详细指引请查看：[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

# Supabase 数据库配置指引

## 📋 概述

本指引将帮助你完成Supabase数据库的配置和数据迁移，实现从localStorage到云端数据库的升级。

---

## 🚀 Step 1: 创建Supabase项目

### 1.1 注册/登录Supabase
访问：https://supabase.com/dashboard

- 如果没有账号，点击"Start your project"注册
- 如果已有账号，直接登录

### 1.2 创建新项目
1. 点击"New Project"按钮
2. 填写项目信息：
   - **Name**: `portfolio-dynamic` (或任意名称)
   - **Database Password**: 设置一个强密码（请妥善保存！）
   - **Region**: 选择离你最近的区域（推荐 `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`）
3. 点击"Create new project"
4. 等待项目创建完成（约2分钟）

---

## 🔑 Step 2: 获取项目凭证

### 2.1 进入项目设置
1. 在项目主页，点击左侧菜单的 ⚙️ **Settings**
2. 选择 **API** 标签

### 2.2 复制凭证信息
找到以下两个值：

#### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

#### API Keys - anon public
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（一长串字符）
```

⚠️ **注意**：复制的是 `anon` `public` 密钥，不是 `service_role` `secret` 密钥！

---

## ⚙️ Step 3: 配置项目环境变量

### 3.1 创建环境变量文件
在项目根目录创建 `.env.local` 文件：

```bash
# 在项目根目录执行
touch .env.local
```

### 3.2 填写凭证
打开 `.env.local` 文件，粘贴以下内容：

```env
VITE_SUPABASE_URL=你的Project_URL
VITE_SUPABASE_ANON_KEY=你的anon_public_密钥
```

**示例**：
```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1ODMyMDAsImV4cCI6MjAwNTE1OTIwMH0.xxxxxxxxxxxxxxxxxxxxxx
```

### 3.3 重启开发服务器
```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
pnpm dev
```

---

## 🗄️ Step 4: 执行数据库迁移

### 4.1 打开SQL Editor
1. 在Supabase项目中，点击左侧菜单的 **SQL Editor**
2. 点击"New query"创建新查询

### 4.2 执行迁移脚本
1. 打开项目中的 `supabase/migrations/001_initial_schema.sql` 文件
2. 复制全部内容
3. 粘贴到Supabase SQL Editor中
4. 点击右下角的"Run"按钮执行

### 4.3 验证表创建
执行成功后，你会看到：
- ✅ Success: No rows returned

点击左侧的 📊 **Table Editor**，应该能看到以下表：
- `profiles`
- `skills`
- `projects`
- `education`
- `portfolios`
- `comments`
- `resume_records`

---

## 📦 Step 5: 迁移现有数据

### 5.1 访问管理后台
1. 启动开发服务器：`pnpm dev`
2. 访问：`http://localhost:5173/admin`
3. 使用管理员账号登录

### 5.2 一键迁移数据
1. 在管理后台页面，如果检测到本地有数据，会显示"数据迁移"横幅
2. 点击"开始迁移"按钮
3. 等待迁移完成（通常几秒钟）
4. 看到"迁移成功"提示后，刷新页面验证数据

### 5.3 验证数据（可选）
在Supabase Table Editor中查看各个表，确认数据已正确导入。

---

## ✅ Step 6: 完成验证

### 6.1 前台展示测试
访问：`http://localhost:5173`

验证以下内容是否正常显示：
- [ ] 个人信息（姓名、职业定位、Slogan）
- [ ] 技能云
- [ ] 项目列表
- [ ] 留言板（已批准的留言）

### 6.2 后台管理测试
访问：`http://localhost:5173/admin`

测试以下操作：
- [ ] 编辑个人信息
- [ ] 添加/编辑/删除技能
- [ ] 添加/编辑/删除项目
- [ ] 审核/回复/删除留言

### 6.3 数据持久化测试
1. 在管理后台修改一些数据
2. 完全关闭浏览器
3. 重新打开并访问网站
4. 确认修改的数据仍然存在 ✅

---

## 🎉 完成！

恭喜！你已成功将动态个人主页升级到云端数据库。

### 接下来你可以：

#### 📊 监控数据库使用
- 访问 Supabase Dashboard > **Database** > **Usage**
- 查看存储空间、请求次数等指标

#### 🔐 配置数据库备份（推荐）
- Supabase免费版自动每日备份（保留7天）
- 付费版可配置更长的备份周期

#### 🚀 部署到生产环境
1. 在部署平台（Vercel/Netlify）配置环境变量
2. 添加 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
3. 重新部署应用

---

## ❓ 常见问题

### Q1: 提示"数据库未配置"？
**A**: 检查 `.env.local` 文件是否正确创建，环境变量名称是否正确，是否重启了开发服务器。

### Q2: SQL执行失败？
**A**: 确认你复制了完整的SQL脚本，没有遗漏。如果失败，可以尝试分段执行。

### Q3: 数据迁移失败？
**A**: 
1. 确认数据库表已正确创建
2. 检查浏览器控制台的错误信息
3. 确认RLS策略已正确配置

### Q4: 留言无法显示？
**A**: 留言需要状态为`approved`才会在前台显示。在管理后台审核留言后即可。

### Q5: 如何回退到localStorage？
**A**: 
1. 删除或注释掉 `.env.local` 中的环境变量
2. 重启开发服务器
3. 系统会自动回退到localStorage模式

---

## 📞 获取帮助

如果遇到问题：
1. 查看浏览器开发者工具的Console面板
2. 查看Supabase Dashboard的Logs页面
3. 参考Supabase官方文档：https://supabase.com/docs

---

**祝你使用愉快！** 🎊

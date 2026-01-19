# 留言（comments）在 Supabase 的权限策略方案

你的前端使用的是 `anon` key（匿名访问）。在 Supabase 中，即使你写了 RLS Policy，如果没有正确的 GRANT 权限，依然会出现“插入失败”的情况。

本项目提供了一个可直接执行的脚本：`supabase/migrations/002_comments_rls_and_grants.sql`，用于修复和加固留言权限。

---

## 方案 0：最小修复（只解决“写不进去”）

适用于：你只想让访客能写入留言，不考虑后台审核的安全性（不推荐长期使用）。

核心点：
- `comments` 表启用 RLS
- 有 INSERT policy
- 有 `GRANT SELECT, INSERT` 给 `anon`

执行方式：
- 在 Supabase Dashboard → SQL Editor 执行 `supabase/migrations/002_comments_rls_and_grants.sql`

---

## 方案 1（推荐）：Supabase Auth 管理员 + RLS 管控

适用于：你希望“访客能留言，但只有管理员能审核/回复/删除”，并且不想搭后端服务。

### 1.1 执行权限脚本
- 在 SQL Editor 执行 `supabase/migrations/002_comments_rls_and_grants.sql`

脚本会做的事：
- 补齐 GRANT（anon/authenticated 对 comments 的 SELECT/INSERT）
- 创建 `public.admins` 表（保存管理员 user_id）
- 重建 policies：访客只能插入 pending / 只能读 approved；管理员可读写全部

### 1.2 创建管理员账号
- Supabase Dashboard → Authentication → Users
- 创建一个用户（邮箱/密码）

### 1.3 把该用户加入管理员表
拿到用户 id（UUID）后，在 SQL Editor 执行：

```sql
insert into public.admins (user_id) values ('你的-auth.users.id-uuid');
```

### 1.4 后台如何登录
需要让你的后台页面使用 Supabase Auth 登录后再进行审核操作（否则前端仍然用 anon key，RLS 会拦截“查看 pending/rejected、审核/删除/回复”）。

如果你希望我把“后台登录”从本地口令改为 Supabase Auth，并打通审核流程，我可以继续帮你改代码。

---

## 方案 2：Edge Function（后端托管）+ service_role（最接近你现在的本地口令模式）

适用于：你不想引入 Supabase Auth，但又想避免“任何人都能更新/删除留言”的安全问题。

思路：
- 访客留言：前端仍用 anon key 直接 `INSERT`（只允许 pending）
- 后台审核：前端调用 Edge Function（函数内部用 `service_role` 写库）
- Edge Function 用一个“后台口令/签名”做校验（例如 `x-admin-token`），避免接口被滥用

优点：
- 不需要给后台做 Supabase Auth
- 你依然保持“本地口令登录”的体验

关键注意：
- `service_role` 只能放在 Edge Function 的环境变量里，绝对不要放到前端 `.env` 或打包产物里

如果你选择这个方案，我可以继续补齐：
- Edge Function 代码（approve/reject/reply/delete）
- 前端后台改为调用这些函数


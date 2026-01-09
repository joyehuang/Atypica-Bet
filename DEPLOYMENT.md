# Vercel 部署指南

## 快速部署

### 方法一：通过 Vercel Dashboard（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "准备部署到 Vercel"
   git push origin main
   ```

2. **在 Vercel 中导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库
   - Vercel 会自动检测 Next.js 项目

3. **配置环境变量**
   在项目设置中添加以下环境变量：
   
   **必需的环境变量：**
   - `DATABASE_URL`: PostgreSQL 连接字符串
     ```
     postgresql://user:password@host:5432/database?sslmode=require
     ```
   - `DIRECT_URL`: 与 DATABASE_URL 相同（或单独的直连字符串）
   - `POLYMARKET_WALLET_ADDRESS`: 你的钱包地址
     ```
     0x78a588851d8d14ed59e75b8cb5a6a74eb01ed826
     ```
   
   **可选的环境变量：**
   - `PROXY_URL`: 如果需要代理访问 API
   - `GEMINI_API_KEY`: 用于 AI 分析功能

4. **配置构建设置**
   - Build Command: `prisma generate && next build`
   - Install Command: `pnpm install` (或 `npm install`)
   - Output Directory: `.next` (自动检测)

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成

### 方法二：通过 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **链接项目**
   ```bash
   vercel
   ```

4. **设置环境变量**
   ```bash
   vercel env add DATABASE_URL
   vercel env add DIRECT_URL
   vercel env add POLYMARKET_WALLET_ADDRESS
   ```

5. **部署到生产环境**
   ```bash
   vercel --prod
   ```

## 数据库设置

### 使用 Vercel Postgres（推荐）

1. 在 Vercel Dashboard 中，进入你的项目
2. 点击 "Storage" → "Create Database" → "Postgres"
3. 创建数据库后，Vercel 会自动添加 `POSTGRES_URL` 环境变量
4. 将 `POSTGRES_URL` 复制为 `DATABASE_URL` 和 `DIRECT_URL`

### 使用 Supabase

1. 在 [Supabase](https://supabase.com) 创建项目
2. 获取连接字符串（Settings → Database → Connection string）
3. 在 Vercel 环境变量中设置 `DATABASE_URL` 和 `DIRECT_URL`

### 使用其他 PostgreSQL 提供商

使用你的提供商提供的连接字符串，格式：
```
postgresql://user:password@host:5432/database?sslmode=require
```

## 数据库迁移

部署后，需要运行数据库迁移：

### 方法一：通过 Vercel CLI

```bash
vercel env pull .env.local
pnpm db:push
```

### 方法二：通过 Vercel Dashboard

1. 进入项目设置 → "Deployments"
2. 在最新的部署中，点击 "..." → "Redeploy"
3. 在构建日志中检查 Prisma 迁移是否成功

### 方法三：使用 Prisma Migrate Deploy（推荐用于生产环境）

在 `package.json` 中添加脚本：
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

然后在 Vercel 中设置 Build Command 为：`pnpm vercel-build`

## 环境变量检查清单

部署前确保以下环境变量已设置：

- [ ] `DATABASE_URL` - PostgreSQL 连接字符串
- [ ] `DIRECT_URL` - 直接连接字符串（通常与 DATABASE_URL 相同）
- [ ] `POLYMARKET_WALLET_ADDRESS` - 钱包地址
- [ ] `PROXY_URL` - （可选）代理 URL
- [ ] `GEMINI_API_KEY` - （可选）Gemini API 密钥

## 常见问题

### 构建失败：Prisma Client 未生成

**解决方案：**
确保 Build Command 包含 `prisma generate`：
```
prisma generate && next build
```

### 数据库连接失败

**解决方案：**
1. 检查 `DATABASE_URL` 格式是否正确
2. 确保数据库允许来自 Vercel IP 的连接
3. 检查 SSL 模式设置（通常需要 `?sslmode=require`）

### 环境变量未生效

**解决方案：**
1. 确保环境变量已添加到正确的环境（Production/Preview/Development）
2. 重新部署项目
3. 检查变量名是否正确（区分大小写）

### 本地构建失败（Windows）

如果在 Windows 上遇到文件权限错误，这是正常的。Vercel 在 Linux 环境中构建，不会有这个问题。

## 部署后验证

1. **检查首页**
   - 访问你的 Vercel 域名
   - 确认页面正常加载

2. **检查 API 路由**
   - `/api/markets` - 应该返回市场列表
   - `/api/polymarket/positions` - 测试 Polymarket API

3. **检查数据库连接**
   - 访问 Admin 页面：`/admin`
   - 尝试创建或导入市场

4. **检查 NFT 同步**
   - 在 Admin 页面点击 "同步 NFT 持仓"
   - 检查控制台日志

## 性能优化

### 启用 Edge Runtime（可选）

对于某些 API 路由，可以启用 Edge Runtime 以提高性能：

```typescript
export const runtime = 'edge';
```

### 数据库连接池

确保使用连接池 URL（Transaction Pooler），而不是直连 URL。

## 监控和日志

- Vercel Dashboard → "Deployments" → 查看构建日志
- Vercel Dashboard → "Functions" → 查看函数日志
- 使用 Vercel Analytics 监控性能

## 回滚部署

如果需要回滚到之前的版本：

1. 进入 Vercel Dashboard
2. 选择 "Deployments"
3. 找到要回滚的版本
4. 点击 "..." → "Promote to Production"


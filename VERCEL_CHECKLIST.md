# Vercel 部署检查清单

## 部署前检查

### 代码准备
- [x] 修复 Next.js 配置（`serverExternalPackages`）
- [x] 创建 `vercel.json` 配置文件
- [x] 创建 `.vercelignore` 文件
- [x] 更新 README.md 和 DEPLOYMENT.md
- [ ] 确保所有代码已提交到 Git
- [ ] 检查 `.gitignore` 确保敏感文件不会被提交

### 环境变量准备
- [ ] `DATABASE_URL` - PostgreSQL 连接字符串
- [ ] `DIRECT_URL` - 直接连接字符串（通常与 DATABASE_URL 相同）
- [ ] `POLYMARKET_WALLET_ADDRESS` - 钱包地址
- [ ] `PROXY_URL` - （可选）如果需要代理
- [ ] `GEMINI_API_KEY` - （可选）如果需要 AI 功能

### 数据库准备
- [ ] 创建 PostgreSQL 数据库（Vercel Postgres / Supabase / 其他）
- [ ] 获取连接字符串
- [ ] 测试数据库连接
- [ ] 准备运行数据库迁移

### Vercel 配置
- [ ] 在 Vercel Dashboard 中创建项目
- [ ] 连接 GitHub 仓库
- [ ] 设置环境变量
- [ ] 配置 Build Command: `prisma generate && next build`
- [ ] 配置 Install Command: `pnpm install`

## 部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "准备部署到 Vercel"
   git push origin main
   ```

2. **在 Vercel 中部署**
   - 访问 vercel.com
   - 导入 GitHub 仓库
   - 配置环境变量
   - 点击 Deploy

3. **运行数据库迁移**
   ```bash
   vercel env pull .env.local
   pnpm db:push
   ```

4. **验证部署**
   - 访问部署的 URL
   - 检查首页是否正常
   - 测试 API 路由
   - 测试 Admin 功能

## 部署后验证

- [ ] 首页正常加载
- [ ] API 路由正常工作 (`/api/markets`)
- [ ] Admin 页面可访问 (`/admin`)
- [ ] 数据库连接正常
- [ ] NFT 同步功能正常
- [ ] 没有控制台错误

## 注意事项

1. **本地构建失败（Windows）**：这是正常的文件权限问题，不影响 Vercel 部署
2. **数据库迁移**：部署后需要手动运行迁移或使用 `prisma migrate deploy`
3. **环境变量**：确保所有必需的环境变量都已设置
4. **Prisma Client**：构建命令必须包含 `prisma generate`

## 快速命令参考

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel

# 设置环境变量
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add POLYMARKET_WALLET_ADDRESS

# 部署到生产环境
vercel --prod

# 查看部署日志
vercel logs
```


# 数据库配置指南

## 前置要求

- 已创建 Supabase 项目
- 已获取数据库连接字符串

## 配置步骤

### 1. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
# Supabase 数据库连接
# Transaction Pooler (用于应用查询，端口 6543)
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-xx-x.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct Connection (用于数据库迁移，端口 5432)
DIRECT_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-xx-x.pooler.supabase.com:5432/postgres"

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

**获取连接字符串：**
1. 登录 Supabase Dashboard
2. 进入 **Settings** → **Database**
3. 在 **Connection string** 部分复制：
   - **Transaction** 模式（端口 6543）→ `DATABASE_URL`
   - **Direct connection** 模式（端口 5432）→ `DIRECT_URL`

### 2. 生成 Prisma Client

```bash
pnpm prisma generate
```

### 3. 创建数据库表

使用以下任一方式创建表：

**方式 A: 使用 Prisma Migrate（推荐）**
```bash
pnpm prisma migrate dev --name init
```

**方式 B: 使用 Prisma Push（快速原型）**
```bash
pnpm prisma db push
```

### 4. 验证配置

启动 Prisma Studio 查看数据库：

```bash
pnpm prisma studio
```

浏览器会自动打开 `http://localhost:5555`，你可以看到：
- `Market` 表
- `Option` 表

## 常用命令

```bash
# 生成 Prisma Client
pnpm db:generate

# 推送 schema 变更到数据库
pnpm db:push

# 创建新的迁移
pnpm db:migrate

# 打开 Prisma Studio
pnpm db:studio

# 重置数据库（删除所有数据）
pnpm db:reset
```

## 数据库结构

### Market 表
预测市场主表，包含：
- 基本信息：标题、描述、分类、状态
- 时间字段：关闭日期、解决日期
- AI 分析：Atypica 分析结果、准确度评分
- 统计数据：浏览量、分享数、资金池

### Option 表
预测选项表，包含：
- 选项文本
- 外部市场概率
- Atypica AI 预测概率
- 是否为获胜选项

## 在代码中使用

```typescript
import { prisma } from './lib/prisma';

// 查询所有活跃市场
const markets = await prisma.market.findMany({
  where: { status: 'ACTIVE' },
  include: { options: true },
});

// 创建新市场
const market = await prisma.market.create({
  data: {
    title: '市场标题',
    description: '市场描述',
    category: 'TECH',
    status: 'ACTIVE',
    closeDate: new Date('2026-12-31'),
    options: {
      create: [
        { text: 'Yes', externalProb: 0.6 },
        { text: 'No', externalProb: 0.4 },
      ],
    },
  },
});
```

## 故障排除

### 连接失败
- 检查 `.env` 文件中的连接字符串是否正确
- 确认密码是否正确（特殊字符需要 URL 编码）
- 检查 Supabase 项目是否处于活跃状态

### 迁移失败
- 确保使用 `DIRECT_URL`（端口 5432）进行迁移
- 检查数据库权限
- 尝试在 Supabase Dashboard 中暂停并恢复数据库

### 在 Supabase 中查看数据
1. 登录 Supabase Dashboard
2. 点击左侧 **Table Editor**
3. 选择 `Market` 或 `Option` 表查看数据

## 相关文件

- `prisma/schema.prisma` - 数据库模型定义
- `prisma.config.ts` - Prisma 配置文件
- `lib/prisma.ts` - Prisma Client 实例


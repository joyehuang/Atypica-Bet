# Vite + React 到 Next.js 迁移文档

## 迁移概述

本项目已从 Vite + React 框架成功迁移到 Next.js 14+。这次迁移保留了所有现有功能，同时提供了 Next.js 的优势，包括服务器端渲染、文件路由系统和优化的生产构建。

## 主要变更

### 1. 框架变更
- **之前**: Vite + React
- **现在**: Next.js 14+ (App Router)

### 2. 目录结构变更

```
之前:
├── components/
├── pages/
├── services/
├── lib/
├── styles/
├── scripts/
├── App.tsx
├── index.tsx
├── types.ts
├── constants.ts
└── vite.config.ts

现在:
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # 根布局
│   │   ├── page.tsx      # 主页路由
│   │   ├── providers.tsx # Context Providers
│   │   ├── globals.css   # 全局样式
│   │   ├── api/          # API 路由
│   │   │   └── markets/  # 市场 API
│   │   ├── market/[id]/  # 动态路由 - 市场详情
│   │   │   └── page.tsx
│   │   └── admin/        # 管理页面
│   │       ├── page.tsx  # 管理列表
│   │       └── create/
│   │           └── page.tsx  # 创建市场
│   ├── contexts/         # React Context (状态管理)
│   │   └── MarketContext.tsx
│   ├── components/       # React 组件
│   ├── pages/            # 页面组件 (客户端)
│   ├── services/         # API 服务
│   ├── lib/              # 工具库
│   ├── types.ts          # TypeScript 类型
│   └── constants.ts      # 常量定义
├── public/               # 静态资源
├── next.config.js        # Next.js 配置
├── tailwind.config.js    # Tailwind 配置
└── tsconfig.json         # TypeScript 配置
```

### 3. 路由系统

**之前 (Hash 路由)**:
- `#/` → 主页
- `#/market/:id` → 市场详情
- `#/admin` → 管理列表
- `#/admin/create` → 创建市场

**现在 (Next.js 文件路由)**:
- `/` → 主页
- `/market/[id]` → 市场详情
- `/admin` → 管理列表
- `/admin/create` → 创建市场

### 4. API 路由迁移

**之前**: Express.js 服务器 (`server/api.ts`)

**现在**: Next.js API Routes
- `src/app/api/markets/route.ts` - GET/POST 市场
- `src/app/api/markets/batch/route.ts` - 批量创建
- `src/app/api/markets/[id]/route.ts` - DELETE 市场
- `src/app/api/markets/[id]/resolve/route.ts` - 结算市场

### 5. 样式配置

**之前**:
- Tailwind CDN (在 index.html 中)
- 独立的 `styles/animation.css`

**现在**:
- 本地 Tailwind CSS 配置
- 全局样式整合到 `src/app/globals.css`
- 完整的 PostCSS 支持

### 6. 环境变量

保持不变，继续使用 `.env` 文件：
```env
GEMINI_API_KEY=your_api_key
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
```

## 运行命令变更

### 开发模式
**之前**: `npm run dev` (Vite)
**现在**: `npm run dev` (Next.js)

### 构建
**之前**: `npm run build` (Vite)
**现在**: `npm run build` (Next.js)

### 生产运行
**之前**: `npm run preview`
**现在**: `npm run start`

### 数据库命令
保持不变:
- `npm run db:generate` - 生成 Prisma Client
- `npm run db:push` - 推送 schema 到数据库
- `npm run db:studio` - 打开 Prisma Studio
- `npm run db:migrate` - 运行迁移
- `npm run db:reset` - 重置数据库

## Next.js App Router 架构模式

本项目采用了正确的 Next.js App Router 模式：

### 1. 文件路由系统
每个路由都有自己独立的 `page.tsx` 文件：
```
src/app/
├── page.tsx              # / - 主页
├── market/[id]/page.tsx  # /market/[id] - 市场详情
├── admin/page.tsx        # /admin - 管理列表
└── admin/create/page.tsx # /admin/create - 创建市场
```

### 2. 状态管理
使用 React Context 进行全局状态管理：
- `MarketContext` - 管理市场数据和操作
- 通过 `useMarkets()` hook 在组件中访问

### 3. 服务器组件 vs 客户端组件
- **服务器组件** (默认): `layout.tsx` - 提升性能
- **客户端组件** (`'use client'`): 所有 `page.tsx` 和需要交互的组件

### 4. Providers 模式
使用 `providers.tsx` 包装所有客户端 Context Providers：
```tsx
<Providers>
  <Layout>{children}</Layout>
</Providers>
```

## 新增功能

### 1. 服务器端渲染 (SSR)
Next.js 支持服务器端渲染，可以提升 SEO 和首次加载性能。

### 2. API 集成
API 路由现在与前端代码在同一个项目中，简化了部署。

### 3. 自动代码分割
Next.js 自动优化代码分割，提升加载速度。

### 4. 图片优化
可以使用 Next.js 的 `Image` 组件进行自动图片优化。

## 保留的功能

✅ 所有页面和组件功能
✅ Prisma ORM 集成
✅ Google Gemini AI 服务
✅ Polymarket API 集成
✅ 数据库操作
✅ 自定义样式和动画
✅ 响应式设计
✅ 鼠标跟随效果

## 开发注意事项

### 1. 客户端组件
使用客户端交互的组件需要添加 `'use client'` 指令：
```tsx
'use client';

import { useState } from 'react';
// ...
```

### 2. 导入路径
使用 `@/` 别名导入模块：
```tsx
import { PredictionMarket } from '@/types';
import { Layout } from '@/components/Layout';
```

### 3. 路由导航
使用 Next.js 的 `useRouter` 和 `Link` 组件：
```tsx
import { useRouter } from 'next/navigation';
import Link from 'next/link';
```

## 性能优化建议

1. **使用服务器组件**: 默认情况下使用服务器组件，只在需要交互时使用客户端组件
2. **图片优化**: 使用 `next/image` 组件替换 `<img>` 标签
3. **字体优化**: 使用 `next/font` 优化字体加载
4. **动态导入**: 使用 `next/dynamic` 进行代码分割

## 部署

Next.js 应用可以部署到多个平台：
- **Vercel** (推荐): 零配置部署
- **Netlify**: 支持 Next.js
- **自托管**: 使用 `npm run build && npm run start`
- **Docker**: 可以容器化部署

## 故障排除

### Prisma 客户端未生成
运行: `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npm run db:generate`

### 样式未加载
确保 `src/app/globals.css` 在 `layout.tsx` 中被导入

### API 路由 404
检查文件结构是否正确: `src/app/api/*/route.ts`

## 总结

迁移已完成！应用现在运行在 Next.js 上，提供了更好的性能和开发体验。所有原有功能都已保留，并且可以利用 Next.js 的现代特性进行进一步优化。

🚀 **开发服务器**: http://localhost:3000

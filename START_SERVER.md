# 启动服务器指南

## 安装依赖

首先安装新添加的依赖：

```bash
pnpm install
```

## 启动方式

### 方式 1: 同时启动前端和 API 服务器（推荐）

```bash
pnpm dev:all
```

这会同时启动：
- 前端开发服务器（端口 3000）
- API 服务器（端口 3001）

### 方式 2: 分别启动

**终端 1 - 启动前端：**
```bash
pnpm dev
```

**终端 2 - 启动 API 服务器：**
```bash
pnpm dev:api
```

## 验证

1. 前端应该运行在：http://localhost:3000
2. API 服务器应该运行在：http://localhost:3001
3. 访问 http://localhost:3000/#/admin/create 测试从 Polymarket 导入功能

## 从 Polymarket 导入数据流程

1. 访问管理后台创建页面
2. 切换到"从 Polymarket 导入"标签
3. 输入 Polymarket Event Slug 或 URL
4. 点击"获取"按钮
5. 选择要导入的市场
6. 点击"导入选中的市场"
7. 数据会自动保存到 Supabase 数据库

## 故障排除

### API 服务器无法启动
- 检查 `.env` 文件中的 `DATABASE_URL` 和 `DIRECT_URL` 是否正确配置
- 确保 Supabase 数据库连接正常

### 前端无法连接到 API
- 确保 API 服务器正在运行（端口 3001）
- 检查浏览器控制台是否有错误信息


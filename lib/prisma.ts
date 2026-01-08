import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 创建 PostgreSQL 连接池
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// 创建 Prisma PostgreSQL 适配器
const adapter = new PrismaPg(pool);

// 避免在开发环境中创建多个 Prisma Client 实例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 导出便捷的类型
export type { Market, Option } from '@prisma/client';

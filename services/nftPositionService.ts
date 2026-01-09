import { prisma } from '@/lib/prisma';
import { PolymarketPosition } from '@/types';

/**
 * 同步钱包持仓到数据库
 * 通过 eventSlug 或 slug 匹配到对应的 Market
 */
export async function syncPositionsToMarkets(
  positions: PolymarketPosition[]
): Promise<{ synced: number; failed: number }> {
  let synced = 0;
  let failed = 0;

  for (const position of positions) {
    try {
      // 计算当前价值：1 * percentRealizedPnl / 100
      const currentValue = 1 * (position.percentRealizedPnl / 100);
      const winValue = position.totalBought;

      // 匹配策略：
      // 1. 优先通过 title 精确匹配（最准确）
      // 2. 如果 title 不完全匹配，通过 eventSlug 匹配 externalSource
      const markets = await prisma.market.findMany({
        where: {
          OR: [
            {
              title: position.title, // 精确匹配 title
            },
            {
              title: {
                contains: position.title.split('?')[0].trim(), // 模糊匹配标题主要部分
              },
            },
            {
              externalSource: {
                contains: position.eventSlug,
              },
            },
          ],
        },
      });

      if (markets.length === 0) {
        console.warn(`未找到匹配的 Market: ${position.title} (eventSlug: ${position.eventSlug})`);
        failed++;
        continue;
      }

      // 更新第一个匹配的 Market（如果有多个，更新第一个）
      const market = markets[0];

      await prisma.market.update({
        where: { id: market.id },
        data: {
          nftPercentRealizedPnl: position.percentRealizedPnl,
          nftCurrentValue: currentValue,
          nftWinValue: winValue,
          nftLastSynced: new Date(),
        },
      });

      synced++;
      console.log(`已同步 NFT 持仓到 Market: ${market.id} (${market.title})`);
    } catch (error) {
      console.error(`同步持仓失败 (${position.title}):`, error);
      failed++;
    }
  }

  return { synced, failed };
}


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PredictionMarket, PredictionOption, PolymarketEventGroup } from '@/types';
import { convertEventGroupToMarkets } from '@/services/polymarketService';

interface BatchImportBody {
  eventGroup?: PolymarketEventGroup;
  selectedIds?: string[];
  markets?: PredictionMarket[];
}

// POST /api/markets/batch - 批量保存市场
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BatchImportBody;

    let markets: PredictionMarket[] | undefined = body.markets;

    // 兼容 Admin Polymarket 导入：通过 eventGroup + selectedIds 生成 markets
    if (!markets && body.eventGroup) {
      const selectedSet =
        body.selectedIds && body.selectedIds.length > 0
          ? new Set(body.selectedIds)
          : undefined;
      markets = convertEventGroupToMarkets(body.eventGroup, selectedSet);
    }

    if (!markets || markets.length === 0) {
      return NextResponse.json(
        { error: '缺少要保存的市场数据' },
        { status: 400 }
      );
    }

    const results: PredictionMarket[] = [];

    // 顺序插入，避免一次性打开过多连接导致超时
    for (const market of markets) {
      try {
        // 检查市场是否已存在
        const existingMarket = await prisma.market.findUnique({
          where: { id: market.id },
          include: { options: true },
        });

        let savedMarket;

        if (existingMarket) {
          // 市场已存在，先删除旧的 options
          await prisma.option.deleteMany({
            where: { marketId: market.id },
          });

          // 更新市场信息（保留已有的 atypica 相关字段，如果新数据没有提供）
          savedMarket = await prisma.market.update({
            where: { id: market.id },
            data: {
              title: market.title,
              description: market.description,
              category: market.category,
              status: market.status,
              closeDate: new Date(market.closeDate),
              resolveDate: market.resolveDate ? new Date(market.resolveDate) : null,
              // 保留已有的 atypica 相关字段（如果新数据没有提供）
              atypicaPickId: market.atypicaPickId ?? existingMarket.atypicaPickId ?? null,
              atypicaAnalysis: market.atypicaAnalysis ?? existingMarket.atypicaAnalysis ?? null,
              accuracyScore: market.accuracyScore ?? existingMarket.accuracyScore ?? null,
              externalSource: market.externalSource,
              externalData: market.externalSource
                ? {
                    source: market.externalSource,
                    originalId: market.id,
                  }
                : undefined,
              viewCount: market.viewCount,
              shareCount: market.shareCount,
              poolAmount: market.poolAmount,
              poolCurrency: market.poolCurrency || 'USD',
            },
            include: { options: true },
          });

          // 创建新的 options
          await prisma.option.createMany({
            data: market.options.map((option: PredictionOption) => ({
              id: option.id,
              marketId: market.id,
              text: option.text,
              externalProb: option.externalProb,
              atypicaProb: option.atypicaProb,
              isWinner: option.isWinner || false,
            })),
            skipDuplicates: true,
          });

          // 重新获取包含 options 的市场数据
          const marketWithOptions = await prisma.market.findUnique({
            where: { id: market.id },
            include: { options: true },
          });
          
          if (!marketWithOptions) {
            throw new Error(`无法重新获取市场数据: ${market.id}`);
          }
          
          savedMarket = marketWithOptions;
        } else {
          // 市场不存在，创建新市场
          savedMarket = await prisma.market.create({
            data: {
              id: market.id,
              title: market.title,
              description: market.description,
              category: market.category,
              status: market.status,
              closeDate: new Date(market.closeDate),
              resolveDate: market.resolveDate ? new Date(market.resolveDate) : null,
              atypicaPickId: market.atypicaPickId,
              atypicaAnalysis: market.atypicaAnalysis,
              accuracyScore: market.accuracyScore,
              externalSource: market.externalSource,
              externalData: market.externalSource
                ? {
                    source: market.externalSource,
                    originalId: market.id,
                  }
                : undefined,
              viewCount: market.viewCount,
              shareCount: market.shareCount,
              poolAmount: market.poolAmount,
              poolCurrency: market.poolCurrency || 'USD',
              options: {
                create: market.options.map((option: PredictionOption) => ({
                  id: option.id,
                  text: option.text,
                  externalProb: option.externalProb,
                  atypicaProb: option.atypicaProb,
                  isWinner: option.isWinner || false,
                })),
              },
            },
            include: { options: true },
          });
        }

        if (!savedMarket) {
          console.error(`保存市场失败: ${market.id}`);
          continue;
        }

        results.push({
          id: savedMarket.id,
          title: savedMarket.title,
          description: savedMarket.description,
          category: savedMarket.category as any,
          createdAt: savedMarket.createdAt.toISOString(),
          updatedAt: savedMarket.updatedAt.toISOString(),
          closeDate: savedMarket.closeDate.toISOString(),
          resolveDate: savedMarket.resolveDate?.toISOString(),
          status: savedMarket.status as any,
          options: savedMarket.options.map((option: { id: string; text: string; externalProb: number | null; atypicaProb: number | null; isWinner: boolean }) => ({
            id: option.id,
            text: option.text,
            externalProb: option.externalProb ?? undefined,
            atypicaProb: option.atypicaProb ?? undefined,
            isWinner: option.isWinner,
          })),
          atypicaPickId: savedMarket.atypicaPickId ?? undefined,
          atypicaAnalysis: savedMarket.atypicaAnalysis ?? undefined,
          accuracyScore: savedMarket.accuracyScore ?? undefined,
          externalSource: savedMarket.externalSource ?? undefined,
          shareCount: savedMarket.shareCount,
          viewCount: savedMarket.viewCount,
          poolAmount: savedMarket.poolAmount ?? undefined,
          poolCurrency: savedMarket.poolCurrency ?? undefined,
          nftPercentRealizedPnl: savedMarket.nftPercentRealizedPnl ?? undefined,
          nftCurrentValue: savedMarket.nftCurrentValue ?? undefined,
          nftWinValue: savedMarket.nftWinValue ?? undefined,
          nftLastSynced: savedMarket.nftLastSynced?.toISOString(),
        });
      } catch (error) {
        // 单个市场失败不影响其他市场
        console.log('=== 单个市场错误详情 ===');
        console.log('Market ID:', market.id);
        console.log('Full error:', JSON.stringify(error, null, 2));
        console.log('Error meta:', JSON.stringify((error as any).meta, null, 2));
        console.log('Error code:', (error as any).code);
        console.log('Error message:', (error as any).message);
        
        // 尝试从 meta 中提取列名信息
        const meta = (error as any).meta;
        if (meta) {
          console.log('Meta target:', meta.target);
          console.log('Meta column:', meta.column);
          console.log('Meta table:', meta.table);
        }
        
        console.error(`保存市场 ${market.id} 失败:`, error);
        // 继续处理下一个市场
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.log('=== 批量操作错误详情 ===');
    console.log('Full error:', JSON.stringify(error, null, 2));
    console.log('Error meta:', JSON.stringify((error as any).meta, null, 2));
    console.log('Error code:', (error as any).code);
    console.log('Error message:', (error as any).message);
    
    // 尝试从 meta 中提取列名信息
    const meta = (error as any).meta;
    if (meta) {
      console.log('Meta target:', meta.target);
      console.log('Meta column:', meta.column);
      console.log('Meta table:', meta.table);
    }
    
    console.error('批量保存市场失败:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '批量保存市场失败',
        details: process.env.NODE_ENV === 'development' ? {
          code: (error as any).code,
          meta: (error as any).meta,
        } : undefined,
      },
      { status: 500 }
    );
  }
}

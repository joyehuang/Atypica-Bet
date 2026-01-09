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
      const savedMarket = await prisma.market.create({
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
            : null,
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
        include: {
          options: true,
        },
      });

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
        options: savedMarket.options.map((option) => ({
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
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('批量保存市场失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '批量保存市场失败' },
      { status: 500 }
    );
  }
}

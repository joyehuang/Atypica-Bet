import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PredictionMarket, PredictionOption } from '@/types';

// GET - 获取所有市场
export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      include: {
        options: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const results: PredictionMarket[] = markets.map(market => ({
      id: market.id,
      title: market.title,
      description: market.description,
      category: market.category as any,
      createdAt: market.createdAt.toISOString(),
      updatedAt: market.updatedAt.toISOString(),
      closeDate: market.closeDate.toISOString(),
      resolveDate: market.resolveDate?.toISOString(),
      status: market.status as any,
      options: market.options.map(option => ({
        id: option.id,
        text: option.text,
        externalProb: option.externalProb ?? undefined,
        atypicaProb: option.atypicaProb ?? undefined,
        isWinner: option.isWinner,
      })),
      atypicaPickId: market.atypicaPickId ?? undefined,
      atypicaAnalysis: market.atypicaAnalysis ?? undefined,
      accuracyScore: market.accuracyScore ?? undefined,
      externalSource: market.externalSource ?? undefined,
      shareCount: market.shareCount,
      viewCount: market.viewCount,
      poolAmount: market.poolAmount ?? undefined,
      poolCurrency: market.poolCurrency ?? undefined,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('获取市场失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取市场失败' },
      { status: 500 }
    );
  }
}

// POST - 保存单个市场
export async function POST(request: NextRequest) {
  try {
    const market: PredictionMarket = await request.json();

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
        externalData: market.externalSource ? {
          source: market.externalSource,
          originalId: market.id,
        } : null,
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

    const result: PredictionMarket = {
      id: savedMarket.id,
      title: savedMarket.title,
      description: savedMarket.description,
      category: savedMarket.category as any,
      createdAt: savedMarket.createdAt.toISOString(),
      updatedAt: savedMarket.updatedAt.toISOString(),
      closeDate: savedMarket.closeDate.toISOString(),
      resolveDate: savedMarket.resolveDate?.toISOString(),
      status: savedMarket.status as any,
      options: savedMarket.options.map(option => ({
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
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('保存市场失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '保存市场失败' },
      { status: 500 }
    );
  }
}

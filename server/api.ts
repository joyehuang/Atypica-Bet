import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { prisma } from '../lib/prisma';
import { PredictionMarket, PredictionOption } from '../types';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 保存单个市场
app.post('/api/markets', async (req, res) => {
  try {
    const market: PredictionMarket = req.body;

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

    // 转换为 PredictionMarket 格式返回
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

    res.json(result);
  } catch (error) {
    console.error('保存市场失败:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : '保存市场失败',
    });
  }
});

// 批量保存市场
app.post('/api/markets/batch', async (req, res) => {
  try {
    const { markets }: { markets: PredictionMarket[] } = req.body;

    const results = await Promise.all(
      markets.map(async (market) => {
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

        return {
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
      })
    );

    res.json(results);
  } catch (error) {
    console.error('批量保存市场失败:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : '批量保存市场失败',
    });
  }
});

// 获取所有市场
app.get('/api/markets', async (req, res) => {
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

    res.json(results);
  } catch (error) {
    console.error('获取市场失败:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : '获取市场失败',
    });
  }
});

// 删除市场
app.delete('/api/markets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.market.delete({
      where: { id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('删除市场失败:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : '删除市场失败',
    });
  }
});

// 结算市场
app.post('/api/markets/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { winnerOptionId } = req.body;

    const market = await prisma.market.findUnique({
      where: { id },
      include: { options: true },
    });

    if (!market) {
      return res.status(404).json({ error: '市场不存在' });
    }

    const isAtypicaCorrect = market.atypicaPickId === winnerOptionId;
    const newStatus = isAtypicaCorrect ? 'SUCCESSFUL' : 'FAILED';

    await prisma.market.update({
      where: { id },
      data: {
        status: newStatus,
        resolveDate: new Date(),
        options: {
          updateMany: [
            {
              where: { id: winnerOptionId },
              data: { isWinner: true },
            },
            {
              where: { id: { not: winnerOptionId } },
              data: { isWinner: false },
            },
          ],
        },
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('结算市场失败:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : '结算市场失败',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API 服务器运行在 http://localhost:${PORT}`);
});


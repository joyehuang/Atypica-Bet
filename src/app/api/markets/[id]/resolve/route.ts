import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - 结算市场
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { winnerOptionId } = await request.json();

    const market = await prisma.market.findUnique({
      where: { id: params.id },
      include: { options: true },
    });

    if (!market) {
      return NextResponse.json(
        { error: '市场不存在' },
        { status: 404 }
      );
    }

    const isAtypicaCorrect = market.atypicaPickId === winnerOptionId;
    const newStatus = isAtypicaCorrect ? 'SUCCESSFUL' : 'FAILED';

    await prisma.market.update({
      where: { id: params.id },
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('结算市场失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '结算市场失败' },
      { status: 500 }
    );
  }
}

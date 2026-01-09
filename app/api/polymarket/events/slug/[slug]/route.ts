import { NextRequest, NextResponse } from 'next/server';
import { fetchMarketBySlug } from '@/lib/polymarket';

// GET /api/polymarket/events/slug/[slug] - Polymarket API 代理
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { error: '缺少 slug 参数' },
        { status: 400 }
      );
    }

    const eventGroup = await fetchMarketBySlug(slug);

    return NextResponse.json(eventGroup);
  } catch (error) {
    console.error('Polymarket API 调用失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取市场数据失败' },
      { status: 500 }
    );
  }
}

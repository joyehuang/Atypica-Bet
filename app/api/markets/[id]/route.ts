import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/markets/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.market.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除市场失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '删除市场失败' },
      { status: 500 }
    );
  }
}

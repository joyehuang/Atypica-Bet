import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE - 删除市场
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.market.delete({
      where: { id: params.id },
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

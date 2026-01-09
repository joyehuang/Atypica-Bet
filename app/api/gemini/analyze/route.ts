import { NextRequest, NextResponse } from 'next/server';
import { generatePredictionAnalysis, parseAnalysis } from '@/lib/gemini';

// POST /api/gemini/analyze - AI 分析生成（服务端）
export async function POST(request: NextRequest) {
  try {
    const { title, description, options } = await request.json();

    if (!title || !description || !options || !Array.isArray(options)) {
      return NextResponse.json(
        { error: '缺少必需参数' },
        { status: 400 }
      );
    }

    const analysisText = await generatePredictionAnalysis(title, description, options);

    if (!analysisText) {
      return NextResponse.json(
        { error: 'AI 分析生成失败' },
        { status: 500 }
      );
    }

    const parsed = parseAnalysis(analysisText);

    return NextResponse.json({
      success: true,
      analysis: parsed,
      rawText: analysisText,
    });
  } catch (error) {
    console.error('Gemini API 调用失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI 分析失败' },
      { status: 500 }
    );
  }
}

/**
 * 测试路由：逐个字段测试，找出问题字段
 * GET /api/markets/test-fields
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const results: any = {
    workingFields: [],
    failedFields: [],
    errors: [],
  };

  // 所有可能的字段列表
  const allFields = [
    'title',
    'description',
    'category',
    'status',
    'closeDate',
    'resolveDate',
    'createdAt',
    'updatedAt',
    'atypicaPickId',
    'atypicaAnalysis',
    'accuracyScore',
    'externalSource',
    'externalData',
    'viewCount',
    'shareCount',
    'poolAmount',
    'poolCurrency',
    'nftPercentRealizedPnl',
    'nftCurrentValue',
    'nftWinValue',
    'nftLastSynced',
  ];

  console.log('=== 开始逐个字段测试 ===\n');

  // 逐步添加字段测试
  for (let i = 0; i < allFields.length; i++) {
    const currentFields = allFields.slice(0, i + 1);
    const selectObj: any = { id: true };
    
    for (const field of currentFields) {
      selectObj[field] = true;
    }

    try {
      console.log(`测试 ${i + 1}/${allFields.length}: [${currentFields.join(', ')}]`);
      await prisma.market.findFirst({
        select: selectObj,
      });
      console.log(`✓ 成功\n`);
      results.workingFields.push(currentFields[currentFields.length - 1]);
    } catch (error: any) {
      const failedField = currentFields[currentFields.length - 1];
      console.error(`✗ 失败 - 问题字段: ${failedField}`);
      console.error(`  错误: ${error.message}`);
      console.error(`  代码: ${error.code}`);
      
      const errorInfo = {
        field: failedField,
        message: error.message,
        code: error.code,
        meta: error.meta,
        column: error.meta?.column,
      };
      
      results.failedFields.push(failedField);
      results.errors.push(errorInfo);
      
      console.error(`  ❌ 数据库缺失的列: ${error.meta?.column || failedField}\n`);
      break; // 找到第一个失败的字段就停止
    }
  }

  console.log('\n=== 测试结果汇总 ===');
  console.log(`✓ 正常字段 (${results.workingFields.length}):`, results.workingFields.join(', '));
  console.log(`✗ 问题字段 (${results.failedFields.length}):`, results.failedFields.join(', '));

  return NextResponse.json({
    success: true,
    summary: {
      totalFields: allFields.length,
      workingCount: results.workingFields.length,
      failedCount: results.failedFields.length,
    },
    workingFields: results.workingFields,
    failedFields: results.failedFields,
    errors: results.errors,
    firstProblemField: results.failedFields[0] || null,
  });
}


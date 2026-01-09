import { NextRequest, NextResponse } from 'next/server';
import { PolymarketPosition } from '@/types';

// GET /api/polymarket/positions - 获取钱包持仓
export async function GET(request: NextRequest) {
  try {

    async function setProxy() {
      if (process.env.PROXY_URL) {  // If you are in China, you must use this proxy:
        const { setGlobalDispatcher, ProxyAgent } = await import("undici");
        const proxyAgent = new ProxyAgent(process.env.PROXY_URL);
        setGlobalDispatcher(proxyAgent);
      }
    }


    const walletAddress = process.env.POLYMARKET_WALLET_ADDRESS;
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: '钱包地址未配置，请在环境变量中设置 POLYMARKET_WALLET_ADDRESS' },
        { status: 500 }
      );
    }

    const apiUrl = `https://data-api.polymarket.com/positions?user=${walletAddress}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Polymarket API 请求失败: ${response.status} ${response.statusText}`);
    }

    const positions: PolymarketPosition[] = await response.json();

    return NextResponse.json(positions);
  } catch (error) {
    console.error('获取钱包持仓失败:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '获取钱包持仓失败',
      },
      { status: 500 }
    );
  }
}


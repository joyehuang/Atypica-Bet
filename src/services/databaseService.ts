import { PredictionMarket } from '../types';

/**
 * API 客户端：保存市场到数据库
 */
export async function saveMarketToDatabase(market: PredictionMarket): Promise<PredictionMarket> {
  try {
    const response = await fetch('/api/markets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(market),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `保存失败: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('保存市场到数据库失败:', error);
    throw new Error(
      error instanceof Error
        ? `数据库保存失败: ${error.message}`
        : '数据库保存失败'
    );
  }
}

/**
 * API 客户端：批量保存市场到数据库
 */
export async function saveMarketsToDatabase(markets: PredictionMarket[]): Promise<PredictionMarket[]> {
  try {
    const response = await fetch('/api/markets/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ markets }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `批量保存失败: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('批量保存市场到数据库失败:', error);
    throw error;
  }
}

/**
 * API 客户端：从数据库获取所有市场
 */
export async function getMarketsFromDatabase(): Promise<PredictionMarket[]> {
  try {
    const response = await fetch('/api/markets', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `获取失败: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('从数据库获取市场失败:', error);
    throw new Error(
      error instanceof Error
        ? `数据库查询失败: ${error.message}`
        : '数据库查询失败'
    );
  }
}

/**
 * API 客户端：从数据库删除市场
 */
export async function deleteMarketFromDatabase(marketId: string): Promise<void> {
  try {
    const response = await fetch(`/api/markets/${marketId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `删除失败: ${response.status}`);
    }
  } catch (error) {
    console.error('从数据库删除市场失败:', error);
    throw new Error(
      error instanceof Error
        ? `数据库删除失败: ${error.message}`
        : '数据库删除失败'
    );
  }
}

/**
 * API 客户端：更新市场状态（结算）
 */
export async function resolveMarketInDatabase(
  marketId: string,
  winnerOptionId: string
): Promise<void> {
  try {
    const response = await fetch(`/api/markets/${marketId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ winnerOptionId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `结算失败: ${response.status}`);
    }
  } catch (error) {
    console.error('更新市场状态失败:', error);
    throw new Error(
      error instanceof Error
        ? `数据库更新失败: ${error.message}`
        : '数据库更新失败'
    );
  }
}


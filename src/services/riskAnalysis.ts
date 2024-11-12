export interface RiskMetrics {
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export function calculateRiskMetrics(prices: number[]): RiskMetrics {
  // Calculate daily returns
  const returns = prices.slice(1).map((price, i) => 
    (price - prices[i]) / prices[i]
  );

  // Calculate annualized volatility
  const volatility = Math.sqrt(
    returns.reduce((sum, ret) => sum + ret * ret, 0) / returns.length
  ) * Math.sqrt(252);

  // Calculate Sharpe ratio (assuming risk-free rate of 2%)
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const riskFreeRate = 0.02;
  const sharpeRatio = ((avgReturn * 252) - riskFreeRate) / volatility;

  // Calculate maximum drawdown
  const maxDrawdown = Math.min(
    ...returns.map((_, i) => 
      1 - prices[i] / Math.max(...prices.slice(0, i + 1))
    )
  );

  return {
    volatility,
    sharpeRatio,
    maxDrawdown
  };
}
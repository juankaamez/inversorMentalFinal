import type { StockData, InvestorProfile, PortfolioRecommendation } from '../types';

function calculatePortfolioMetrics(stocks: StockData[], weights: number[]) {
  const totalRisk = stocks.reduce((sum, stock, i) => sum + stock.beta * weights[i], 0);
  const expectedReturn = stocks.reduce((sum, stock, i) => {
    const annualReturn = (stock.changePercent / 100) + (stock.dividend / 100);
    return sum + annualReturn * weights[i];
  }, 0);

  return { totalRisk, expectedReturn };
}

export function optimizePortfolio(
  stocks: StockData[],
  profile: InvestorProfile
): PortfolioRecommendation {
  // Adjust weights based on risk tolerance
  const riskMultipliers = {
    conservador: 0.7,
    moderado: 1.0,
    agresivo: 1.3
  };

  // Calculate initial weights
  const baseWeights = new Array(stocks.length).fill(1 / stocks.length);
  
  // Adjust weights based on risk tolerance and beta
  const adjustedWeights = baseWeights.map((weight, i) => {
    const riskAdjustment = (stocks[i].beta - 1) * riskMultipliers[profile.riskTolerance];
    return weight * (1 + riskAdjustment);
  });

  // Normalize weights
  const totalWeight = adjustedWeights.reduce((a, b) => a + b, 0);
  const finalWeights = adjustedWeights.map(w => w / totalWeight);

  // Calculate portfolio metrics
  const { totalRisk, expectedReturn } = calculatePortfolioMetrics(stocks, finalWeights);

  // Calculate sector distribution
  const sectorDistribution = stocks.reduce((acc, stock, i) => {
    const sector = stock.sector;
    const existing = acc.find(s => s.sector === sector);
    if (existing) {
      existing.percentage += finalWeights[i] * 100;
    } else {
      acc.push({ sector, percentage: finalWeights[i] * 100 });
    }
    return acc;
  }, [] as { sector: string; percentage: number }[]);

  // Calculate monthly dividend estimate
  const monthlyDividendEstimate = stocks.reduce((total, stock, i) => {
    const allocation = profile.initialInvestment * finalWeights[i];
    return total + (allocation * (stock.dividend / 100) / 12);
  }, 0);

  return {
    stocks: stocks.map((stock, i) => ({
      symbol: stock.symbol,
      name: stock.name,
      percentage: finalWeights[i] * 100,
      sector: stock.sector
    })),
    expectedReturn: expectedReturn * 100,
    riskLevel: profile.riskTolerance,
    sectorDistribution,
    totalInvestment: profile.initialInvestment,
    currency: 'EUR',
    monthlyDividendEstimate,
    riskMetrics: {
      volatility: totalRisk,
      sharpeRatio: expectedReturn / totalRisk,
      maxDrawdown: totalRisk * -0.5 // Simplified estimation
    }
  };
}
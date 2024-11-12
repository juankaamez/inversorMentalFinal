import * as tf from '@tensorflow/tfjs';
import { Matrix } from 'ml-matrix';
import type { StockData, InvestorProfile } from '../types';

interface MarketCondition {
  trend: 'bullish' | 'bearish' | 'neutral';
  volatility: 'high' | 'low' | 'medium';
  sentiment: number; // -1 to 1
}

export class AIInvestmentAdvisor {
  private model: tf.LayersModel | null = null;

  async initialize() {
    // Simple neural network for investment recommendations
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [7], units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 3, activation: 'softmax' })
      ]
    });

    await this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async getRecommendation(
    stock: StockData,
    profile: InvestorProfile,
    marketCondition: MarketCondition
  ): Promise<{
    action: 'buy' | 'sell' | 'hold';
    confidence: number;
    reasoning: string[];
  }> {
    const input = tf.tensor2d([[
      stock.beta,
      stock.peRatio / 30, // Normalized P/E
      stock.dividend / 5, // Normalized dividend yield
      stock.changePercent / 100,
      profile.riskTolerance === 'agresivo' ? 1 : profile.riskTolerance === 'moderado' ? 0.5 : 0,
      marketCondition.sentiment,
      profile.timeHorizon / 10
    ]]);

    const prediction = await this.model.predict(input) as tf.Tensor;
    const [sellProb, holdProb, buyProb] = Array.from(await prediction.data());

    // Portfolio optimization using Markowitz model
    const returns = new Matrix([[stock.changePercent]]);
    const covariance = new Matrix([[stock.beta]]);
    const riskAversion = profile.riskTolerance === 'conservador' ? 0.8 : 
                        profile.riskTolerance === 'moderado' ? 0.5 : 0.2;

    const optimalWeight = returns.mul(1 / (riskAversion * covariance.get(0, 0)));

    const reasoning: string[] = [];
    
    // Technical Analysis
    if (stock.price > stock.high52Week * 0.9) {
      reasoning.push("El precio está cerca de máximos históricos");
    }
    if (stock.peRatio > 30) {
      reasoning.push("P/E ratio elevado indica posible sobrevaloración");
    }
    if (stock.dividend > 3) {
      reasoning.push("Dividendo atractivo para inversión a largo plazo");
    }

    // Market Conditions
    if (marketCondition.trend === 'bullish') {
      reasoning.push("Tendencia alcista del mercado favorable");
    }
    if (marketCondition.volatility === 'high') {
      reasoning.push("Alta volatilidad sugiere precaución");
    }

    // Risk Profile Alignment
    if (stock.beta > 1.5 && profile.riskTolerance === 'conservador') {
      reasoning.push("Beta elevada no alineada con perfil conservador");
    }

    const maxProb = Math.max(sellProb, holdProb, buyProb);
    const action = maxProb === sellProb ? 'sell' : maxProb === holdProb ? 'hold' : 'buy';

    return {
      action,
      confidence: maxProb,
      reasoning
    };
  }

  analyzeMarketConditions(stocks: StockData[]): MarketCondition {
    const avgChange = stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length;
    const volatility = Math.sqrt(
      stocks.reduce((sum, stock) => sum + Math.pow(stock.changePercent - avgChange, 2), 0) / stocks.length
    );

    return {
      trend: avgChange > 1 ? 'bullish' : avgChange < -1 ? 'bearish' : 'neutral',
      volatility: volatility > 2 ? 'high' : volatility < 1 ? 'low' : 'medium',
      sentiment: Math.tanh(avgChange / 2) // Normalize to [-1, 1]
    };
  }
}
import React, { useEffect, useState } from 'react';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { AIInvestmentAdvisor } from '../services/aiRecommendation';
import type { StockData, InvestorProfile } from '../types';

interface AIRecommendation {
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string[];
}

export default function AIRecommendations({ 
  stocks, 
  profile 
}: { 
  stocks: StockData[];
  profile: InvestorProfile;
}) {
  const [recommendations, setRecommendations] = useState<Map<string, AIRecommendation>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const advisor = new AIInvestmentAdvisor();
    
    const analyzeStocks = async () => {
      await advisor.initialize();
      const marketCondition = advisor.analyzeMarketConditions(stocks);
      
      const recommendationsMap = new Map();
      for (const stock of stocks) {
        const recommendation = await advisor.getRecommendation(stock, profile, marketCondition);
        recommendationsMap.set(stock.symbol, recommendation);
      }
      
      setRecommendations(recommendationsMap);
      setLoading(false);
    };

    analyzeStocks();
  }, [stocks, profile]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Análisis IA en Progreso</h2>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Recomendaciones IA</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from(recommendations.entries()).map(([symbol, rec]) => (
          <div 
            key={symbol}
            className={`p-4 rounded-lg border-2 ${
              rec.action === 'buy' 
                ? 'border-green-500 bg-green-50'
                : rec.action === 'sell'
                ? 'border-red-500 bg-red-50'
                : 'border-yellow-500 bg-yellow-50'
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">{symbol}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                rec.action === 'buy'
                  ? 'bg-green-200 text-green-800'
                  : rec.action === 'sell'
                  ? 'bg-red-200 text-red-800'
                  : 'bg-yellow-200 text-yellow-800'
              }`}>
                {rec.action.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>Confianza: {(rec.confidence * 100).toFixed(1)}%</span>
              </div>

              <div className="mt-3">
                <h4 className="font-medium mb-2">Análisis:</h4>
                <ul className="space-y-1">
                  {rec.reasoning.map((reason, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
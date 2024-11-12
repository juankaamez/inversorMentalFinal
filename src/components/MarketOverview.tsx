import React from 'react';
import { TrendingUp, TrendingDown, BarChart, DollarSign, Percent } from 'lucide-react';
import type { StockData } from '../types';

export default function MarketOverview({ stocks }: { stocks: StockData[] }) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    return num.toLocaleString('es-ES');
  };

  if (!stocks || stocks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <BarChart className="mr-2" /> Resumen del Mercado S&P 500
        </h2>
        <p className="text-gray-600">Cargando datos del mercado...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <BarChart className="mr-2" /> Resumen del Mercado S&P 500
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-bold text-lg">{stock.symbol}</span>
                <span className="text-sm text-gray-500 ml-2">
                  P/E: {(stock.peRatio || 0).toFixed(2)}
                </span>
              </div>
              <span
                className={`flex items-center ${
                  (stock.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {(stock.change || 0) >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {(stock.changePercent || 0).toFixed(2)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2">
                  <span className="text-2xl font-semibold">
                    ${(stock.price || 0).toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Cap. Mercado: {formatNumber(stock.marketCap || 0)}
                  </div>
                  <div className="flex items-center">
                    <Percent className="w-4 h-4 mr-1" />
                    Dividendo: {(stock.dividend || 0).toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <div>52s Máx: ${(stock.high52Week || 0).toFixed(2)}</div>
                <div>52s Mín: ${(stock.low52Week || 0).toFixed(2)}</div>
                <div>Beta: {(stock.beta || 0).toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
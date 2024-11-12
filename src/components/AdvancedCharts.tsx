import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter
} from 'recharts';
import type { StockData } from '../types';

interface ChartData {
  name: string;
  price: number;
  volume: number;
  marketCap: number;
  volatility: number;
}

export function PortfolioPerformanceChart({ stocks }: { stocks: StockData[] }) {
  const data: ChartData[] = stocks.map(stock => ({
    name: stock.symbol,
    price: stock.price,
    volume: stock.volume,
    marketCap: stock.marketCap / 1e9, // Convert to billions
    volatility: stock.beta
  }));

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="volume" fill="#8884d8" name="Volumen" />
          <Area yAxisId="left" dataKey="marketCap" fill="#82ca9d" name="Cap. Mercado (B)" />
          <Line yAxisId="right" type="monotone" dataKey="price" stroke="#ff7300" name="Precio" />
          <Scatter yAxisId="right" dataKey="volatility" fill="red" name="Volatilidad" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskReturnChart({ stocks }: { stocks: StockData[] }) {
  const data = stocks.map(stock => ({
    name: stock.symbol,
    return: stock.changePercent,
    risk: stock.beta,
    size: Math.log(stock.marketCap) * 2,
    dividend: stock.dividend
  }));

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="risk" 
            type="number" 
            name="Beta (Riesgo)" 
            domain={['auto', 'auto']}
          />
          <YAxis 
            dataKey="return" 
            name="Retorno (%)" 
            domain={['auto', 'auto']}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              `${value.toFixed(2)}${name === 'return' ? '%' : ''}`,
              name === 'return' ? 'Retorno' : 'Beta'
            ]}
          />
          <Legend />
          <Scatter
            name="Acciones"
            data={data}
            fill="#8884d8"
            shape="circle"
          >
            {data.map((entry, index) => (
              <circle
                key={index}
                cx={0}
                cy={0}
                r={entry.size}
                fill={entry.dividend > 2 ? '#82ca9d' : '#8884d8'}
              />
            ))}
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
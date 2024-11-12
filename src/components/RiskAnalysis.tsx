import React from 'react';
import { Shield, AlertTriangle, TrendingUp } from 'lucide-react';

interface RiskMetrics {
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export default function RiskAnalysis({ metrics }: { metrics: RiskMetrics }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Shield className="mr-2" /> Análisis de Riesgo
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="flex items-center text-lg font-semibold text-blue-800 mb-2">
            <TrendingUp className="mr-2" /> Volatilidad
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {(metrics.volatility * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-blue-600">Volatilidad anual</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="flex items-center text-lg font-semibold text-green-800 mb-2">
            <Shield className="mr-2" /> Ratio de Sharpe
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {metrics.sharpeRatio.toFixed(2)}
          </p>
          <p className="text-sm text-green-600">Retorno ajustado al riesgo</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="flex items-center text-lg font-semibold text-red-800 mb-2">
            <AlertTriangle className="mr-2" /> Máxima Caída
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {(metrics.maxDrawdown * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-red-600">Mayor caída histórica</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Evaluación de Riesgo</h3>
        <ul className="space-y-2">
          {metrics.sharpeRatio < 1 && (
            <li className="flex items-center text-yellow-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Considere rebalancear para mejorar el retorno ajustado al riesgo
            </li>
          )}
          {metrics.volatility > 0.2 && (
            <li className="flex items-center text-yellow-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Volatilidad superior al promedio detectada
            </li>
          )}
          {metrics.maxDrawdown < -0.2 && (
            <li className="flex items-center text-yellow-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Se observan pérdidas potenciales significativas
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
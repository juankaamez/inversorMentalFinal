import React from 'react';
import { PieChart, DollarSign, Shield } from 'lucide-react';
import type { PortfolioRecommendation } from '../types';

export default function PortfolioRecommendation({ recommendation }: { recommendation: PortfolioRecommendation }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <PieChart className="mr-2" /> Recommended Portfolio
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Allocation Strategy</h3>
          <div className="space-y-2">
            {recommendation.stocks.map(({ symbol, percentage }) => (
              <div key={symbol} className="flex justify-between items-center">
                <span className="font-medium">{symbol}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="flex items-center text-lg font-semibold text-blue-800 mb-2">
              <DollarSign className="mr-2" /> Expected Return
            </h3>
            <p className="text-3xl font-bold text-blue-600">{recommendation.expectedReturn}%</p>
            <p className="text-sm text-blue-600">Annual projected return</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="flex items-center text-lg font-semibold text-green-800 mb-2">
              <Shield className="mr-2" /> Risk Level
            </h3>
            <p className="text-xl font-semibold text-green-600 capitalize">{recommendation.riskLevel}</p>
            <p className="text-sm text-green-600">Based on your profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}
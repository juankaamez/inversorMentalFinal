import React, { useState, useEffect } from 'react';
import { Briefcase, Settings } from 'lucide-react';
import RiskProfiler from './components/RiskProfiler';
import PortfolioRecommendation from './components/PortfolioRecommendation';
import MarketOverview from './components/MarketOverview';
import MarketNews from './components/MarketNews';
import RiskAnalysis from './components/RiskAnalysis';
import ApiSettings from './components/ApiSettings';
import AIRecommendations from './components/AIRecommendations';
import { PortfolioPerformanceChart, RiskReturnChart } from './components/AdvancedCharts';
import { getStockQuotes, getMarketNews } from './services/marketData';
import { calculateRiskMetrics } from './services/riskAnalysis';
import { optimizePortfolio } from './services/portfolioOptimizer';
import type { InvestorProfile, StockData, NewsItem } from './types';

function App() {
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMarketData = async () => {
    try {
      const [stockData, newsData] = await Promise.all([
        getStockQuotes(),
        getMarketNews()
      ]);

      setStocks(stockData);
      setNews(newsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Error al obtener datos del mercado. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleProfileComplete = (newProfile: InvestorProfile) => {
    setProfile(newProfile);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Inversor Mental</h1>
                <p className="text-sm text-blue-100">by Juan Carlos Amez @juankaamez © 2024-2025. Todos los derechos reservados.</p>
                <p className="text-xs text-blue-200">Agradecimientos especiales a WICS4S Team @ Gossip Mental - MJ, Ali, Alicia, Guillermo, Sol, Vinko, Luisa, Sete, Yair y Miguel</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-blue-700 rounded-full transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {showSettings && (
          <ApiSettings 
            onSubmit={() => setShowSettings(false)} 
            onClose={() => setShowSettings(false)}
          />
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <MarketOverview stocks={stocks} />
            
            {stocks.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Rendimiento del Portafolio</h2>
                  <PortfolioPerformanceChart stocks={stocks} />
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Análisis Riesgo/Retorno</h2>
                  <RiskReturnChart stocks={stocks} />
                </div>
              </div>
            )}

            <MarketNews news={news} />
            
            {!profile ? (
              <RiskProfiler onProfileComplete={handleProfileComplete} />
            ) : (
              <>
                <RiskAnalysis metrics={calculateRiskMetrics(stocks.map(s => s.price))} />
                <AIRecommendations stocks={stocks} profile={profile} />
                <PortfolioRecommendation recommendation={optimizePortfolio(stocks, profile)} />
              </>
            )}
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-gray-300 py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">
            Datos proporcionados por Yahoo Finance y RSS feeds financieros.
            Datos del mercado retrasados al menos 15 minutos.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
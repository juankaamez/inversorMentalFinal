import React, { useState } from 'react';
import { Newspaper, ExternalLink, ChevronDown, ChevronUp, Filter, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NewsItem {
  headline: string;
  summary: string;
  url: string;
  source: string;
  datetime: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  region?: string;
  category?: string;
}

interface NewsFilters {
  region: string;
  sentiment: string;
  category: string;
}

export default function MarketNews({ news }: { news: NewsItem[] }) {
  const [filters, setFilters] = useState<NewsFilters>({
    region: 'all',
    sentiment: 'all',
    category: 'all'
  });
  const [expandedNews, setExpandedNews] = useState<number[]>([0]); // First news item expanded by default
  const [showFilters, setShowFilters] = useState(false);

  if (!news || news.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Newspaper className="mr-2" /> Market Insights
        </h2>
        <p className="text-gray-600 mt-4">Loading market news...</p>
      </div>
    );
  }

  const toggleNewsExpansion = (index: number) => {
    setExpandedNews(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredNews = news.filter(item => {
    if (filters.region !== 'all' && item.region !== filters.region) return false;
    if (filters.sentiment !== 'all' && item.sentiment !== filters.sentiment) return false;
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    return true;
  });

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Newspaper className="mr-2" /> Market Insights
        </h2>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.region}
              onChange={(e) => setFilters(f => ({ ...f, region: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Regions</option>
              <option value="US">United States</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="Global">Global</option>
            </select>

            <select
              value={filters.sentiment}
              onChange={(e) => setFilters(f => ({ ...f, sentiment: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Sentiment</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="earnings">Earnings</option>
              <option value="market_analysis">Market Analysis</option>
              <option value="economy">Economy</option>
              <option value="technology">Technology</option>
              <option value="commodities">Commodities</option>
              <option value="forex">Forex</option>
            </select>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {filteredNews.map((item, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
          >
            <button
              onClick={() => toggleNewsExpansion(index)}
              className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-2 flex-grow">
                  {getSentimentIcon(item.sentiment)}
                  <h3 className="text-lg font-semibold text-gray-800">{item.headline}</h3>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(item.datetime).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {expandedNews.includes(index) ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>
            </button>

            {expandedNews.includes(index) && (
              <div className="p-4 border-t border-gray-200">
                <p className="text-gray-600 mb-4">{item.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded">
                      {item.source}
                    </span>
                    {item.region && (
                      <span className="text-sm font-medium px-2 py-1 bg-gray-50 text-gray-600 rounded">
                        {item.region}
                      </span>
                    )}
                    {item.category && (
                      <span className="text-sm font-medium px-2 py-1 bg-green-50 text-green-600 rounded">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    Read More <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
import axios from 'axios';
import type { StockData, NewsItem } from '../types';

// Stock symbols to track
const STOCK_SYMBOLS = [
  // US Market
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'JPM', 'V', 'JNJ',
  // European Market
  'SAP.DE', 'ASML.AS', 'LVMH.PA', 'NOVO-B.CO', 'ROG.SW'
];

// RSS Feed URLs - Using CORS proxy to avoid cross-origin issues
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const RSS_FEEDS = [
  'https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC,^DJI,^IXIC&region=US&lang=en-US',
  'https://www.investing.com/rss/news.rss',
  'https://seekingalpha.com/market_currents.xml',
  'https://www.marketwatch.com/rss/topstories'
].map(url => `${CORS_PROXY}${encodeURIComponent(url)}`);

export async function getStockQuotes(): Promise<StockData[]> {
  try {
    const promises = STOCK_SYMBOLS.map(async (symbol) => {
      try {
        const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
          params: {
            interval: '1d',
            range: '1d'
          }
        });

        const quote = response.data?.chart?.result?.[0]?.meta;
        if (!quote) return null;

        return {
          symbol,
          name: quote.symbol,
          sector: getSector(symbol),
          price: quote.regularMarketPrice || 0,
          change: quote.regularMarketPrice - quote.previousClose || 0,
          changePercent: ((quote.regularMarketPrice - quote.previousClose) / quote.previousClose * 100) || 0,
          volume: quote.regularMarketVolume || 0,
          marketCap: quote.marketCap || 0,
          peRatio: 0, // Will be updated with company info
          dividend: quote.dividendYield || 0,
          high52Week: quote.fiftyTwoWeekHigh || 0,
          low52Week: quote.fiftyTwoWeekLow || 0,
          avgVolume: quote.averageDailyVolume3Month || 0,
          beta: 1 // Will be updated with company info
        };
      } catch (error) {
        console.warn(`Error fetching ${symbol}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const validResults = results.filter((result): result is StockData => result !== null);
    
    return validResults.length > 0 ? validResults : FALLBACK_STOCKS;
  } catch (error) {
    console.error('Error fetching stock quotes:', error);
    return FALLBACK_STOCKS;
  }
}

export async function getMarketNews(): Promise<NewsItem[]> {
  try {
    const newsPromises = RSS_FEEDS.map(async (feedUrl) => {
      try {
        const response = await axios.get(feedUrl);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');

        return Array.from(items).map((item): NewsItem => {
          const title = item.querySelector('title')?.textContent || '';
          const description = item.querySelector('description')?.textContent || '';
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';
          const source = item.querySelector('source')?.textContent || new URL(feedUrl).hostname;

          return {
            headline: title,
            summary: description.replace(/<[^>]*>/g, '').substring(0, 300) + '...',
            url: link,
            source,
            datetime: new Date(pubDate).getTime(),
            sentiment: analyzeSentiment(title + ' ' + description),
            region: determineRegion(title + ' ' + description),
            category: determineCategory(title + ' ' + description)
          };
        });
      } catch (error) {
        console.warn(`Error fetching RSS feed:`, error);
        return [];
      }
    });

    const allNews = (await Promise.all(newsPromises))
      .flat()
      .sort((a, b) => b.datetime - a.datetime)
      .slice(0, 30);

    return allNews.length > 0 ? allNews : FALLBACK_NEWS;
  } catch (error) {
    console.error('Error in getMarketNews:', error);
    return FALLBACK_NEWS;
  }
}

function getSector(symbol: string): string {
  const sectorMap: Record<string, string> = {
    'AAPL': 'Technology',
    'MSFT': 'Technology',
    'GOOGL': 'Technology',
    'AMZN': 'Consumer Cyclical',
    'NVDA': 'Technology',
    'META': 'Technology',
    'TSLA': 'Automotive',
    'JPM': 'Financial Services',
    'V': 'Financial Services',
    'JNJ': 'Healthcare',
    'SAP.DE': 'Technology',
    'ASML.AS': 'Technology',
    'LVMH.PA': 'Consumer Cyclical',
    'NOVO-B.CO': 'Healthcare',
    'ROG.SW': 'Healthcare'
  };
  
  return sectorMap[symbol] || 'Other';
}

function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['surge', 'gain', 'rise', 'growth', 'profit', 'boost', 'success', 'positive'];
  const negativeWords = ['fall', 'drop', 'decline', 'loss', 'risk', 'crash', 'crisis', 'negative'];

  const lowerText = text.toLowerCase();
  let score = 0;

  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score++;
  });

  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score--;
  });

  return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
}

function determineRegion(text: string): string {
  const regions = {
    'US': ['united states', 'us market', 'wall street', 'nasdaq', 'dow jones'],
    'Europe': ['european', 'europe', 'eu market', 'euro', 'ecb'],
    'Asia': ['asian', 'asia', 'china', 'japan', 'hong kong'],
  };

  const lowerText = text.toLowerCase();
  for (const [region, keywords] of Object.entries(regions)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return region;
    }
  }
  return 'Global';
}

function determineCategory(text: string): string {
  const categories = {
    earnings: ['earnings', 'revenue', 'profit'],
    market_analysis: ['analysis', 'market', 'trading'],
    economy: ['economy', 'economic', 'fed', 'inflation'],
    technology: ['tech', 'technology', 'software'],
    commodities: ['commodity', 'oil', 'gold'],
    forex: ['forex', 'currency', 'exchange']
  };

  const lowerText = text.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  return 'general';
}

const FALLBACK_STOCKS: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    price: 173.50,
    change: 2.50,
    changePercent: 1.45,
    volume: 78500000,
    marketCap: 2800000000000,
    peRatio: 28.5,
    dividend: 0.65,
    high52Week: 180.50,
    low52Week: 124.17,
    avgVolume: 85000000,
    beta: 1.2
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    price: 338.45,
    change: 3.20,
    changePercent: 0.95,
    volume: 65400000,
    marketCap: 2500000000000,
    peRatio: 32.1,
    dividend: 0.88,
    high52Week: 349.67,
    low52Week: 213.43,
    avgVolume: 75000000,
    beta: 0.9
  }
];

const FALLBACK_NEWS: NewsItem[] = [
  {
    headline: "Markets React to Latest Economic Data",
    summary: "Global markets show mixed reactions to the latest economic indicators...",
    url: "https://example.com/markets",
    source: "Financial News",
    datetime: Date.now(),
    sentiment: "neutral",
    region: "Global",
    category: "market_analysis"
  },
  {
    headline: "Tech Sector Leads Market Rally",
    summary: "Technology stocks continue to drive market gains as investors...",
    url: "https://example.com/tech",
    source: "Market Watch",
    datetime: Date.now() - 3600000,
    sentiment: "positive",
    region: "US",
    category: "technology"
  }
];
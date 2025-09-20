// News service for fetching deforestation-related news
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  author?: string;
  publishedAt: string;
  urlToImage?: string;
  category: 'breaking' | 'conservation' | 'policy' | 'research' | 'wildfire' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  readTime: number; // in minutes
}

// Simulated news data - In production, this would come from real APIs
const simulatedNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Amazon Rainforest Deforestation Reaches 15-Year High Despite Conservation Efforts',
    description: 'New satellite data reveals that Amazon deforestation has surged to its highest level in 15 years, with over 13,000 square kilometers cleared in the past year alone.',
    url: 'https://example.com/amazon-deforestation-high',
    source: 'Environmental Times',
    author: 'Dr. Maria Santos',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    urlToImage: 'https://images.unsplash.com/photo-1574482620881-b4ec2e2c8dd0?w=500&h=300&fit=crop',
    category: 'breaking',
    severity: 'critical',
    location: 'Brazil, Amazon Basin',
    readTime: 5
  },
  {
    id: '2',
    title: 'Indonesia Implements New Forest Protection Laws to Combat Palm Oil Deforestation',
    description: 'The Indonesian government announces stricter regulations on palm oil plantations following international pressure to protect remaining tropical forests.',
    url: 'https://example.com/indonesia-forest-laws',
    source: 'Reuters Environmental',
    author: 'James Wilson',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    urlToImage: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop',
    category: 'policy',
    severity: 'medium',
    location: 'Indonesia, Borneo',
    readTime: 4
  },
  {
    id: '3',
    title: 'AI Technology Helps Identify Illegal Logging in Congo Basin Forests',
    description: 'Researchers deploy advanced AI algorithms and satellite monitoring to detect and prevent illegal logging activities in Central African forests.',
    url: 'https://example.com/ai-illegal-logging',
    source: 'Nature Conservation Today',
    author: 'Dr. Emmanuel Kone',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    urlToImage: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=500&h=300&fit=crop',
    category: 'research',
    severity: 'medium',
    location: 'Democratic Republic of Congo',
    readTime: 6
  },
  {
    id: '4',
    title: 'Canadian Wildfires Destroy 2 Million Hectares of Boreal Forest',
    description: 'Unprecedented wildfire season in Canada has resulted in the loss of over 2 million hectares of crucial boreal forest, affecting global carbon absorption.',
    url: 'https://example.com/canada-wildfires',
    source: 'Global Forest Watch',
    author: 'Sarah Mitchell',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    urlToImage: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=500&h=300&fit=crop',
    category: 'wildfire',
    severity: 'high',
    location: 'Canada, British Columbia',
    readTime: 7
  },
  {
    id: '5',
    title: 'European Union Bans Imports from Deforestation-Linked Supply Chains',
    description: 'New EU regulation will prohibit imports of commodities linked to deforestation, affecting global trade in soy, beef, palm oil, and timber.',
    url: 'https://example.com/eu-deforestation-ban',
    source: 'European Environmental Agency',
    author: 'Dr. Hans Mueller',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    urlToImage: 'https://images.unsplash.com/photo-1574482620881-b4ec2e2c8dd0?w=500&h=300&fit=crop',
    category: 'policy',
    severity: 'medium',
    location: 'European Union',
    readTime: 5
  },
  {
    id: '6',
    title: 'Innovative Reforestation Project Uses Drones to Plant 1 Million Trees',
    description: 'A groundbreaking conservation initiative in Peru successfully plants one million native trees using drone technology and seed bombs.',
    url: 'https://example.com/drone-reforestation',
    source: 'Conservation Weekly',
    author: 'Carlos Rodriguez',
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    urlToImage: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop',
    category: 'conservation',
    severity: 'low',
    location: 'Peru, Amazon Region',
    readTime: 4
  },
  {
    id: '7',
    title: 'Satellite Data Reveals Hidden Deforestation in Myanmar Forests',
    description: 'New analysis of satellite imagery uncovers extensive illegal logging operations in Myanmar, highlighting the need for international monitoring.',
    url: 'https://example.com/myanmar-hidden-deforestation',
    source: 'Forest Monitoring Institute',
    author: 'Dr. Aung San',
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    urlToImage: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=500&h=300&fit=crop',
    category: 'research',
    severity: 'high',
    location: 'Myanmar',
    readTime: 6
  },
  {
    id: '8',
    title: 'Indigenous Communities Win Legal Victory to Protect Ancestral Forests',
    description: 'Supreme Court ruling grants land rights to indigenous communities, protecting 500,000 hectares of pristine rainforest from development.',
    url: 'https://example.com/indigenous-forest-victory',
    source: 'Indigenous Rights Today',
    author: 'Elena Guajajara',
    publishedAt: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(), // 2.5 days ago
    urlToImage: 'https://images.unsplash.com/photo-1574482620881-b4ec2e2c8dd0?w=500&h=300&fit=crop',
    category: 'conservation',
    severity: 'low',
    location: 'Colombia',
    readTime: 5
  },
  {
    id: '9',
    title: 'Climate Change Accelerates Forest Loss in Sub-Saharan Africa',
    description: 'New research indicates that rising temperatures and changing precipitation patterns are accelerating forest degradation across West and East Africa.',
    url: 'https://example.com/climate-africa-forests',
    source: 'Climate Research Journal',
    author: 'Prof. Kwame Asante',
    publishedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
    urlToImage: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop',
    category: 'research',
    severity: 'high',
    location: 'Sub-Saharan Africa',
    readTime: 8
  },
  {
    id: '10',
    title: '$2 Billion Forest Conservation Fund Launched by International Coalition',
    description: 'Major international donors commit $2 billion to forest conservation efforts, targeting critical forest ecosystems in tropical regions.',
    url: 'https://example.com/forest-conservation-fund',
    source: 'World Bank Environmental',
    author: 'Alexandra Thompson',
    publishedAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(), // 4 days ago
    urlToImage: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=500&h=300&fit=crop',
    category: 'conservation',
    severity: 'low',
    location: 'Global',
    readTime: 4
  }
];

class NewsService {
  // Use environment variables for API keys
  private readonly NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY || 'demo_key';
  private readonly NEWS_API_URL = process.env.REACT_APP_NEWS_API_URL || 'https://newsapi.org/v2/everything';

  // Real API call with fallback to simulated data
  async fetchDeforestationNews(category?: string, limit: number = 20): Promise<NewsArticle[]> {
    // Try real API first, fallback to simulated data if API fails or no key
    if (this.NEWS_API_KEY && this.NEWS_API_KEY !== 'demo_key' && this.NEWS_API_KEY !== 'your_newsapi_key_here') {
      try {
        return await this.fetchDeforestationNewsFromAPI(category, limit);
      } catch (error) {
        console.warn('Real API failed, using simulated data:', error);
        return this.fetchSimulatedNews(category, limit);
      }
    } else {
      // Use simulated data when no API key is provided
      return this.fetchSimulatedNews(category, limit);
    }
  }

  // Simulated data method (extracted from original method)
  private async fetchSimulatedNews(category?: string, limit: number = 20): Promise<NewsArticle[]> {
    try {
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      let filteredNews = [...simulatedNews];

      // Filter by category if specified
      if (category && category !== 'all') {
        filteredNews = filteredNews.filter(article => article.category === category);
      }

      // Sort by most recent first
      filteredNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      return filteredNews.slice(0, limit);
    } catch (error) {
      console.error('Error fetching simulated news:', error);
      throw new Error('Failed to fetch news articles');
    }
  }

  // Real API implementation using NewsAPI.org
  async fetchDeforestationNewsFromAPI(category?: string, limit: number = 20): Promise<NewsArticle[]> {
    // Build search query for deforestation-related news
    let searchQuery = 'deforestation OR "forest loss" OR "illegal logging" OR "forest conservation" OR "rainforest destruction" OR "Amazon rainforest"';
    
    // Add category-specific terms if specified
    if (category && category !== 'all') {
      const categoryTerms: { [key: string]: string } = {
        'wildfire': 'wildfire OR "forest fire"',
        'conservation': 'conservation OR protection OR restoration',
        'policy': 'policy OR law OR government OR regulation',
        'research': 'research OR study OR scientist',
        'breaking': 'breaking OR urgent OR alert'
      };
      if (categoryTerms[category]) {
        searchQuery += ` AND (${categoryTerms[category]})`;
      }
    }

    const url = `${this.NEWS_API_URL}?q=${encodeURIComponent(searchQuery)}&apiKey=${this.NEWS_API_KEY}&pageSize=${limit}&sortBy=publishedAt&language=en&domains=reuters.com,bbc.com,cnn.com,theguardian.com,nationalgeographic.com,nature.com`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`NewsAPI error: ${data.message || 'Unknown error'}`);
      }
      
      return data.articles.map((article: any, index: number) => ({
        id: `newsapi_${Date.now()}_${index}`,
        title: article.title,
        description: article.description || article.content?.substring(0, 200) + '...' || 'No description available',
        url: article.url,
        source: article.source.name,
        author: article.author || 'Unknown',
        publishedAt: article.publishedAt,
        urlToImage: article.urlToImage || '/api/placeholder/400/250',
        category: this.categorizeArticle(article.title + ' ' + (article.description || '')),
        severity: this.assessSeverity(article.title + ' ' + (article.description || '')),
        location: this.extractLocation(article.title + ' ' + (article.description || '')),
        readTime: this.estimateReadTime(article.description || article.content || '')
      }));
    } catch (error) {
      console.error('Error fetching real news:', error);
      throw error; // Let the calling method handle the fallback
    }
  }

  // Helper methods for categorization and analysis
  private categorizeArticle(text: string): NewsArticle['category'] {
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes('breaking') || lowercaseText.includes('urgent') || lowercaseText.includes('alert')) {
      return 'breaking';
    } else if (lowercaseText.includes('wildfire') || lowercaseText.includes('fire') || lowercaseText.includes('burning')) {
      return 'wildfire';
    } else if (lowercaseText.includes('conservation') || lowercaseText.includes('protection') || lowercaseText.includes('restoration')) {
      return 'conservation';
    } else if (lowercaseText.includes('policy') || lowercaseText.includes('law') || lowercaseText.includes('government') || lowercaseText.includes('regulation')) {
      return 'policy';
    } else if (lowercaseText.includes('research') || lowercaseText.includes('study') || lowercaseText.includes('scientist')) {
      return 'research';
    }
    
    return 'general';
  }

  private assessSeverity(text: string): NewsArticle['severity'] {
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes('critical') || lowercaseText.includes('devastating') || lowercaseText.includes('emergency')) {
      return 'critical';
    } else if (lowercaseText.includes('high') || lowercaseText.includes('severe') || lowercaseText.includes('alarming')) {
      return 'high';
    } else if (lowercaseText.includes('moderate') || lowercaseText.includes('concerning')) {
      return 'medium';
    }
    
    return 'low';
  }

  private extractLocation(text: string): string {
    // Simple location extraction - in production, use a proper NLP service
    const locations = ['Amazon', 'Indonesia', 'Brazil', 'Congo', 'Myanmar', 'Canada', 'Peru', 'Colombia', 'Africa'];
    const foundLocation = locations.find(location => 
      text.toLowerCase().includes(location.toLowerCase())
    );
    return foundLocation || 'Global';
  }

  private estimateReadTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(' ').length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  // Search functionality
  async searchNews(query: string): Promise<NewsArticle[]> {
    const allNews = await this.fetchDeforestationNews();
    const lowercaseQuery = query.toLowerCase();
    
    return allNews.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.description.toLowerCase().includes(lowercaseQuery) ||
      article.source.toLowerCase().includes(lowercaseQuery) ||
      (article.location && article.location.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get trending topics
  getTrendingTopics(): string[] {
    return [
      'Amazon Deforestation',
      'Palm Oil',
      'Illegal Logging',
      'Climate Change',
      'Forest Conservation',
      'Indigenous Rights',
      'Satellite Monitoring',
      'Reforestation'
    ];
  }

  // Format time ago
  formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

export const newsService = new NewsService();
export default newsService;
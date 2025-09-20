import React from 'react';
import { NewsArticle } from '../services/newsService';
import { 
  ExternalLink, 
  Clock, 
  MapPin, 
  User, 
  AlertTriangle, 
  Shield, 
  Flame, 
  Leaf, 
  Scale, 
  BookOpen,
  Calendar
} from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
  onReadMore: (url: string) => void;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onReadMore, featured = false }) => {
  const getCategoryIcon = (category: NewsArticle['category']) => {
    switch (category) {
      case 'breaking': return AlertTriangle;
      case 'conservation': return Leaf;
      case 'policy': return Scale;
      case 'research': return BookOpen;
      case 'wildfire': return Flame;
      default: return Shield;
    }
  };

  const getCategoryColor = (category: NewsArticle['category']) => {
    switch (category) {
      case 'breaking': return 'bg-red-500';
      case 'conservation': return 'bg-green-500';
      case 'policy': return 'bg-blue-500';
      case 'research': return 'bg-purple-500';
      case 'wildfire': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: NewsArticle['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getSeverityIcon = (severity: NewsArticle['severity']) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
    }
  };

  const CategoryIcon = getCategoryIcon(article.category);

  const handleReadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    onReadMore(article.url);
  };

  if (featured) {
    return (
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
        {/* Featured Article Header */}
        <div className="relative">
          {article.urlToImage && (
            <div className="relative h-64 overflow-hidden">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574482620881-b4ec2e2c8dd0?w=500&h=300&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${getCategoryColor(article.category)}`}>
              <CategoryIcon className="w-4 h-4" />
              <span className="capitalize">{article.category}</span>
            </div>
          </div>

          {/* Severity Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(article.severity)}`}>
              <span>{getSeverityIcon(article.severity)}</span>
              <span className="capitalize">{article.severity}</span>
            </div>
          </div>
        </div>

        {/* Featured Article Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300">
            {article.title}
          </h2>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
            {article.description}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span className="font-medium">{article.source}</span>
            </div>
            {article.author && (
              <div className="flex items-center space-x-1">
                <span>by {article.author}</span>
              </div>
            )}
            {article.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{article.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} min read</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleReadMore}
            className="group/btn bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <span>Read Full Article</span>
            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      <div className="flex">
        {/* Article Image */}
        {article.urlToImage && (
          <div className="flex-shrink-0 w-32 h-32 relative overflow-hidden">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574482620881-b4ec2e2c8dd0?w=200&h=200&fit=crop';
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <div className="flex-1 p-4">
          {/* Category and Severity */}
          <div className="flex items-center justify-between mb-2">
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-white text-xs font-semibold ${getCategoryColor(article.category)}`}>
              <CategoryIcon className="w-3 h-3" />
              <span className="capitalize">{article.category}</span>
            </div>
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(article.severity)}`}>
              <span>{getSeverityIcon(article.severity)}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300">
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {article.description}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span className="font-medium">{article.source}</span>
              </div>
              {article.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{article.location}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{article.readTime}m</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Read More Button */}
          <button
            onClick={handleReadMore}
            className="mt-3 group/btn inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors duration-200"
          >
            <span>Read more</span>
            <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
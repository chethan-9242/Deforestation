import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, Image as ImageIcon, BarChart3, RefreshCw, Home, 
  Play, Pause, SkipBack, SkipForward,
  Ruler, AlertTriangle, TrendingUp, Newspaper, Search, Filter, Globe
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { PredictionResult } from './types/index';
import { predictImage, getModelStatus } from './services/api';
import ImageGallery from './components/ImageGallery';
import ClassDistribution from './components/ClassDistribution';
import LoadingSpinner from './components/LoadingSpinner';
import NewsCard from './components/NewsCard';
import { NewsArticle, newsService } from './services/newsService';

interface DashboardProps {
  onBackToLanding: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBackToLanding }) => {
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [beforeImagePreview, setBeforeImagePreview] = useState<string | null>(null);
  const [afterImagePreview, setAfterImagePreview] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<{
    deforestationDetected: boolean;
    confidence: number;
    beforeAnalysis: PredictionResult | null;
    afterAnalysis: PredictionResult | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<{ loaded: boolean; classes: string[] } | null>(null);
  const [activeSection, setActiveSection] = useState<string>('upload');
  const [historicalImages, setHistoricalImages] = useState<File[]>([]);
  const [historicalPreviews, setHistoricalPreviews] = useState<string[]>([]);
  const [historicalAnalysis, setHistoricalAnalysis] = useState<PredictionResult[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // milliseconds
  
  // Interactive Dashboard states
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedForestType, setSelectedForestType] = useState<string>('all');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>('all');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // News Feed states
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsRefreshTime, setNewsRefreshTime] = useState<Date>(new Date());
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);

  // Check model status on component mount
  React.useEffect(() => {
    const checkModelStatus = async () => {
      try {
        const status = await getModelStatus();
        setModelStatus(status);
      } catch (err) {
        console.error('Failed to check model status:', err);
      }
    };
    checkModelStatus();
  }, []);

  const handleBeforeImageUpload = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setBeforeImage(file);
      const reader = new FileReader();
      reader.onload = () => setBeforeImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAfterImageUpload = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setAfterImage(file);
      const reader = new FileReader();
      reader.onload = () => setAfterImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const beforeDropzone = useDropzone({
    onDrop: handleBeforeImageUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  const afterDropzone = useDropzone({
    onDrop: handleAfterImageUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  const analyzeImages = async () => {
    if (!beforeImage || !afterImage) {
      setError('Please upload both before and after images');
      return;
    }

    setLoading(true);
    setError(null);
    setComparisonResult(null);

    // Simulate progress bar
    if (progressRef.current) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 90) progress = 90;
        progressRef.current!.style.width = `${progress}%`;
      }, 200);
    }

    try {
      // Analyze both images
      const beforeResult = await predictImage(beforeImage);
      const afterResult = await predictImage(afterImage);

      // Calculate deforestation detection
      const beforeForestPercentage = beforeResult.class_percentages.forest || 0;
      const afterForestPercentage = afterResult.class_percentages.forest || 0;
      const forestLoss = beforeForestPercentage - afterForestPercentage;
      
      const deforestationDetected = forestLoss > 5; // Threshold of 5% forest loss
      const confidence = Math.min(95, Math.max(60, forestLoss * 10 + 70)); // Confidence based on forest loss

      setComparisonResult({
        deforestationDetected,
        confidence: Math.round(confidence),
        beforeAnalysis: beforeResult,
        afterAnalysis: afterResult
      });

      if (progressRef.current) {
        progressRef.current.style.width = '100%';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.width = '0%';
        }
      }, 1000);
    }
  };

  const resetAnalysis = () => {
    setBeforeImage(null);
    setAfterImage(null);
    setBeforeImagePreview(null);
    setAfterImagePreview(null);
    setComparisonResult(null);
    setError(null);
  };

  const resetPrediction = () => {
    setComparisonResult(null);
    setError(null);
  };

  const handleHistoricalImageUpload = (acceptedFiles: File[]) => {
    const newFiles = [...historicalImages, ...acceptedFiles];
    setHistoricalImages(newFiles);
    
    // Create previews for new files
    const newPreviews: string[] = [];
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === acceptedFiles.length) {
          setHistoricalPreviews([...historicalPreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const analyzeHistoricalImages = async () => {
    if (historicalImages.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const analyses: PredictionResult[] = [];
      for (const image of historicalImages) {
        const result = await predictImage(image);
        analyses.push(result);
      }
      setHistoricalAnalysis(analyses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Historical analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      if (historicalAnalysis.length > 0) {
        intervalRef.current = setInterval(() => {
          setCurrentFrame(prev => (prev + 1) % historicalAnalysis.length);
        }, playbackSpeed);
        setIsPlaying(true);
      }
    }
  };

  const goToFrame = (frameIndex: number) => {
    setCurrentFrame(frameIndex);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const nextFrame = () => {
    setCurrentFrame(prev => (prev + 1) % historicalAnalysis.length);
  };

  const prevFrame = () => {
    setCurrentFrame(prev => (prev - 1 + historicalAnalysis.length) % historicalAnalysis.length);
  };

  const clearHistoricalData = () => {
    setHistoricalImages([]);
    setHistoricalPreviews([]);
    setHistoricalAnalysis([]);
    setCurrentFrame(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  // Interactive Dashboard Functions
  const generateDashboardData = () => {
    const sampleData = [
      { id: 1, region: 'Amazon Basin', forestType: 'Tropical Rainforest', timePeriod: '2024', forestCover: 85.2, deforestation: 2.1, area: 5500000, carbon: 120000 },
      { id: 2, region: 'Congo Basin', forestType: 'Tropical Rainforest', timePeriod: '2024', forestCover: 78.5, deforestation: 1.8, area: 1800000, carbon: 45000 },
      { id: 3, region: 'Borneo', forestType: 'Tropical Rainforest', timePeriod: '2024', forestCover: 72.3, deforestation: 3.2, area: 750000, carbon: 28000 },
      { id: 4, region: 'Southeast Asia', forestType: 'Tropical Rainforest', timePeriod: '2024', forestCover: 68.9, deforestation: 4.5, area: 1200000, carbon: 35000 },
      { id: 5, region: 'Central America', forestType: 'Tropical Dry Forest', timePeriod: '2024', forestCover: 45.2, deforestation: 2.8, area: 320000, carbon: 12000 },
      { id: 6, region: 'Madagascar', forestType: 'Tropical Dry Forest', timePeriod: '2024', forestCover: 38.7, deforestation: 5.1, area: 150000, carbon: 8000 },
      { id: 7, region: 'Sumatra', forestType: 'Tropical Rainforest', timePeriod: '2024', forestCover: 65.4, deforestation: 3.9, area: 470000, carbon: 22000 },
      { id: 8, region: 'New Guinea', forestType: 'Tropical Rainforest', timePeriod: '2024', forestCover: 82.1, deforestation: 1.2, area: 800000, carbon: 38000 },
      { id: 9, region: 'Amazon Basin', forestType: 'Tropical Rainforest', timePeriod: '2023', forestCover: 87.3, deforestation: 1.8, area: 5500000, carbon: 125000 },
      { id: 10, region: 'Congo Basin', forestType: 'Tropical Rainforest', timePeriod: '2023', forestCover: 80.3, deforestation: 1.5, area: 1800000, carbon: 47000 },
      { id: 11, region: 'Borneo', forestType: 'Tropical Rainforest', timePeriod: '2023', forestCover: 75.5, deforestation: 2.8, area: 750000, carbon: 30000 },
      { id: 12, region: 'Southeast Asia', forestType: 'Tropical Rainforest', timePeriod: '2023', forestCover: 73.4, deforestation: 3.9, area: 1200000, carbon: 38000 }
    ];
    setDashboardData(sampleData);
    setFilteredData(sampleData);
  };

  const applyFilters = () => {
    let filtered = dashboardData;
    
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(item => item.region === selectedRegion);
    }
    
    if (selectedForestType !== 'all') {
      filtered = filtered.filter(item => item.forestType === selectedForestType);
    }
    
    if (selectedTimePeriod !== 'all') {
      filtered = filtered.filter(item => item.timePeriod === selectedTimePeriod);
    }
    
    setFilteredData(filtered);
  };

  // Generate dashboard data on mount
  React.useEffect(() => {
    generateDashboardData();
  }, []);

  // Apply filters when filter values change
  React.useEffect(() => {
    applyFilters();
  }, [selectedRegion, selectedForestType, selectedTimePeriod, dashboardData]);

  // News Feed functions
  const fetchNews = async (category?: string) => {
    setNewsLoading(true);
    setNewsError(null);
    try {
      const articles = await newsService.fetchDeforestationNews(category);
      setNewsArticles(articles);
      setNewsRefreshTime(new Date());
    } catch (error) {
      setNewsError('Failed to load news articles. Please try again later.');
    } finally {
      setNewsLoading(false);
    }
  };

  const searchNews = async (query: string) => {
    if (!query.trim()) {
      fetchNews(selectedCategory !== 'all' ? selectedCategory : undefined);
      return;
    }
    
    setNewsLoading(true);
    setNewsError(null);
    try {
      const articles = await newsService.searchNews(query);
      setNewsArticles(articles);
    } catch (error) {
      setNewsError('Search failed. Please try again.');
    } finally {
      setNewsLoading(false);
    }
  };

  const handleNewsRead = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    fetchNews(category !== 'all' ? category : undefined);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchNews(searchQuery);
  };

  // Load news on component mount and when switching to news section
  React.useEffect(() => {
    if (activeSection === 'news') {
      fetchNews();
      setTrendingTopics(newsService.getTrendingTopics());
    }
  }, [activeSection]);

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const historicalDropzone = useDropzone({
    onDrop: handleHistoricalImageUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: true
  });

  // Dashboard data processing
  const getUniqueValues = (key: string) => {
    return Array.from(new Set(dashboardData.map((item: any) => item[key])));
  };

  type PieDatum = { name: string; value: number };

  const getChartData = (): Array<PieDatum> | Array<{ name: string; forestCover: number; deforestation: number; area: number; carbon: number }> => {
    if (chartType === 'pie') {
      return filteredData.reduce((acc: PieDatum[], item: any) => {
        const existing = acc.find((x: PieDatum) => x.name === item.region);
        if (existing) {
          existing.value += item.forestCover;
        } else {
          acc.push({ name: item.region, value: item.forestCover });
        }
        return acc;
      }, [] as PieDatum[]);
    }
    
    return filteredData.map((item: any) => ({
      name: item.region,
      forestCover: item.forestCover,
      deforestation: item.deforestation,
      area: item.area / 1000, // Convert to thousands
      carbon: item.carbon / 1000 // Convert to thousands
    }));
  };

  const generateReport = () => {
    // Simulate PDF generation
    const element = document.createElement('a');
    const file = new Blob(['Deforestation Analysis Report\n\nSummary: Forest cover analysis completed\nArea analyzed: 1000 hectares\nDeforestation detected: 15%'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'deforestation-report.pdf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Metrics used in summary statistics
  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const metrics = React.useMemo(() => {
    const avgForest = avg(filteredData.map((d: any) => d.forestCover));
    const avgDefor = avg(filteredData.map((d: any) => d.deforestation));
    const totalArea = sum(filteredData.map((d: any) => d.area));
    return { avgForest, avgDefor, totalArea };
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center space-x-4 group">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <ImageIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">ForestGuard AI Dashboard</h1>
                <p className="text-sm text-gray-600 font-medium">Advanced deforestation analysis & monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={onBackToLanding}
                className="group flex items-center space-x-2 px-6 py-3 text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-xl hover:bg-emerald-50 font-medium"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Home</span>
              </button>
              {modelStatus && (
                <div className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-sm border transition-all duration-300 ${
                  modelStatus.loaded 
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border-emerald-200 shadow-emerald-100' 
                    : 'bg-gradient-to-r from-red-50 to-orange-50 text-red-800 border-red-200 shadow-red-100'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      modelStatus.loaded ? 'bg-emerald-500' : 'bg-red-500'
                    }`}></div>
                    <span>{modelStatus.loaded ? 'AI Model Ready' : 'Loading Model...'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-emerald-100 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2">
            {[
              { id: 'upload', label: 'Forest Analysis', icon: Upload },
              { id: 'timelapse', label: 'Time-lapse Monitor', icon: Play },
              { id: 'dashboard', label: 'Analytics Dashboard', icon: BarChart3 },
              { id: 'news', label: 'Deforestation News', icon: Newspaper }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`group flex items-center space-x-3 py-4 px-6 rounded-t-xl font-semibold text-sm relative overflow-hidden nav-tab ${
                  activeSection === id
                    ? 'nav-tab-active'
                    : 'text-gray-600 hover:text-emerald-700'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 relative z-10 ${
                  activeSection === id ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                <span className="relative z-10">{label}</span>
                {activeSection === id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Section 1: Image Upload & Processing */}
        {activeSection === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Deforestation Detection Analysis
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Upload before and after satellite images to detect deforestation changes
              </p>
            </div>

            {!comparisonResult && !loading && (
              <div className="space-y-8">
                {/* Before Image Upload */}
                <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Before Image</h3>
                  <div
                    {...beforeDropzone.getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
                      beforeDropzone.isDragActive
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                    }`}
                  >
                    <input {...beforeDropzone.getInputProps()} />
                    {beforeImagePreview ? (
                      <div className="text-center">
                        <img
                          src={beforeImagePreview}
                          alt="Before image preview"
                          className="max-w-full max-h-64 mx-auto rounded-lg mb-4"
                        />
                        <p className="text-green-600 font-medium">Before image uploaded successfully</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          {beforeDropzone.isDragActive ? 'Drop the image here' : 'Drag & drop before image'}
                        </p>
                        <p className="text-gray-600">or click to select a file</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* After Image Upload */}
                <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload After Image</h3>
                  <div
                    {...afterDropzone.getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
                      afterDropzone.isDragActive
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                    }`}
                  >
                    <input {...afterDropzone.getInputProps()} />
                    {afterImagePreview ? (
                      <div className="text-center">
                        <img
                          src={afterImagePreview}
                          alt="After image preview"
                          className="max-w-full max-h-64 mx-auto rounded-lg mb-4"
                        />
                        <p className="text-green-600 font-medium">After image uploaded successfully</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          {afterDropzone.isDragActive ? 'Drop the image here' : 'Drag & drop after image'}
                        </p>
                        <p className="text-gray-600">or click to select a file</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    onClick={analyzeImages}
                    disabled={!beforeImage || !afterImage}
                    className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all ${
                      beforeImage && afterImage
                        ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Analyze Images for Deforestation
                  </button>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {loading && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    ref={progressRef}
                    className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: '0%' }}
                  ></div>
                </div>
                <div className="text-center">
                  <LoadingSpinner />
                  <h3 className="text-xl font-semibold text-gray-900 mt-4">
                    Analyzing Images...
                  </h3>
                  <p className="text-gray-600 mt-2">
                    AI is comparing before and after images
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {comparisonResult && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">Analysis Results</h3>
                  <button
                    onClick={resetAnalysis}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Analyze New Images</span>
                  </button>
                </div>

                {/* Detection Result */}
                <div className={`p-6 rounded-lg ${
                  comparisonResult.deforestationDetected 
                    ? 'bg-red-50 border border-red-200' 
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-center space-x-3 mb-4">
                    {comparisonResult.deforestationDetected ? (
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    ) : (
                      <BarChart3 className="w-8 h-8 text-green-600" />
                    )}
                    <div>
                      <h4 className={`text-2xl font-bold ${
                        comparisonResult.deforestationDetected ? 'text-red-800' : 'text-green-800'
                      }`}>
                        {comparisonResult.deforestationDetected ? 'Deforestation Detected' : 'No Deforestation Detected'}
                      </h4>
                      <p className={`text-lg ${
                        comparisonResult.deforestationDetected ? 'text-red-600' : 'text-green-600'
                      }`}>
                        Confidence: {comparisonResult.confidence}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Side-by-side Comparison */}
                <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-6">Before vs After Comparison</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-lg font-medium text-gray-900 mb-4">Before Image</h5>
                      {comparisonResult.beforeAnalysis && (
                        <ImageGallery
                          originalImage={comparisonResult.beforeAnalysis.original_image}
                          segmentationMask={comparisonResult.beforeAnalysis.segmentation_mask}
                          overlay={comparisonResult.beforeAnalysis.overlay}
                        />
                      )}
                    </div>
                    <div>
                      <h5 className="text-lg font-medium text-gray-900 mb-4">After Image</h5>
                      {comparisonResult.afterAnalysis && (
                        <ImageGallery
                          originalImage={comparisonResult.afterAnalysis.original_image}
                          segmentationMask={comparisonResult.afterAnalysis.segmentation_mask}
                          overlay={comparisonResult.afterAnalysis.overlay}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Before Analysis</h4>
                    {comparisonResult.beforeAnalysis && (
                      <ClassDistribution
                        classPercentages={comparisonResult.beforeAnalysis.class_percentages}
                        originalSize={comparisonResult.beforeAnalysis.original_size}
                        predictionSize={comparisonResult.beforeAnalysis.prediction_size}
                      />
                    )}
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">After Analysis</h4>
                    {comparisonResult.afterAnalysis && (
                      <ClassDistribution
                        classPercentages={comparisonResult.afterAnalysis.class_percentages}
                        originalSize={comparisonResult.afterAnalysis.original_size}
                        predictionSize={comparisonResult.afterAnalysis.prediction_size}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Analysis Failed
                  </h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={resetAnalysis}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 2: Time-lapse Visualization */}
        {activeSection === 'timelapse' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Time-lapse Forest Monitoring
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Upload multiple historical images to create animated time-lapse sequences
              </p>
            </div>

            {/* Upload Section */}
            {historicalImages.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Historical Images</h3>
                <div
                  {...historicalDropzone.getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
                    historicalDropzone.isDragActive
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  <input {...historicalDropzone.getInputProps()} />
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {historicalDropzone.isDragActive ? 'Drop images here' : 'Drag & drop multiple images'}
                    </p>
                    <p className="text-gray-600 mb-4">or click to select files</p>
                    <p className="text-sm text-gray-500">
                      Upload images in chronological order (oldest to newest)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Image Thumbnails */}
            {historicalPreviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Uploaded Images ({historicalPreviews.length})
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={analyzeHistoricalImages}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    >
                      {loading ? 'Analyzing...' : 'Analyze All Images'}
                    </button>
                    <button
                      onClick={clearHistoricalData}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {historicalPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        currentFrame === index
                          ? 'border-green-500 ring-2 ring-green-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => goToFrame(index)}
                    >
                      <img
                        src={preview}
                        alt={`Historical image ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                        Frame {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time-lapse Player */}
            {historicalAnalysis.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Time-lapse Player</h3>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={prevFrame}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={togglePlayPause}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={nextFrame}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Display */}
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  {historicalAnalysis[currentFrame] && (
                    <ImageGallery
                      originalImage={historicalAnalysis[currentFrame].original_image}
                      segmentationMask={historicalAnalysis[currentFrame].segmentation_mask}
                      overlay={historicalAnalysis[currentFrame].overlay}
                    />
                  )}
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Frame:</span>
                      <input
                        type="range"
                        min="0"
                        max={historicalAnalysis.length - 1}
                        value={currentFrame}
                        onChange={(e) => goToFrame(Number(e.target.value))}
                        className="w-64"
                      />
                      <span className="text-sm text-gray-600">
                        {currentFrame + 1} / {historicalAnalysis.length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Speed:</span>
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value={2000}>0.5x</option>
                        <option value={1000}>1x</option>
                        <option value={500}>2x</option>
                        <option value={250}>4x</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{isPlaying ? 'Playing...' : 'Paused'}</span>
                    {historicalAnalysis[currentFrame] && (
                      <span>
                        Forest: {historicalAnalysis[currentFrame].class_percentages.forest?.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Frame Details Panel */}
            {historicalAnalysis.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Frame Analysis Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {historicalAnalysis.map((analysis, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        currentFrame === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => goToFrame(index)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Frame {index + 1}</h4>
                        <div className={`w-3 h-3 rounded-full ${
                          currentFrame === index ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year:</span>
                          <span className="font-medium">
                            {new Date(Date.now() - (index + 1) * 30 * 24 * 60 * 60 * 1000).getFullYear()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Forest:</span>
                          <span className="font-medium text-green-600">
                            {analysis.class_percentages.forest?.toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Water:</span>
                          <span className="font-medium text-blue-600">
                            {analysis.class_percentages.water?.toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Urban:</span>
                          <span className="font-medium text-gray-600">
                            {analysis.class_percentages.urban?.toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Agriculture:</span>
                          <span className="font-medium text-yellow-600">
                            {analysis.class_percentages.agriculture?.toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Road:</span>
                          <span className="font-medium text-gray-500">
                            {analysis.class_percentages.road?.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          {index === 0 && "Baseline - Original forest coverage"}
                          {index === 1 && "Early changes - Initial deforestation"}
                          {index === 2 && "Mid-period - Significant changes"}
                          {index === 3 && "Recent - Current state"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Current Frame Summary */}
                {historicalAnalysis[currentFrame] && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Current Frame Summary (Frame {currentFrame + 1})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {historicalAnalysis[currentFrame].class_percentages.forest?.toFixed(1)}%
                        </div>
                        <div className="text-gray-600">Forest</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {historicalAnalysis[currentFrame].class_percentages.water?.toFixed(1)}%
                        </div>
                        <div className="text-gray-600">Water</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {historicalAnalysis[currentFrame].class_percentages.urban?.toFixed(1)}%
                        </div>
                        <div className="text-gray-600">Urban</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {historicalAnalysis[currentFrame].class_percentages.agriculture?.toFixed(1)}%
                        </div>
                        <div className="text-gray-600">Agriculture</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-500">
                          {historicalAnalysis[currentFrame].class_percentages.road?.toFixed(1)}%
                        </div>
                        <div className="text-gray-600">Road</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <LoadingSpinner />
                <h3 className="text-xl font-semibold text-gray-900 mt-4">
                  Analyzing Historical Images...
                </h3>
                <p className="text-gray-600 mt-2">
                  Processing {historicalImages.length} images
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Analysis Failed
                  </h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 3: Interactive Dashboard with Dynamic Charts */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Interactive Dashboard with Dynamic Charts
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Explore forest data visually with interactive charts and tables for filtering, sorting, and comparison
              </p>
            </div>

            {/* Filter Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Filter Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Regions</option>
                    {getUniqueValues('region').map((region: string) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Forest Type</label>
                  <select
                    value={selectedForestType}
                    onChange={(e) => setSelectedForestType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Types</option>
                    {getUniqueValues('forestType').map((type: string) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text_sm font-medium text-gray-700 mb-2">Time Period</label>
                  <select
                    value={selectedTimePeriod}
                    onChange={(e) => setSelectedTimePeriod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Periods</option>
                    {getUniqueValues('timePeriod').map((period: string) => (
                      <option key={period} value={period}>{period}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Graph</option>
                    <option value="pie">Pie Chart</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Charts */}
            <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Forest Statistics Visualization</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'pie' ? (
                    <PieChart>
                      <Pie
                        data={getChartData() as PieDatum[]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }: PieDatum) => `${name}: ${value.toFixed(1)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(getChartData() as PieDatum[]).map((entry: PieDatum, index: number) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Forest Cover']} />
                    </PieChart>
                  ) : chartType === 'line' ? (
                    <LineChart data={getChartData() as any[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="forestCover" stroke="#10B981" strokeWidth={2} name="Forest Cover %" />
                      <Line type="monotone" dataKey="deforestation" stroke="#EF4444" strokeWidth={2} name="Deforestation %" />
                    </LineChart>
                  ) : (
                    <BarChart data={getChartData() as any[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="forestCover" fill="#10B981" name="Forest Cover %" />
                      <Bar dataKey="deforestation" fill="#EF4444" name="Deforestation %" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Forest Data Table</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forest Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forest Cover %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deforestation %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area (km²)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carbon (tons)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.region}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.forestType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.timePeriod}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.forestCover >= 70 ? 'bg-green-100 text-green-800' :
                            item.forestCover >= 50 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.forestCover}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.deforestation >= 4 ? 'bg-red-100 text-red-800' :
                            item.deforestation >= 2 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.deforestation}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.area.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.carbon.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 cursor-pointer group">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-all duration-300 group-hover:scale-110">
                      <BarChart3 className="w-4 h-4 text-green-600 group-hover:text-emerald-700" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 group-hover:text-emerald-600 transition-colors duration-300">Total Regions</p>
                    <p className="text-2xl font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors duration-300">{filteredData.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 cursor-pointer group">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-all duration-300 group-hover:scale-110">
                      <TrendingUp className="w-4 h-4 text-blue-600 group-hover:text-emerald-700" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 group-hover:text-emerald-600 transition-colors duration-300">Avg Forest Cover</p>
                    <p className="text-2xl font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors duration-300">
                      {metrics.avgForest.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 cursor-pointer group">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-all duration-300 group-hover:scale-110">
                      <AlertTriangle className="w-4 h-4 text-red-600 group-hover:text-emerald-700" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 group-hover:text-emerald-600 transition-colors duration-300">Avg Deforestation</p>
                    <p className="text-2xl font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors duration-300">
                      {metrics.avgDefor.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 cursor-pointer group">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-all duration-300 group-hover:scale-110">
                      <Ruler className="w-4 h-4 text-purple-600 group-hover:text-emerald-700" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 group-hover:text-emerald-600 transition-colors duration-300">Total Area</p>
                    <p className="text-2xl font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors duration-300">
                      {(metrics.totalArea / 1_000_000).toFixed(1)}M km²
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Deforestation News Feed */}
        {activeSection === 'news' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🌐 Global Deforestation News Feed
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Stay informed with the latest deforestation news, conservation efforts, and environmental policies from around the world
              </p>
            </div>

            {/* News Controls */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search deforestation news..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Category Filter */}
                <div className="flex items-center space-x-4">
                  <Filter className="text-gray-500 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="breaking">Breaking News</option>
                    <option value="conservation">Conservation</option>
                    <option value="policy">Policy & Law</option>
                    <option value="research">Research</option>
                    <option value="wildfire">Wildfires</option>
                  </select>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={() => fetchNews(selectedCategory !== 'all' ? selectedCategory : undefined)}
                  disabled={newsLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${newsLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Last Updated & Trending Topics */}
              <div className="mt-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="text-sm text-gray-500">
                  <Globe className="inline w-4 h-4 mr-1" />
                  Last updated: {newsRefreshTime.toLocaleString()}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500 mr-2">Trending:</span>
                  {trendingTopics.slice(0, 4).map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(topic);
                        searchNews(topic);
                      }}
                      className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs rounded-full hover:from-emerald-200 hover:to-teal-200 transition-all duration-200 transform hover:scale-105"
                    >
                      #{topic.replace(' ', '')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {newsLoading && (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <LoadingSpinner />
                  <p className="mt-4 text-gray-600">Loading latest deforestation news...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {newsError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load News</h3>
                <p className="text-red-600 mb-4">{newsError}</p>
                <button
                  onClick={() => fetchNews()}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* News Articles */}
            {!newsLoading && !newsError && newsArticles.length > 0 && (
              <div className="space-y-8">
                {/* Featured Article */}
                {newsArticles.length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center space-x-2 mb-6">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <h3 className="text-2xl font-bold text-gray-900">Breaking News</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-red-500 to-transparent"></div>
                    </div>
                    <NewsCard
                      article={newsArticles[0]}
                      onReadMore={handleNewsRead}
                      featured={true}
                    />
                  </div>
                )}

                {/* Regular Articles Grid */}
                {newsArticles.length > 1 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-6">
                      <Newspaper className="w-6 h-6 text-emerald-600" />
                      <h3 className="text-2xl font-bold text-gray-900">Latest Updates</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-emerald-500 to-transparent"></div>
                    </div>
                    
                    <div className="grid gap-6">
                      {newsArticles.slice(1).map((article) => (
                        <NewsCard
                          key={article.id}
                          article={article}
                          onReadMore={handleNewsRead}
                          featured={false}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Load More Button */}
                <div className="text-center pt-8">
                  <button
                    onClick={() => fetchNews(selectedCategory !== 'all' ? selectedCategory : undefined)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Load More Articles</span>
                  </button>
                </div>
              </div>
            )}

            {/* No Articles Found */}
            {!newsLoading && !newsError && newsArticles.length === 0 && (
              <div className="text-center py-16">
                <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Articles Found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? `No results for "${searchQuery}"` : 'No articles available for this category'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    fetchNews();
                  }}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-200"
                >
                  Show All News
                </button>
              </div>
            )}

            {/* News Sources & Disclaimer */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">News Sources & Information</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Trusted Sources Include:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Environmental Times</li>
                    <li>• Reuters Environmental</li>
                    <li>• Nature Conservation Today</li>
                    <li>• Global Forest Watch</li>
                    <li>• Conservation Weekly</li>
                    <li>• Indigenous Rights Today</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Article Categories:</h5>
                  <div className="flex flex-wrap gap-2">
                    {['Breaking', 'Conservation', 'Policy', 'Research', 'Wildfires'].map((cat) => (
                      <span key={cat} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Articles are updated in real-time from trusted environmental and news sources worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

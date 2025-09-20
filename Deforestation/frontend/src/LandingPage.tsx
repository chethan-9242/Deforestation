import React, { useEffect, useState } from 'react';
import { Upload, Shield, BarChart3, Clock, MapPin, Leaf, ArrowRight, CheckCircle, Globe, Users, Zap, Sparkles, TreePine, Eye, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({ accuracy: 0, monitoring: 0, images: 0, countries: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    // Animate counters
    const animateCounter = (target: number, key: keyof typeof counters, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCounters(prev => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 16);
    };

    setTimeout(() => {
      animateCounter(95, 'accuracy');
      animateCounter(24, 'monitoring');
      animateCounter(1000, 'images');
      animateCounter(50, 'countries');
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <TreePine className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">ForestGuard AI</span>
                <div className="text-xs text-gray-500 font-medium tracking-wide">Protecting Nature with AI</div>
              </div>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group">
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 rounded-full px-6 py-3 text-emerald-800 font-medium shadow-sm">
                <Sparkles className="w-5 h-5 mr-2 text-emerald-600" />
                <span className="text-sm font-semibold">AI-Powered Forest Protection</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-8 leading-tight">
              <span className="block mb-4">Protect Our</span>
              <span className="block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
                Forests
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 text-gray-700">with AI Intelligence</span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Revolutionary satellite image analysis powered by advanced AI. 
              <span className="text-emerald-600 font-medium">Monitor deforestation</span> in real-time, 
              <span className="text-teal-600 font-medium">detect environmental threats</span>, and 
              <span className="text-green-600 font-medium">protect our planet's future</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button 
                onClick={onGetStarted}
                className="group bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center space-x-3 min-w-[280px]"
              >
                <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                  <Eye className="w-6 h-6" />
                </div>
                <span>Start Forest Analysis</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button className="group border-3 border-emerald-600 text-emerald-700 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 min-w-[240px]">
                <Globe className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>Watch Demo</span>
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {counters.accuracy}%
                </div>
                <div className="text-gray-600 font-medium">AI Accuracy</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {counters.monitoring}/7
                </div>
                <div className="text-gray-600 font-medium">Monitoring</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {counters.images.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Images Analyzed</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {counters.countries}+
                </div>
                <div className="text-gray-600 font-medium">Countries</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Floating Elements */}
        <div className="absolute top-32 left-20 w-32 h-32 bg-gradient-to-r from-emerald-300/30 to-green-300/30 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-48 right-32 w-24 h-24 bg-gradient-to-r from-teal-300/30 to-cyan-300/30 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-gradient-to-r from-green-300/30 to-emerald-300/30 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '2s' }}></div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to protect our forests using cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Upload Satellite Image</h3>
              <p className="text-gray-600">
                Simply drag and drop your satellite imagery or select from your device. 
                Our system supports all major image formats.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. AI Analyzes Changes</h3>
              <p className="text-gray-600">
                Our advanced AI algorithms analyze forest cover changes, detect deforestation patterns, 
                and identify potential threats in real-time.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. View Detailed Report</h3>
              <p className="text-gray-600">
                Get comprehensive reports with interactive maps, charts, and actionable insights 
                to make informed environmental decisions.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full px-6 py-2 text-emerald-800 font-medium shadow-sm mb-6">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">Advanced Capabilities</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Revolutionary AI Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Cutting-edge technology designed for comprehensive forest monitoring and protection
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-time Detection</h3>
              <p className="text-gray-600 leading-relaxed">
                Instant deforestation detection with <span className="text-red-600 font-semibold">95% accuracy</span> using state-of-the-art AI models and satellite imagery.
              </p>
              <div className="mt-4 text-red-600 font-medium text-sm">→ Immediate Alerts</div>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Time-lapse Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Track forest changes over time with <span className="text-blue-600 font-semibold">historical data</span> analysis and trend prediction algorithms.
              </p>
              <div className="mt-4 text-blue-600 font-medium text-sm">→ Predictive Insights</div>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive reports with <span className="text-emerald-600 font-semibold">interactive visualizations</span> and actionable environmental insights.
              </p>
              <div className="mt-4 text-emerald-600 font-medium text-sm">→ Detailed Reports</div>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Precision Mapping</h3>
              <p className="text-gray-600 leading-relaxed">
                <span className="text-purple-600 font-semibold">GPS-accurate</span> location tracking with precise area calculations and geographic boundary analysis.
              </p>
              <div className="mt-4 text-purple-600 font-medium text-sm">→ Exact Coordinates</div>
            </div>
          </div>
          
          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Trend Analysis</h4>
              <p className="text-gray-600">Advanced algorithms predict future deforestation patterns</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Global Coverage</h4>
              <p className="text-gray-600">Monitor forests worldwide with satellite integration</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Collaborative Platform</h4>
              <p className="text-gray-600">Share insights with conservation teams globally</p>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-emerald-300/10 to-teal-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-r from-green-300/10 to-emerald-300/10 rounded-full blur-3xl"></div>
      </section>

      {/* About Project Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Protecting Our Planet's Future
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Deforestation is one of the greatest environmental challenges of our time. 
                Every year, we lose millions of hectares of forest, threatening biodiversity, 
                climate stability, and the livelihoods of millions of people.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our AI-powered platform provides the tools needed to monitor, detect, and 
                prevent deforestation in real-time, empowering governments, organizations, 
                and individuals to take action and protect our forests.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center group">
                  <div className="text-4xl font-bold text-emerald-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                    {counters.accuracy}%
                  </div>
                  <div className="text-gray-600 font-medium">Detection Accuracy</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-teal-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                    {counters.monitoring}/7
                  </div>
                  <div className="text-gray-600 font-medium">Real-time Monitoring</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                    {counters.images.toLocaleString()}+
                  </div>
                  <div className="text-gray-600 font-medium">Images Analyzed</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-green-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                    {counters.countries}+
                  </div>
                  <div className="text-gray-600 font-medium">Countries Protected</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Choose ForestGuard AI?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span>Advanced machine learning algorithms</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span>Real-time processing and alerts</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span>User-friendly interface</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span>Comprehensive reporting tools</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span>Global satellite data integration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 text-white font-medium shadow-sm mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold">Join the Conservation Movement</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Save Our
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Planet's Forests?
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-emerald-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join <span className="text-yellow-300 font-semibold">10,000+</span> environmentalists, researchers, and organizations 
            worldwide who are already using ForestGuard AI to protect our planet's most precious ecosystems.
          </p>
          
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-16">
            <button 
              onClick={onGetStarted}
              className="group bg-white text-emerald-700 px-12 py-6 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center space-x-4 min-w-[320px]"
            >
              <div className="p-2 bg-emerald-600 text-white rounded-full group-hover:bg-emerald-700 transition-colors duration-300">
                <Upload className="w-6 h-6" />
              </div>
              <span>Start Forest Analysis</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="group border-2 border-white text-white px-12 py-6 rounded-2xl text-xl font-bold hover:bg-white hover:text-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-4 min-w-[280px]">
              <Users className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Join Community</span>
            </button>
          </div>
          
          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2">10,000+</div>
              <div className="text-emerald-100 text-sm font-medium">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2">150+</div>
              <div className="text-emerald-100 text-sm font-medium">Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2">5M+</div>
              <div className="text-emerald-100 text-sm font-medium">Hectares Monitored</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2">24/7</div>
              <div className="text-emerald-100 text-sm font-medium">Global Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">ForestGuard AI</span>
              </div>
              <p className="text-gray-400 mb-4">
                Protecting forests worldwide through AI-powered monitoring and analysis.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ForestGuard AI. All rights reserved. Made with ❤️ for the planet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

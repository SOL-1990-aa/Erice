import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, TrendingUp, Info, Globe, ExternalLink, Lightbulb, Wand2, ChevronDown } from 'lucide-react';
import { Hero } from './components/layout/Hero';
import { SearchBar } from './components/search/SearchBar';
import { EntityCard } from './components/discovery/EntityCard';
import { DISCOVERY_ENTITIES } from './constants';
import { EntityDiscovery, FilterOptions } from './types';
import { Button } from './components/ui/Button';
import { cn } from './lib/utils';
import { SerpResult } from './services/serpService';
import { ImageGenerator } from './components/discovery/ImageGenerator';
import { getRecommendations } from './services/recommendationService';
import { ProductVisualizerModal } from './components/discovery/ProductVisualizerModal';

export default function App() {
  const [entities, setEntities] = useState<EntityDiscovery[]>(DISCOVERY_ENTITIES);
  const [webResults, setWebResults] = useState<SerpResult[]>([]);
  const [visibleWebResultsCount, setVisibleWebResultsCount] = useState(6);
  const [selectedResult, setSelectedResult] = useState<SerpResult | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filters, setFilters] = useState<FilterOptions>({ category: 'all', tags: [], dateRange: 'all' });
  const [recommendations, setRecommendations] = useState<EntityDiscovery[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  // Load history and get recommendations
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('erce_history') || '[]');
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      getRecommendations(history).then(setRecommendations);
    }
  }, [history]);

  const handleSearchResults = (results: EntityDiscovery[], insight: string, searchWebResults: SerpResult[]) => {
    setEntities(results.length > 0 ? results : DISCOVERY_ENTITIES);
    setAiInsight(insight);
    setWebResults(searchWebResults);
    setVisibleWebResultsCount(6);

    // Update history
    const newHistory = [insight, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('erce_history', JSON.stringify(newHistory));
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const categories = ['all', 'fashion', 'streetwear', ' textile', 'research'];

  const filteredEntities = entities.filter(e => {
    const categoryMatch = activeCategory === 'all' || e.category.trim() === activeCategory.trim();
    
    // Advanced Filters
    const tagMatch = filters.tags.length === 0 || filters.tags.some(t => e.tags.includes(t));
    
    let dateMatch = true;
    if (filters.dateRange === 'recent') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      dateMatch = new Date(e.createdAt) >= oneMonthAgo;
    } else if (filters.dateRange === 'past-year') {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      dateMatch = new Date(e.createdAt) >= oneYearAgo;
    }

    return categoryMatch && tagMatch && dateMatch;
  });

  return (
    <div className="min-h-screen bg-chalk selection:bg-red-500/30 selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-8">
        <div className="container mx-auto flex justify-between items-center h-12 px-6 glass-morphism rounded-full border-black/5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <span className="font-black tracking-tighter text-lg text-black">ERCE</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-bold text-zinc-500">
            <a href="#" className="hover:text-red-500 transition-colors">Platform</a>
            <a href="#fashion-lab" className="hover:text-red-500 transition-colors">Design Lab</a>
            <a href="#" className="hover:text-red-500 transition-colors">UNESCO Study</a>
            <a href="#" className="hover:text-red-500 transition-colors">Company</a>
          </div>

          <Button variant="primary" size="sm">Connect Wallets</Button>
        </div>
      </nav>

      <Hero />

      {/* Floating Search Hub */}
      <div className="sticky top-24 z-50 px-6 -mt-10 mb-20">
        <SearchBar 
          onResults={handleSearchResults} 
          isLoading={isLoading} 
          setIsLoading={setIsLoading}
          onFilterChange={handleFilterChange}
        />
      </div>

      <main className="container mx-auto px-6 pb-32">
        {/* AI Insight Bar */}
        <AnimatePresence>
          {aiInsight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto mb-16 p-6 glass-card border-red-500/20 bg-red-500/5 flex gap-4 items-start"
            >
              <div className="p-2 rounded-lg bg-red-500/20">
                <Sparkles className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2">AI Cognitive Insight</p>
                <div className="text-black leading-relaxed font-bold italic">
                  "{aiInsight}"
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Personalized Recommendations */}
        {recommendations.length > 0 && !aiInsight && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <div className="flex items-center gap-2 text-blue-600 text-[10px] uppercase tracking-widest font-black mb-6">
              <Lightbulb className="w-3 h-3 text-red-500" />
              Tailored For Your Journey
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((entity, idx) => (
                <div key={entity.id} className="h-[300px]">
                  <EntityCard entity={entity} index={idx} />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Discovery Filter */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 text-[10px] uppercase tracking-widest font-black">
              <TrendingUp className="w-3 h-3 text-red-500" />
              Intelligence Feed
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-black">Trending Discoveries</h2>
          </div>

          <div className="flex gap-2 p-1 bg-black/5 rounded-xl border border-black/5 overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-black transition-all whitespace-nowrap",
                  activeCategory === cat ? "bg-red-500 text-white" : "text-zinc-500 hover:text-black"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Discovery Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredEntities.map((entity, index) => (
            <div 
              key={entity.id} 
              className={cn(
                "h-[450px]",
                index === 0 ? "lg:col-span-2" : "",
                index === 3 ? "lg:col-span-3 h-[350px]" : ""
              )}
            >
              <EntityCard entity={entity} index={index} />
            </div>
          ))}
        </div>

        {/* Image Generator */}
        <ImageGenerator />

        {/* Web Intelligence Section */}
        {webResults.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 mb-20"
          >
            <div className="flex items-center gap-2 text-red-500 text-[10px] uppercase tracking-widest font-black mb-6">
              <Globe className="w-3 h-3" />
              Live Web Intelligence
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {webResults.slice(0, visibleWebResultsCount).map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (idx % 6) * 0.1 }}
                  >
                    <div className="glass-card flex p-0 h-[180px] overflow-hidden group hover:bg-white/50 transition-all border-none relative">
                      {result.thumbnail && (
                        <div className="w-32 h-full hidden sm:block">
                          <img 
                            src={result.thumbnail} 
                            alt={result.title} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2 gap-4">
                            <a 
                              href={result.link} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-sm font-bold text-black group-hover:text-red-500 transition-colors line-clamp-1"
                            >
                              {result.title}
                            </a>
                            <ExternalLink className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                          </div>
                          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
                            {result.snippet}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
                          <div className="flex items-center gap-3">
                            {result.price && (
                              <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded shadow-sm shadow-red-500/20">
                                {result.price}
                              </span>
                            )}
                            <button
                              onClick={() => setSelectedResult(result)}
                              className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <Wand2 className="w-3 h-3" />
                              Visualize
                            </button>
                            {result.rating && (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                                <span className="text-yellow-500">★</span>
                                {result.rating}
                              </div>
                            )}
                          </div>
                          <div className="text-[9px] text-blue-600 font-black tracking-widest uppercase">
                            {result.source}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {webResults.length > visibleWebResultsCount && visibleWebResultsCount < 12 && (
              <div className="mt-12 text-center">
                <Button 
                  variant="secondary" 
                  className="gap-2 px-8"
                  onClick={() => setVisibleWebResultsCount(prev => Math.min(prev + 6, 12))}
                >
                  <ChevronDown className="w-4 h-4" />
                  Load More Intelligence
                </Button>
              </div>
            )}
          </motion.section>
        )}

        <ProductVisualizerModal 
          isOpen={!!selectedResult} 
          onClose={() => setSelectedResult(null)}
          title={selectedResult?.title || ''}
          description={selectedResult?.snippet || ''}
        />

        {/* Empty State */}
        {filteredEntities.length === 0 && (
          <div className="py-20 text-center glass-card border-dashed">
            <Info className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-light">No specific entities found for this query. AI is re-indexing...</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-lg" />
                <span className="text-2xl font-black tracking-tighter text-black">ERCE EXPLORER</span>
              </div>
              <p className="text-zinc-600 max-w-xs font-medium leading-relaxed">
                The future of entity intelligence. Blending high-fashion curated discovery with global research data.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs uppercase tracking-[0.2em] font-black text-blue-600">Organization</h4>
              <ul className="space-y-3 text-sm text-zinc-600 font-medium">
                <li><a href="#" className="hover:text-red-500 transition-colors">Ercie Fashion</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Erce Clothing</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Ercea Textiles</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">ERCE Research</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs uppercase tracking-[0.2em] font-black text-blue-600">Newsletter</h4>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="bg-black/5 border border-black/10 rounded-lg px-4 py-2 text-xs outline-none focus:border-red-500 transition-colors w-full text-black font-medium"
                />
                <Button size="sm">Join</Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10 border-t border-black/5 text-[10px] text-zinc-500 uppercase tracking-widest font-black">
            <p>© 2026 Erce Explorer. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-red-500">Privacy</a>
              <a href="#" className="hover:text-red-500">Terms</a>
              <a href="#" className="hover:text-red-500">Intelligence Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Search, Sparkles, X, Globe, SlidersHorizontal, Calendar, Tag as TagIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { performAISearch } from '../../services/geminiService';
import { searchWeb, SerpResult } from '../../services/serpService';
import { EntityDiscovery, FilterOptions } from '../../types';

interface SearchBarProps {
  onResults: (results: EntityDiscovery[], insight: string, webResults: SerpResult[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onFilterChange: (filters: FilterOptions) => void;
}

export function SearchBar({ onResults, isLoading, setIsLoading, onFilterChange }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    tags: [],
    dateRange: 'all'
  });
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const [aiData, webData] = await Promise.all([
        performAISearch(query),
        searchWeb(query)
      ]);
      
      onResults(aiData.matches, aiData.aiInsight, webData);
    } catch (error) {
      console.error("Search composite error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const allTags = ['Luxury', 'Streetwear', 'UK Brand', 'French Design', 'Education', 'Data Analysis'];

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50">
      <div className="flex flex-col gap-4">
        <motion.form
          onSubmit={handleSearch}
          animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
          className={cn(
            "relative group flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-500",
            "glass-morphism border-black/10 shadow-2xl shadow-red-500/5",
            isFocused ? "bg-white/40 ring-2 ring-red-500/20" : "bg-white/20"
          )}
        >
          <Search className={cn(
            "w-5 h-5 transition-colors duration-300",
            isFocused ? "text-red-500" : "text-zinc-500"
          )} />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search fashion, research, or labels..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-black placeholder:text-zinc-400 font-sans font-medium"
          />

          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                type="button"
                onClick={() => setQuery('')}
                className="p-1 hover:bg-black/5 rounded-full text-zinc-400"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-2 rounded-full transition-colors",
              showFilters ? "bg-red-500 text-white" : "hover:bg-black/5 text-zinc-500"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            type="submit"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
              query.trim() ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20" : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </button>
        </motion.form>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-6 border-black/5 shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-zinc-400">
                    <Calendar className="w-3 h-3" />
                    Timeline Filter
                  </div>
                  <div className="flex gap-2">
                    {(['all', 'recent', 'past-year'] as const).map(range => (
                      <button
                        key={range}
                        onClick={() => setFilters(prev => ({ ...prev, dateRange: range }))}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                          filters.dateRange === range 
                            ? "bg-red-500 border-red-500 text-white" 
                            : "bg-white/5 border-black/5 text-zinc-500 hover:bg-black/5"
                        )}
                      >
                        {range.replace('-', ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-zinc-400">
                    <TagIcon className="w-3 h-3" />
                    Attribute Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight transition-all",
                          filters.tags.includes(tag)
                            ? "bg-blue-600 text-white"
                            : "bg-black/5 text-zinc-400 hover:text-black"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isFocused && !query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-4 p-4 glass-card border-black/5 shadow-xl"
          >
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3 px-2 font-black">Curated Vectors</p>
            <div className="flex flex-wrap gap-2">
              {['Luxury Silks', 'Global UNESCO Data', 'London Streetwear', 'Paris Fashion Lab'].map((item) => (
                <button
                  key={item}
                  onClick={() => setQuery(item)}
                  className="px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-xs font-medium transition-colors text-black"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

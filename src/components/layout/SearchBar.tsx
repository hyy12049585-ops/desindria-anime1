// src/components/layout/SearchBar.tsx
import { useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '@/hooks/useSearch';
import { SearchResult } from '@/types/search.types';

export const SearchBar = () => {
  const {
    query,
    results,
    recentSearches,
    isLoading,
    isOpen,
    selectedIndex,
    setQuery,
    setIsOpen,
    addToRecentSearches,
    clearRecentSearches,
    handleKeyDown
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleResultClick = (result: SearchResult) => {
    addToRecentSearches(result.title);
    setIsOpen(false);
    window.location.href = `/anime/${result.id}`;
  };

  const handleRecentClick = (searchQuery: string) => {
    setQuery(searchQuery);
    inputRef.current?.focus();
  };

  const showRecent = isOpen && !query && recentSearches.length > 0;
  const showResults = isOpen && query && (results.length > 0 || !isLoading);

  return (
    <div className="relative flex-1 max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="جستجوی انیمه، شخصیت، ژانر..."
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {isLoading && (
          <div className="absolute left-12 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {(showRecent || showResults) && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Recent Searches */}
            {showRecent && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>جستجوهای اخیر</span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-white transition-colors"
                  >
                    پاک کردن
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(search.query)}
                      className="w-full text-right px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-300 text-sm"
                    >
                      {search.query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {showResults && (
              <div className="max-h-[400px] overflow-y-auto">
                {results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          index === selectedIndex
                            ? 'bg-purple-500/20 border border-purple-500/50'
                            : 'hover:bg-gray-700/50'
                        }`}
                      >
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-12 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 text-right">
                          <h4 className="text-white font-medium text-sm">
                            {result.title}
                          </h4>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {result.titleEnglish}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            {result.year && <span>{result.year}</span>}
                            {result.episodes && (
                              <span>{result.episodes} قسمت</span>
                            )}
                            {result.rating && (
                              <span className="flex items-center gap-1">
                                ⭐ {result.rating}
                              </span>
                            )}
                          </div>
                        </div>
                        <TrendingUp className="w-4 h-4 text-gray-600" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>نتیجه‌ای یافت نشد</p>
                    <p className="text-sm mt-1">کلمه دیگری را امتحان کنید</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

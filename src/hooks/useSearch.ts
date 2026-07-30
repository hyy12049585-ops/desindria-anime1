// src/hooks/useSearch.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchResult, SearchSuggestion } from '@/types/search.types';
import { searchAnime } from '@/services/search.api';

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
 const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  // Load recent searches
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchAnime(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    setIsOpen(true);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  }, [performSearch]);

  const addToRecentSearches = useCallback((searchQuery: string) => {
    const newSearch: SearchSuggestion = {
      query: searchQuery,
      timestamp: Date.now()
    };

    const updated = [
      newSearch,
      ...recentSearches.filter(s => s.query !== searchQuery)
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }, [recentSearches]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          const selected = results[selectedIndex];
          addToRecentSearches(selected.title);
          // Navigate to anime page
          window.location.href = `/anime/${selected.id}`;
        } else if (query.trim()) {
          addToRecentSearches(query);
          // Navigate to search results page
          window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [isOpen, results, selectedIndex, query, addToRecentSearches]);

  return {
    query,
    results,
    recentSearches,
    isLoading,
    isOpen,
    selectedIndex,
    setQuery: handleQueryChange,
    setIsOpen,
    addToRecentSearches,
    clearRecentSearches,
    handleKeyDown
  };
};

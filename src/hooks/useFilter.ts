// src/hooks/useFilter.ts

import { useState, useCallback, useMemo } from 'react';
import { FilterState, DEFAULT_FILTERS, ContentType, Genre, Studio, AudioSubtitle, SortOption } from '../types/filter.types';

export function useFilter() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const toggleContentType = useCallback((type: ContentType) => {
    setFilters(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type],
    }));
  }, []);

  const toggleGenre = useCallback((genre: Genre) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre],
    }));
  }, []);

  const toggleStudio = useCallback((studio: Studio) => {
    setFilters(prev => ({
      ...prev,
      studios: prev.studios.includes(studio)
        ? prev.studios.filter(s => s !== studio)
        : [...prev.studios, studio],
    }));
  }, []);

  const toggleAudio = useCallback((audio: AudioSubtitle) => {
    setFilters(prev => ({
      ...prev,
      audioSubtitle: prev.audioSubtitle.includes(audio)
        ? prev.audioSubtitle.filter(a => a !== audio)
        : [...prev.audioSubtitle, audio],
    }));
  }, []);

  const setYearRange = useCallback((range: [number, number]) => {
    setFilters(prev => ({ ...prev, yearRange: range }));
  }, []);

  const setSortBy = useCallback((sort: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy: sort }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const activeCount = useMemo(() => {
    let count = 0;
    count += filters.contentTypes.length;
    count += filters.genres.length;
    count += filters.studios.length;
    count += filters.audioSubtitle.length;
    if (filters.yearRange[0] !== 1990 || filters.yearRange[1] !== 2025) count++;
    if (filters.sortBy !== 'newest') count++;
    return count;
  }, [filters]);

  return {
    filters,
    toggleContentType,
    toggleGenre,
    toggleStudio,
    toggleAudio,
    setYearRange,
    setSortBy,
    setSearchQuery,
    clearAll,
    activeCount,
  };
}

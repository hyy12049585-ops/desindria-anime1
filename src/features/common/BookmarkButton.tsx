// src/components/common/BookmarkButton.tsx
import React, { useCallback } from 'react';
import { Bookmark } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import type { WatchlistItem } from '../../contexts/UserContext';

interface BookmarkButtonProps {
  item: {
    id: string;
    title: string;
    image: string;
    type: 'anime' | 'movie' | 'series';
    totalEpisodes?: number;
  };
  size?: number;
  className?: string;
}

export default function BookmarkButton({ item, size = 22, className = '' }: BookmarkButtonProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useUser();
  const inList = isInWatchlist(item.id);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (inList) {
      removeFromWatchlist(item.id);
      return;
    }

    const watchlistItem: WatchlistItem = {
      ...item,
      addedAt: new Date().toISOString(),
      status: 'plan_to_watch',
    };

    addToWatchlist(watchlistItem);
  }, [inList, item, addToWatchlist, removeFromWatchlist]);

  return (
    <button
      onClick={handleClick}
      className={`transition-all duration-300 ${className}`}
      aria-label={inList ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Bookmark
        size={size}
        className={
          inList
            ? 'fill-blue-500 text-blue-500 scale-110 transition-all duration-300'
            : 'text-gray-400 hover:text-blue-400 transition-all duration-300'
        }
      />
    </button>
  );
}

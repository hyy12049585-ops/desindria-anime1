// src/components/common/LikeButton.tsx
import React, { useCallback } from 'react';
import { Heart } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface LikeButtonProps {
  itemId: string;
  size?: number;
  className?: string;
}

export default function LikeButton({ itemId, size = 22, className = '' }: LikeButtonProps) {
  const { isLiked, toggleLike } = useUser();
  const liked = isLiked(itemId);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleLike(itemId);
  }, [itemId, toggleLike]);

  return (
    <button
      onClick={handleClick}
      className={`transition-all duration-300 ${className}`}
      aria-label={liked ? 'Remove from likes' : 'Add to likes'}
    >
      <Heart
        size={size}
        className={
          liked
            ? 'fill-red-500 text-red-500 scale-110 transition-all duration-300'
            : 'text-gray-400 hover:text-red-400 transition-all duration-300'
        }
      />
    </button>
  );
}

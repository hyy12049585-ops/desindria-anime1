import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '@/features/anime/types/anime';

interface CommunityReviewsProps {
  reviews: Review[];
}

const CommunityReviews: React.FC<CommunityReviewsProps> = ({ reviews }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-white mb-4">نظرات جامعه</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
           className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-color)] hover:border-purple-500/50 transition-colors"

          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={review.avatar}
                alt={review.user}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-medium text-sm">{review.user}</p>
                <p className="text-gray-400 text-xs">{review.anime}</p>
              </div>
              <div className="mr-auto flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-sm">{review.rating}</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
              {review.comment}
            </p>
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <span>{review.date}</span>
              <span>❤️ {review.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityReviews;

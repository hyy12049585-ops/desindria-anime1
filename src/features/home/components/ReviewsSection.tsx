// src/components/home/ReviewsSection.tsx
import { motion } from 'framer-motion';
import { MessageCircle, Star, ThumbsUp } from 'lucide-react';
import { Review } from 'src/types/anime';

interface ReviewsSectionProps {
  reviews: Review[];
}

export const ReviewsSection = ({ reviews }: ReviewsSectionProps) => (
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="py-8 px-4 md:px-6"
  >
    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent mb-1 flex items-center gap-2">
      <MessageCircle className="w-5 h-5 text-pink-400" />
      نظرات جامعه
    </h2>
    <p className="text-white/40 text-sm mb-6">آخرین نقدها و نظرات کاربران</p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review, i) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -4 }}
          className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-pink-500/20 transition-all"
        >
          {/* User */}
          <div className="flex items-center gap-3 mb-3">
            <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full object-cover border-2 border-pink-500/30" />
            <div className="flex-1">
              <h4 className="text-white text-sm font-semibold">{review.user}</h4>
              <p className="text-white/40 text-xs">{review.date}</p>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={`w-3 h-3 ${j < Math.floor(review.rating / 2) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                />
              ))}
            </div>
          </div>

          {/* Anime Tag */}
          <span className="inline-block px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded-full mb-2">
            {review.anime}
          </span>

          {/* Comment */}
          <p className="text-white/60 text-sm leading-relaxed line-clamp-3">{review.comment}</p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
            <button className="flex items-center gap-1 text-white/40 hover:text-pink-400 transition-colors text-xs">
              <ThumbsUp className="w-3.5 h-3.5" />
              {review.likes}
            </button>
            <button className="flex items-center gap-1 text-white/40 hover:text-cyan-400 transition-colors text-xs">
              <MessageCircle className="w-3.5 h-3.5" />
              پاسخ
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

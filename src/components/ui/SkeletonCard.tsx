// src/components/ui/SkeletonCard.tsx
import { motion } from 'framer-motion';

export const SkeletonCard = () => (
  <motion.div
    className="flex-shrink-0 w-40 md:w-48 rounded-xl overflow-hidden"
    animate={{ opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    <div className="aspect-[2/3] bg-white/5 rounded-xl" />
    <div className="mt-2 space-y-1.5 px-1">
      <div className="h-3 bg-white/5 rounded w-3/4" />
      <div className="h-2.5 bg-white/5 rounded w-1/2" />
    </div>
  </motion.div>
);

import React from 'react';
import { motion } from 'framer-motion';

interface CommentHeaderProps {
  username: string;
  avatar: string;
  createdAt: Date;
  isPinned?: boolean;
}

const CommentHeader: React.FC<CommentHeaderProps> = ({
  username,
  avatar,
  createdAt,
  isPinned = false,
}) => {
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'همین الان';
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    if (hours < 24) return `${hours} ساعت پیش`;
    return `${days} روز پیش`;
  };

  return (
    <div className="flex items-center gap-3" dir="rtl">
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border-2"
        style={{
          borderColor: isPinned ? '#3b82f6' : 'rgba(255,255,255,.15)',
          boxShadow: isPinned ? '0 0 10px rgba(59,130,246,.4)' : 'none',
        }}
      >
        <img src={avatar} alt={username} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-white truncate">{username}</h4>
          {isPinned && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(59,130,246,.15)',
                color: '#60a5fa',
                border: '1px solid rgba(59,130,246,.3)',
              }}
            >
              📌 پین شده
            </motion.span>
          )}
        </div>
        <p className="text-[11px] text-gray-500">{getTimeAgo(createdAt)}</p>
      </div>
    </div>
  );
};

export default CommentHeader;

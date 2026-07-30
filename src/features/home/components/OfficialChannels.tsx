import React from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';

const channels = [
  {
    id: 'discord',
    name: 'Discord',
    members: '۱۲۰ هزار',
    link: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
    gradient: 'from-indigo-500 to-blue-600',
    hoverGlow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    members: '۸۵ هزار',
    link: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07c3.252.148 4.771 1.691 4.919 4.919c.058 1.265.069 1.645.069 4.849c0 3.205-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919c-1.266.058-1.644.07-4.85.07c-3.204 0-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92c-.058-1.265-.07-1.644-.07-4.849c0-3.204.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919c1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072C2.695.272.273 2.69.073 7.052C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98c.059-1.28.073-1.689.073-4.948c0-3.259-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324a6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8a4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881a1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
    gradient: 'from-pink-500 via-purple-500 to-orange-500',
    hoverGlow: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    members: '۵۰ هزار',
    link: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    gradient: 'from-red-500 to-red-700',
    hoverGlow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    members: '۱۵۰ هزار',
    link: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    gradient: 'from-cyan-400 to-blue-500',
    hoverGlow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]',
  },
  {
    id: 'rubika',
    name: 'روبیکا',
    members: '۹۵ هزار',
    link: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2L2 7v10l10 5l10-5V7L12 2zm0 2.18L19.82 8L12 11.82L4.18 8L12 4.18zM4 9.48l7 3.5v7.84l-7-3.5V9.48zm16 0v7.84l-7 3.5v-7.84l7-3.5z"/>
      </svg>
    ),
    gradient: 'from-purple-500 to-violet-700',
    hoverGlow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]',
  },
];

const OfficialChannels: React.FC = () => {
  return (
    <section dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Radio size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">کانال‌های رسمی</h2>
          <p className="text-sm text-slate-400">به جامعه سیندریا بپیوند</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {channels.map((ch) => (
          <motion.a
            key={ch.id}
            href={ch.link}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            className={`
              relative rounded-2xl p-5 flex flex-col items-center gap-3
              bg-gradient-to-br ${ch.gradient}
              border border-white/10
              shadow-lg shadow-black/40
              transition-all duration-300 cursor-pointer group
              ${ch.hoverGlow}
            `}
          >
            {/* Icon */}
            <div className="text-white group-hover:scale-110 transition-transform duration-300">
              {ch.icon}
            </div>

            {/* Name */}
            <div className="text-center">
              <p className="text-sm font-bold text-white mb-0.5">{ch.name}</p>
              <p className="text-[10px] text-white/70">{ch.members} عضو</p>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default OfficialChannels;

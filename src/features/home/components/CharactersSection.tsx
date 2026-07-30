// src/components/home/CharactersSection/CharactersSection.tsx

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  FiHeart,
  FiSearch,
  FiGrid,
  FiList,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiUserPlus,
  FiUserCheck,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import type { FollowedCharacter } from '../../../types/profile';

// ─── تایپ‌ها ─────────────────────────────────────────────
interface CharacterData {
  id: string;
  name: string;
  nameJa?: string;
  image: string;
  animeName?: string;
  anime?: string;
  animeId?: string;
  role?: string;
  voiceActor?: string;
  voiceActorImage?: string;
  popularity?: number;
  favorites?: number;
  likes?: number;
  rank?: number;
  description?: string;
  tags?: string[];
}

interface CharactersSectionProps {
  popularCharacters: CharacterData[];
  topCharacters: CharacterData[];
}

type TabKey = 'popular' | 'top' | 'followed';
type ViewMode = 'scroll' | 'grid';

// ─── تب‌ها ────────────────────────────────────────────────
const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'popular', label: 'محبوب‌ترین', icon: <FiTrendingUp /> },
  { key: 'top', label: 'برترین', icon: <FiStar /> },
  { key: 'followed', label: 'دنبال‌شده', icon: <FiUsers /> },
];

// ─── کارت کاراکتر ────────────────────────────────────────
function CharacterCard({
  character,
  index,
  isFollowed,
  onFollow,
  onUnfollow,
}: {
  character: CharacterData;
  index: number;
  isFollowed: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
}) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => navigate(`/character/${character.id}`)}
      className="group relative flex-shrink-0 w-[160px] sm:w-[180px] cursor-pointer"
    >
      {/* رتبه */}
      {character.rank && (
        <div className="absolute -top-2 -right-2 z-20 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-black text-black shadow-lg">
          {character.rank}
        </div>
      )}

      {/* تصویر */}
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-3">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* اورلی هاور */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* دکمه فالو */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            isFollowed ? onUnfollow() : onFollow();
          }}
          className={`absolute top-2 left-2 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            isFollowed
              ? 'bg-purple-500/80 text-white shadow-lg shadow-purple-500/30'
              : 'bg-black/40 text-white/70 opacity-0 group-hover:opacity-100'
          }`}
        >
          {isFollowed ? <FiUserCheck size={14} /> : <FiUserPlus size={14} />}
        </motion.button>

        {/* اطلاعات پایین تصویر */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {character.voiceActor && (
            <p className="text-[10px] text-purple-300/80 truncate">
              🎙 {character.voiceActor}
            </p>
          )}
          {(character.favorites || character.likes) && (
            <div className="flex items-center gap-1 mt-1">
              <FiHeart size={10} className="text-pink-400" />
              <span className="text-[10px] text-pink-300">
                {(character.favorites || character.likes || 0).toLocaleString('fa-IR')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* اطلاعات متنی */}
      <div className="px-1">
        <h3 className="text-sm font-bold text-white truncate">{character.name}</h3>
        {character.nameJa && (
          <p className="text-[10px] text-gray-500 truncate mt-0.5">{character.nameJa}</p>
        )}
        <p className="text-[11px] text-purple-300/70 truncate mt-1">
          {character.animeName || character.anime || ''}
        </p>
        {character.role && (
          <span
            className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${
              character.role === 'Main'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-gray-700/40 text-gray-400'
            }`}
          >
            {character.role === 'Main' ? 'اصلی' : 'فرعی'}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── کامپوننت اصلی ───────────────────────────────────────
export default function CharactersSection({
  popularCharacters,
  topCharacters,
}: CharactersSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('popular');
  const [viewMode, setViewMode] = useState<ViewMode>('scroll');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const {
    followedCharacters,
    followCharacter,
    unfollowCharacter,
    isCharacterFollowed,
  } = useAuth();

  // ─── لیست فیلتر شده ──────────────────────────────────
  const filteredList = useMemo(() => {
    let list: CharacterData[];

    if (activeTab === 'popular') {
      list = popularCharacters;
    } else if (activeTab === 'top') {
      list = topCharacters;
    } else {
      list = followedCharacters.map((fc: FollowedCharacter) => ({
        id: fc.id,
        name: fc.name,
        nameJa: fc.nameJa,
        image: fc.image,
        animeName: fc.animeName,
        animeId: fc.animeId,
      }));
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.animeName || c.anime || '').toLowerCase().includes(q) ||
          (c.nameJa && c.nameJa.includes(q))
      );
    }

    return list;
  }, [activeTab, popularCharacters, topCharacters, followedCharacters, searchQuery]);

  // ─── فالو / آنفالو ────────────────────────────────────
  const handleFollow = (character: CharacterData) => {
    followCharacter({
      id: character.id,
      name: character.name,
      nameJa: character.nameJa,
      image: character.image,
      animeName: character.animeName || character.anime || '',
      animeId: character.animeId,
    });
  };

  const handleUnfollow = (characterId: string) => {
    unfollowCharacter(characterId);
  };

  // ─── اسکرول چپ / راست ─────────────────────────────────
  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 400;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="relative py-12 px-4 sm:px-6"
    >
      {/* بک‌گراند تزئینی */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* ─── هدر ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* تب‌ها */}
          <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-2xl p-1.5 border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="char-tab-bg"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/60 to-blue-600/60 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                  {tab.key === 'followed' && followedCharacters.length > 0 && (
                    <span className="bg-purple-500/30 text-purple-300 text-[10px] px-1.5 py-0.5 rounded-full">
                      {followedCharacters.length}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* ابزارها */}
          <div className="flex items-center gap-2">
            {/* سرچ */}
            <AnimatePresence>
              {showSearch && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  type="text"
                  placeholder="جستجو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500/50"
                  autoFocus
                />
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                setShowSearch((p) => !p);
                if (showSearch) setSearchQuery('');
              }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <FiSearch size={16} />
            </button>

            {/* تغییر حالت نمایش */}
            <button
              onClick={() => setViewMode((v) => (v === 'scroll' ? 'grid' : 'scroll'))}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {viewMode === 'scroll' ? <FiGrid size={16} /> : <FiList size={16} />}
            </button>

            {/* نمایش همه */}
            <Link
              to="/characters"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              نمایش همه
              <FiChevronLeft size={16} />
            </Link>
          </div>
        </div>

        {/* ─── محتوا ────────────────────────────────────── */}
        {filteredList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-gray-500"
          >
            <FiUsers size={48} className="mb-4 opacity-30" />
            <p className="text-lg">
              {activeTab === 'followed'
                ? 'هنوز کاراکتری دنبال نکردی'
                : 'نتیجه‌ای یافت نشد'}
            </p>
          </motion.div>
        ) : viewMode === 'scroll' ? (
          /* ── حالت اسکرول ── */
          <div className="relative group/scroll">
            {/* دکمه چپ */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md text-white opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-purple-600/60"
            >
              <FiChevronRight size={20} />
            </button>

            {/* دکمه راست */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md text-white opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-purple-600/60"
            >
              <FiChevronLeft size={20} />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-1"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              <AnimatePresence mode="popLayout">
                {filteredList.map((char, i) => (
                  <CharacterCard
                    key={char.id}
                    character={char}
                    index={i}
                    isFollowed={isCharacterFollowed(char.id)}
                    onFollow={() => handleFollow(char)}
                    onUnfollow={() => handleUnfollow(char.id)}
                  />
                ))}
              </AnimatePresence>

              {/* کاشی نمایش همه */}
              <Link
                to="/characters"
                className="flex-shrink-0 w-[160px] sm:w-[180px] rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-white hover:border-purple-500/50 transition-colors"
              >
                <FiUsers size={30} />
                <span className="text-sm font-medium">نمایش همه</span>
                <FiChevronLeft size={20} />
              </Link>
            </div>
          </div>
        ) : (
          /* ── حالت گرید ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredList.map((char, i) => (
                <CharacterCard
                  key={char.id}
                  character={char}
                  index={i}
                  isFollowed={isCharacterFollowed(char.id)}
                  onFollow={() => handleFollow(char)}
                  onUnfollow={() => handleUnfollow(char.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.section>
  );
}

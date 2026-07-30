import React from 'react';
import { useUserData } from '@/contexts/UserDataContext';
import { UserMinus, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CharactersTab: React.FC = () => {
  const { followedCharacters, unfollowCharacter } = useUserData();

  if (followedCharacters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
          <Users className="w-10 h-10 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">هنوز کاراکتری دنبال نکردی</h3>
        <p className="text-sm text-gray-400 max-w-xs">
          از صفحه انیمه‌ها میتونی کاراکترهای مورد علاقت رو فالو کنی تا اینجا نشون داده بشن.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-gray-400">
          {followedCharacters.length} کاراکتر دنبال شده
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {followedCharacters.map((char) => (
          <div
            key={char.id}
            className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5"
          >
            {/* تصویر کاراکتر */}
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={char.image}
                alt={char.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* اورلی گرادیان */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* اطلاعات */}
            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
              <h4 className="text-sm font-bold text-white truncate">{char.name}</h4>
              <Link
                to={`/anime/${char.animeId}`}
                className="flex items-center gap-1 text-[11px] text-purple-300 hover:text-purple-200 transition-colors truncate"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{char.animeName}</span>
              </Link>
              <p className="text-[10px] text-gray-500">
                {new Date(char.followedAt).toLocaleDateString('fa-IR')}
              </p>
            </div>

            {/* دکمه آنفالو — هاور */}
            <button
              onClick={() => unfollowCharacter(char.id)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:scale-110"
              title="لغو دنبال کردن"
            >
              <UserMinus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharactersTab;

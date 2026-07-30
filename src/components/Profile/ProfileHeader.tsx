import React from 'react';
import { useUserStore } from '../../store/userStore';

interface ProfileHeaderProps {
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onEditClick }) => {
  const { profile } = useUserStore();

  const getInitials = (name: string) =>
    name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10">
      {/* Banner */}
      <div className="h-40 sm:h-52 overflow-hidden">
        {profile.banner ? (
          <img
            src={profile.banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/60 via-pink-900/40 to-blue-900/60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="relative px-5 pb-5 -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-gray-900 shadow-xl flex-shrink-0">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl font-bold">
                {getInitials(profile.name)}
              </div>
            )}
          </div>

          {/* Name & Bio */}
          <div className="flex-1 text-center sm:text-right min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
              {profile.name}
            </h1>
            {profile.bio && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {profile.bio}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
             عضویت از {formatDate(profile.joinedAt)}
            </p>
          </div>

          {/* Edit Button */}
          <button
            onClick={onEditClick}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-sm text-gray-300 hover:text-white transition-all flex-shrink-0"
          >
            ✏️ ویرایش پروفایل
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

import React from 'react';
import AnimeRow from './AnimeRow';
import type { Anime } from 'src/types/anime';

interface ExclusiveDubsProps {
  animes: Anime[];
}

const ExclusiveDubs: React.FC<ExclusiveDubsProps> = ({ animes }) => {
  if (animes.length === 0) return null;

  return (
    <div className="relative">
      <AnimeRow
        title="دوبله‌های اختصاصی سیندریا"
        subtitle="با دوبله فارسی اختصاصی تماشا کنید"
        icon={<span>🎙️</span>}
        animes={animes}
        viewAllLink="/category/exclusive-dubs"
        accentColor="#06b6d4"
        cardWidth={180}
      />
      {/* Badge overlay - CSS trick: inject via global style or wrap AnimeCard */}
      <style>{`
        .exclusive-dub-badge::after {
          content: 'دوبله اختصاصی';
          position: absolute;
          top: 8px;
          right: 8px;
          background: linear-gradient(135deg, #06b6d4, #0891b2);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
          z-index: 10;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
        }
      `}</style>
    </div>
  );
};

export default ExclusiveDubs;

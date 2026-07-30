import React from "react";
import { Episode } from "../types/anime.types";

interface EpisodeListProps {
  episodes: Episode[];
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes }) => {
  if (!Array.isArray(episodes) || episodes.length === 0) {
    return (
      <div className="text-sm mt-4" style={{ color: "var(--text-muted)" }}>
        فعلاً قسمتی برای این انیمه ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        لیست قسمت‌ها
      </h2>
      <div className="flex flex-col gap-3">
        {episodes.map((ep) => (
          <div
            key={ep.id}
            className="p-3 rounded-lg flex justify-between items-center"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="flex flex-col">
              <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                قسمت {ep.number}
              </span>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {ep.title}
              </span>
            </div>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {ep.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;
// import اضافه کنید:
import ListeningStats from "../components/ListeningStats";
import SmartPlaylistGenerator from "../components/SmartPlaylistGenerator";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


// در آرایه تب‌ها:
const TABS = [
  { id: "all", label: "همه آهنگ‌ها" },
  { id: "favorites", label: "مورد علاقه" },
  { id: "playlists", label: "پلی‌لیست‌ها" },
  { id: "stats", label: "آمار شنیداری" },
];

export default function UserMusicPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* تب‌ها */}
      <div className="flex gap-4 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab.id
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* محتوای تب‌ها */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          <SmartPlaylistGenerator
            onCreated={(id) => {
              navigate(`/playlist/${id}`);
            }}
          />
          <ListeningStats />
        </div>
      )}

      {/* سایر تب‌ها... */}
    </div>
  );
}

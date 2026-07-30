import { useState } from "react";

import { SakuraPetals } from "../components/Profile/SakuraPetals";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import ProfileHeader from "../components/Profile/ProfileHeader";
import { ProfileCard } from "../components/Profile/ProfileCard";
import ProfileStats from "../components/Profile/ProfileStats";
import { ContinueWatching } from "../components/Profile/ContinueWatching";
import { Watchlist } from "../components/Profile/Watchlist";
import { Achievements } from "../components/Profile/Achievements";
import { AnimeRecommendations } from "../components/Profile/AnimeRecommendations";
import { ActivityFeed } from "../components/Profile/ActivityFeed";

import "../styles/profile.css";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="profile-layout" dir="rtl">
      <SakuraPetals />

      <ProfileSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        isMobile={false}
        userInfo={{
          displayName: "User",
          username: "user",
          level: 1,
          xp: 0,
          maxXp: 100,
        }}
      />

      <div className="profile-main-area">
        <ProfileHeader onEditClick={() => {}} />

        <div className="profile-content">
          <div className="profile-center">
            <ProfileCard />
            <ProfileStats />
            <ContinueWatching />
            <Watchlist />
            <Achievements />
          </div>

          <div className="profile-right-panel">
            <AnimeRecommendations />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
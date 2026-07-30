import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import CinderinoProfileHeader from "../../components/Cinderino/CinderinoProfileHeader";
import CinderinoProfileTabs from "../../components/Cinderino/CinderinoProfileTabs";
import EditCinderinoProfileModal from "../../components/Cinderino/EditCinderinoProfileModal";
import CinderinoFollowersModal from "../../components/Cinderino/CinderinoFollowersModal";

const CinderinoProfilePage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [editOpen, setEditOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followersTab, setFollowersTab] = useState<"followers" | "following">("followers");

  const openFollowers = (tab: "followers" | "following") => {
    setFollowersTab(tab);
    setFollowersOpen(true);
  };

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #0f0c29, #1a1145, #0f0c29)"
          : "linear-gradient(180deg, #f8f7ff, #ede9fe, #f8f7ff)",
      }}
    >
      <CinderinoProfileHeader
        onEditClick={() => setEditOpen(true)}
        onFollowersClick={() => openFollowers("followers")}
        onFollowingClick={() => openFollowers("following")}
      />
      <CinderinoProfileTabs />
      <EditCinderinoProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} />
      <CinderinoFollowersModal
        isOpen={followersOpen}
        onClose={() => setFollowersOpen(false)}
        initialTab={followersTab}
      />
    </div>
  );
};

export default CinderinoProfilePage;

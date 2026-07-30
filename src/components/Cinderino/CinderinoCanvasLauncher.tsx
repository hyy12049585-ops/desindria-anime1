// src/components/Cinderino/CinderinoCanvasLauncher.tsx

import React, { useState } from "react";
import CinderinoCollabCanvas from "./CinderinoCollabCanvas";

interface CinderinoCanvasLauncherProps {
  isDark?: boolean;
  onClose: () => void;
  currentUserId?: string;
  currentUsername?: string;
  currentAvatar?: string;
  onOpenCanvas?: () => void;
}

const CinderinoCanvasLauncher: React.FC<CinderinoCanvasLauncherProps> = ({
  isDark = false,
  onClose,
  currentUserId = "default_user",
  currentUsername = "کاربر",
  currentAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  onOpenCanvas,
}) => {
  const [activeCanvas, setActiveCanvas] = useState<string | null>(null);
  const [canvasTitle, setCanvasTitle] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const canvases = [
    {
      id: "canvas-1",
      title: "پروژه تیمی",
      thumbnail: "🎨",
      participants: 5,
      lastActive: "2 ساعت پیش",
    },
    {
      id: "canvas-2",
      title: "ایده‌های خلاقانه",
      thumbnail: "💡",
      participants: 3,
      lastActive: "5 ساعت پیش",
    },
    {
      id: "canvas-3",
      title: "طراحی UI",
      thumbnail: "🖌️",
      participants: 8,
      lastActive: "1 روز پیش",
    },
  ];

  const handleCreateCanvas = () => {
    if (canvasTitle.trim()) {
      setActiveCanvas("new-canvas");
      setShowCreateModal(false);
      onOpenCanvas?.();
    }
  };

  if (activeCanvas) {
    return (
      <CinderinoCollabCanvas
        canvasId={activeCanvas}
        currentUserId={currentUserId}
        currentUsername={currentUsername}
        onPublish={(data) => {
          console.log("Published:", data);
          setActiveCanvas(null);
        }}
        onClose={() => setActiveCanvas(null)}
      />
    );
  }

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 800,
        margin: "0 auto",
        background: isDark ? "#000" : "#fff",
        minHeight: "100vh",
        color: isDark ? "#fff" : "#000",
      }}
    >
      {/* دکمه بستن */}
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          background: "none",
          border: "none",
          fontSize: 24,
          color: isDark ? "#fff" : "#000",
          cursor: "pointer",
          zIndex: 10000,
        }}
      >
        ✕
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          Canvas های من
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(240, 148, 51, 0.3)",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          + Canvas جدید
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        {canvases.map((canvas) => (
          <div
            key={canvas.id}
            onClick={() => {
              setCanvasTitle(canvas.title);
              setActiveCanvas(canvas.id);
              onOpenCanvas?.();
            }}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 16,
              padding: 20,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {canvas.thumbnail}
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#fff",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              {canvas.title}
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <span>👥 {canvas.participants}</span>
              <span>{canvas.lastActive}</span>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isDark ? "#1a1a1a" : "#fff",
              borderRadius: 16,
              padding: 32,
              width: "min(90vw, 400px)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 20,
                color: isDark ? "#fff" : "#000",
              }}
            >
              Canvas جدید
            </h3>
            <input
              type="text"
              placeholder="عنوان Canvas"
              value={canvasTitle}
              onChange={(e) => setCanvasTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateCanvas();
              }}
              autoFocus
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: isDark ? "1px solid #333" : "1px solid #ddd",
                background: isDark ? "#262626" : "#fff",
                color: isDark ? "#fff" : "#000",
                fontSize: 15,
                outline: "none",
                marginBottom: 20,
                direction: "rtl",
              }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleCreateCanvas}
                disabled={!canvasTitle.trim()}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 10,
                  border: "none",
                  background: canvasTitle.trim()
                    ? "linear-gradient(45deg, #f09433, #e6683c)"
                    : "#ddd",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: canvasTitle.trim() ? "pointer" : "default",
                }}
              >
                ایجاد
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 10,
                  border: isDark ? "1px solid #333" : "1px solid #ddd",
                  background: isDark ? "#262626" : "#fff",
                  color: isDark ? "#fff" : "#262626",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CinderinoCanvasLauncher;

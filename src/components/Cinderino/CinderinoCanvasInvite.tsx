// src/components/Cinderino/CinderinoCollabCanvas.tsx

import React, { useState, useRef, useEffect } from "react";

interface Props {
  canvasId: string;
  canvasTitle: string;
  currentUserId: string;
  currentUsername: string;
  onPublish: (data: { image: string; caption: string }) => void;
  onClose: () => void;
}

interface DrawingPoint {
  x: number;
  y: number;
  color: string;
  size: number;
}

interface Participant {
  id: string;
  username: string;
  avatar: string;
  color: string;
  isActive: boolean;
}

const CinderinoCollabCanvas: React.FC<Props> = ({
  canvasId,
  canvasTitle,
  currentUserId,
  currentUsername,
  onPublish,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [caption, setCaption] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);

  const [participants] = useState<Participant[]>([
    {
      id: currentUserId,
      username: currentUsername,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
      color: "#f09433",
      isActive: true,
    },
    {
      id: "user-2",
      username: "سارا",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara",
      color: "#0095f6",
      isActive: true,
    },
    {
      id: "user-3",
      username: "علی",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ali",
      color: "#00d856",
      isActive: false,
    },
  ]);

  const colors = [
    "#000000",
    "#ffffff",
    "#f09433",
    "#e6683c",
    "#dc2743",
    "#cc2366",
    "#bc1888",
    "#0095f6",
    "#00d856",
    "#ffd600",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== "mousedown") return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handlePublish = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL("image/png");
    onPublish({ image: imageData, caption });
    setShowPublishModal(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "rgba(0,0,0,0.9)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
            padding: 4,
          }}
        >
          ✕
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
            {canvasTitle}
          </span>
          <div style={{ display: "flex", marginRight: 12 }}>
            {participants.map((p, i) => (
              <div
                key={p.id}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: `2px solid ${p.color}`,
                  marginLeft: i > 0 ? -8 : 0,
                  overflow: "hidden",
                  opacity: p.isActive ? 1 : 0.5,
                }}
              >
                <img
                  src={p.avatar}
                  alt={p.username}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowPublishModal(true)}
          style={{
            background: "linear-gradient(45deg, #f09433, #e6683c)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          انتشار
        </button>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: 20 }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          style={{
            background: "#fff",
            borderRadius: 12,
            cursor: tool === "pen" ? "crosshair" : "pointer",
            maxWidth: "100%",
            maxHeight: "100%",
            width: 800,
            height: 600,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Bottom Toolbar */}
      <div
        style={{
          background: "rgba(0,0,0,0.9)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          justifyContent: "center",
        }}
      >
        {/* Tools */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setTool("pen")}
            style={{
              background: tool === "pen" ? "rgba(255,255,255,0.2)" : "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8,
              padding: "8px 16px",
              color: "#fff",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ✏️
          </button>
          <button
            onClick={() => setTool("eraser")}
            style={{
              background: tool === "eraser" ? "rgba(255,255,255,0.2)" : "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8,
              padding: "8px 16px",
              color: "#fff",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            🧹
          </button>
        </div>

        {/* Colors */}
        <div style={{ display: "flex", gap: 8 }}>
          {colors.map((c) => (
            <button              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: c,
                border: color === c ? "3px solid #0095f6" : "2px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                transform: color === c ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>سایز</span>
          <input
            type="range"
            min={1}
            max={20}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ width: 80, accentColor: "#f09433" }}
          />
          <div
            style={{
              width: brushSize,
              height: brushSize,
              borderRadius: "50%",
              background: color,
              border: "1px solid rgba(255,255,255,0.3)",
              minWidth: 4,
              minHeight: 4,
            }}
          />
        </div>

        {/* Clear */}
        <button
          onClick={clearCanvas}
          style={{
            background: "rgba(255,60,60,0.2)",
            border: "1px solid rgba(255,60,60,0.4)",
            borderRadius: 8,
            padding: "8px 16px",
            color: "#ff3c3c",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          پاک کردن
        </button>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(10px)",
          }}
          onClick={() => setShowPublishModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              width: "min(90vw, 440px)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 20,
                textAlign: "center",
                color: "#262626",
              }}
            >
              انتشار Canvas
            </h3>

            {/* Preview */}
            <div
              style={{
                width: "100%",
                height: 200,
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 20,
                background: "#f0f0f0",
              }}
            >
              {canvasRef.current && (
                <img
                  src={canvasRef.current.toDataURL("image/png")}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>

            <textarea
              placeholder="کپشن بنویسید..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid #ddd",
                fontSize: 15,
                outline: "none",
                marginBottom: 20,
                direction: "rtl",
                resize: "vertical",
                minHeight: 80,
                fontFamily: "inherit",
              }}
            />

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handlePublish}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(240, 148, 51, 0.3)",
                }}
              >
                انتشار به فید
              </button>
              <button
                onClick={() => setShowPublishModal(false)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "#fff",
                  color: "#262626",
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

export default CinderinoCollabCanvas;

// src/components/Cinderino/CinderinoCollabCanvas.tsx

import React, { useRef, useState, useEffect, useCallback } from "react";
import type {
  CollabCanvas,
  CanvasStroke,
  CanvasPoint,
  CanvasTool,
} from "../../types/cinderino";
import {
  getCanvasById,
  addStrokeToCanvas,
  undoLastStroke,
  updateCanvas,
} from "../../utils/cinderinoStorage";
import { useTheme } from "../../contexts/ThemeContext";

interface Props {
  canvasId: string;
  currentUserId: string;
  currentUsername: string;
  onPublish?: (dataUrl: string) => void;
  onClose?: () => void;
}

const TOOLS: { tool: CanvasTool; icon: string; label: string }[] = [
  { tool: "pen", icon: "✏️", label: "قلم" },
  { tool: "brush", icon: "🖌️", label: "براش" },
  { tool: "glow", icon: "✨", label: "درخشان" },
  { tool: "spray", icon: "💨", label: "اسپری" },
  { tool: "eraser", icon: "🧹", label: "پاک‌کن" },
];

const COLOR_PALETTE = [
  "#ffffff",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#6366f1",
  "#000000",
  "#ff6b6b",
  "#ffd93d",
  "#6bcb77",
];

const BRUSH_SIZES = [2, 4, 8, 14, 22];

export default function CinderinoCollabCanvas({
  canvasId,
  currentUserId,
  currentUsername,
  onPublish,
  onClose,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [canvas, setCanvas] = useState<CollabCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<CanvasTool>("pen");
  const [activeColor, setActiveColor] = useState("#8b5cf6");
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<CanvasPoint[]>([]);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Load canvas data
  useEffect(() => {
    const data = getCanvasById(canvasId);
    if (data) setCanvas(data);
  }, [canvasId]);

  // Redraw canvas
  const redrawCanvas = useCallback(() => {
    const el = canvasRef.current;
    if (!el || !canvas) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, el.width, el.height);

    // Background
    ctx.fillStyle = canvas.backgroundColor;
    ctx.fillRect(0, 0, el.width, el.height);

    // Subtle grid
    ctx.strokeStyle = "rgba(139,92,246,0.05)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < el.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, el.height);
      ctx.stroke();
    }
    for (let y = 0; y < el.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(el.width, y);
      ctx.stroke();
    }

    // Draw all strokes from all visible layers
    canvas.layers.forEach((layer) => {
      if (!layer.visible) return;
      ctx.globalAlpha = layer.opacity;
      layer.strokes.forEach((stroke) => drawStroke(ctx, stroke));
      ctx.globalAlpha = 1;
    });

    // Draw current (in-progress) stroke
    if (currentPoints.length > 1) {
      drawStroke(ctx, {
        id: "temp",
        userId: currentUserId,
        username: currentUsername,
        points: currentPoints,
        color:
          activeTool === "eraser" ? canvas.backgroundColor : activeColor,
        width: brushSize,
        tool: activeTool,
        timestamp: Date.now(),
      });
    }
  }, [
    canvas,
    currentPoints,
    activeColor,
    brushSize,
    activeTool,
    currentUserId,
    currentUsername,
  ]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  function drawStroke(ctx: CanvasRenderingContext2D, stroke: CanvasStroke) {
    if (stroke.points.length < 2) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (stroke.tool) {
      case "glow":
        ctx.shadowColor = stroke.color;
        ctx.shadowBlur = stroke.width * 2;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        break;

      case "brush":
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width * 1.8;
        ctx.globalAlpha = 0.6;
        break;

      case "spray":
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        stroke.points.forEach((p) => {
          for (let i = 0; i < 12; i++) {
            const offsetX = (Math.random() - 0.5) * stroke.width * 3;
            const offsetY = (Math.random() - 0.5) * stroke.width * 3;
            ctx.fillStyle = stroke.color;
            ctx.globalAlpha = Math.random() * 0.5 + 0.2;
            ctx.beginPath();
            ctx.arc(p.x + offsetX, p.y + offsetY, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.globalAlpha = 1;
        return;

      case "eraser":
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width * 3;
        break;

      default:
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
    }

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      const prev = stroke.points[i - 1];
      const curr = stroke.points[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
    }
    ctx.stroke();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  // ── Mouse / Touch handlers ──

  function getPos(
    e: React.MouseEvent | React.TouchEvent
  ): CanvasPoint | null {
    const el = canvasRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const scaleX = el.width / rect.width;
    const scaleY = el.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  function handleStart(e: React.MouseEvent | React.TouchEvent) {
    const pos = getPos(e);
    if (!pos) return;
    setIsDrawing(true);
    setCurrentPoints([pos]);
  }

  function handleMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return;
    const pos = getPos(e);
    if (!pos) return;
    setCurrentPoints((prev) => [...prev, pos]);
  }

  function handleEnd() {
    if (!isDrawing || !canvas) return;
    setIsDrawing(false);

    if (currentPoints.length > 1) {
      const stroke: CanvasStroke = {
        id: crypto.randomUUID(),
        userId: currentUserId,
        username: currentUsername,
        points: currentPoints,
        color:
          activeTool === "eraser" ? canvas.backgroundColor : activeColor,
        width: brushSize,
        tool: activeTool,
        timestamp: Date.now(),
      };

      const updated = addStrokeToCanvas(
        canvas.id,
        canvas.activeLayerId,
        stroke
      );

      if (updated) setCanvas(updated);
    }

    setCurrentPoints([]);
  }

  function handleUndo() {
    if (!canvas) return;
    const updated = undoLastStroke(
      canvas.id,
      canvas.activeLayerId,
      currentUserId
    );
    if (updated) setCanvas(updated);
  }

  function handleExport() {
    const el = canvasRef.current;
    if (!el) return;
    const data = el.toDataURL("image/png");
    if (onPublish) onPublish(data);
  }

  if (!canvas) {
    return (
      <div className={`flex items-center justify-center h-full ${isDark ? "text-white" : "text-gray-700"}`}>
        در حال بارگذاری بوم...
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full flex flex-col ${isDark ? "bg-black" : "bg-gray-100"}`}>

      {/* Top bar */}
      <div className={`flex items-center justify-between px-4 py-2 backdrop-blur border-b ${
        isDark
          ? "bg-black/60 border-white/10"
          : "bg-white/80 border-gray-200 shadow-sm"
      }`}>
        <div className={`flex items-center gap-3 ${isDark ? "text-white" : "text-gray-900"}`}>
          <button
            onClick={onClose}
            className={`text-lg hover:opacity-70 transition-opacity ${isDark ? "text-white" : "text-gray-600"}`}
          >
            ✖
          </button>
          <span className="font-semibold">{canvas.title}</span>
        </div>

        <div className={`flex items-center gap-3 text-lg ${isDark ? "text-white" : "text-gray-700"}`}>
          <button onClick={handleUndo} className="hover:opacity-70 transition-opacity">↶</button>
          <button onClick={handleExport} className="hover:opacity-70 transition-opacity">📤</button>
        </div>
      </div>

      {/* Canvas — بوم نقاشی همیشه تیره میمونه برای خوانایی بهتر */}
      <div className={`flex-1 flex items-center justify-center ${isDark ? "bg-black" : "bg-gray-200"}`}>
        <canvas
          ref={canvasRef}
          width={canvas.width}
          height={canvas.height}
          className="bg-black max-w-full max-h-full touch-none rounded-sm"
          style={{ boxShadow: isDark ? "none" : "0 4px 24px rgba(0,0,0,0.15)" }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      {/* Toolbar */}
      {showToolbar && (
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 backdrop-blur px-3 py-2 rounded-xl border ${
          isDark
            ? "bg-black/70 border-white/10"
            : "bg-white/90 border-gray-200 shadow-lg"
        }`}>
          {TOOLS.map((t) => (
            <button
              key={t.tool}
              onClick={() => setActiveTool(t.tool)}
              title={t.label}
              className={`text-xl px-2 transition-all ${
                activeTool === t.tool
                  ? "scale-125"
                  : isDark
                    ? "opacity-70 hover:opacity-100"
                    : "opacity-60 hover:opacity-90"
              }`}
            >
              {t.icon}
            </button>
          ))}

          <div className={`w-px h-6 mx-1 ${isDark ? "bg-white/20" : "bg-gray-300"}`} />

          <button
            onClick={() => setShowColorPicker((v) => !v)}
            className="text-xl px-2 hover:scale-110 transition-transform"
          >
            🎨
          </button>
        </div>
      )}

      {/* Color Picker */}
      {showColorPicker && (
        <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 p-3 rounded-xl grid grid-cols-6 gap-2 ${
          isDark
            ? "bg-black/80 backdrop-blur"
            : "bg-white shadow-xl border border-gray-200"
        }`}>
          {COLOR_PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => {
                setActiveColor(c);
                setShowColorPicker(false);
              }}
              style={{ background: c }}
              className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                activeColor === c
                  ? isDark
                    ? "border-white scale-110"
                    : "border-purple-500 scale-110"
                  : isDark
                    ? "border-white/30"
                    : "border-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* Brush size */}
      <div className={`absolute right-4 top-20 flex flex-col gap-2 p-1.5 rounded-xl ${
        isDark
          ? "bg-black/50 backdrop-blur"
          : "bg-white/90 shadow-lg border border-gray-200"
      }`}>
        {BRUSH_SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setBrushSize(s)}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
              brushSize === s
                ? isDark
                  ? "bg-purple-600 text-white"
                  : "bg-purple-500 text-white"
                : isDark
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Collaborators */}
      <div className="absolute left-4 top-20">
        <button
          onClick={() => setShowCollaborators((v) => !v)}
          className={`text-xl p-1.5 rounded-lg transition-colors ${
            isDark
              ? "hover:bg-white/10"
              : "hover:bg-gray-200 bg-white/80 shadow-sm border border-gray-200"
          }`}
        >
          👥
        </button>

        {showCollaborators && (
          <div className={`mt-2 p-3 rounded-xl space-y-2 min-w-[140px] ${
            isDark
              ? "bg-black/80 backdrop-blur"
              : "bg-white shadow-xl border border-gray-200"
          }`}>
            {canvas.collaborators.map((u) => (
              <div
                key={u.userId}
                className={`flex items-center gap-2 text-sm ${isDark ? "text-white" : "text-gray-700"}`}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: u.color }}
                />
                <span className="truncate">{u.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

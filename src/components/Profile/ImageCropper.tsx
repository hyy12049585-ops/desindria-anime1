// src/components/profile/ImageCropper.tsx
import React, { useState, useRef, useCallback } from "react";
import { FaSearchPlus, FaSearchMinus, FaCheck, FaTimes, FaUndo } from "react-icons/fa";

interface ImageCropperProps {
  imageSrc: string;
  onCrop: (croppedDataUrl: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCrop,
  onCancel,
  aspectRatio = 1,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const dragStart = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setDragging(true);
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    },
    [dragging]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleCrop = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size / aspectRatio;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.translate(size / 2, size / (2 * aspectRatio));
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    const drawWidth = img.naturalWidth;
    const drawHeight = img.naturalHeight;

    ctx.drawImage(
      img,
      -drawWidth / 2 + position.x / scale,
      -drawHeight / 2 + position.y / scale,
      drawWidth,
      drawHeight
    );
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    onCrop(dataUrl);
  }, [scale, position, rotation, aspectRatio, onCrop]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md space-y-4 border border-gray-700">
        <h3 className="text-white font-bold text-lg text-center">برش تصویر</h3>

        {/* Preview Area */}
        <div
          className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-2 border-purple-500 cursor-move bg-gray-800"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="crop preview"
            className="absolute select-none pointer-events-none"
            draggable={false}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: "center center",
              maxWidth: "none",
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white transition"
            title="کوچک‌تر"
          >
            <FaSearchMinus />
          </button>

          <input
            type="range"
            min="0.5"
            max="3"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-32 accent-purple-500"
          />

          <button
            onClick={() => setScale((s) => Math.min(3, s + 0.1))}
            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white transition"
            title="بزرگ‌تر"
          >
            <FaSearchPlus />
          </button>
        </div>

        {/* Rotation */}
        <div className="flex items-center justify-center gap-4">
          <span className="text-xs text-gray-400">چرخش</span>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="w-40 accent-purple-500"
          />
          <button
            onClick={() => {
              setScale(1);
              setRotation(0);
              setPosition({ x: 0, y: 0 });
            }}
            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white"
            title="ریست"
          >
            <FaUndo />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center gap-2"
          >
            <FaTimes />
            لغو
          </button>

          <button
            onClick={handleCrop}
            className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2"
          >
            <FaCheck />
            ذخیره
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ImageCropper;

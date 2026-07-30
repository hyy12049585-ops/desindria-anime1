// src/components/Profile/AvatarUploader.tsx

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AvatarUploaderProps {
  currentAvatar?: string;
  onUpload: (base64: string) => void;
  size?: number;
  editable?: boolean;
  level?: number;
  showLevel?: boolean;
  borderColor?: string;
  className?: string;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  onUpload,
  size = 120,
  editable = true,
  level,
  showLevel = false,
  borderColor = '#00d4ff',
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovering, setHovering] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const displayAvatar = preview || currentAvatar;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      alert('فقط فایل تصویری مجاز است.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('حداکثر اندازه فایل 5MB است.');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      // Resize image
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 400;
        let w = img.width;
        let h = img.height;

        if (w > maxSize || h > maxSize) {
          if (w > h) {
            h = (h / w) * maxSize;
            w = maxSize;
          } else {
            w = (w / h) * maxSize;
            h = maxSize;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);

        const resized = canvas.toDataURL('image/jpeg', 0.85);
        setPreview(resized);
        onUpload(resized);
        setUploading(false);
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  // Level badge color
  const getLevelColor = (lvl: number) => {
    if (lvl >= 50) return { bg: 'linear-gradient(135deg, #ff2d78, #ff6a00)', border: '#ff2d78' };
    if (lvl >= 30) return { bg: 'linear-gradient(135deg, #a855f7, #ff2d78)', border: '#a855f7' };
    if (lvl >= 10) return { bg: 'linear-gradient(135deg, #00d4ff, #a855f7)', border: '#00d4ff' };
    return { bg: 'linear-gradient(135deg, #06ffd2, #00d4ff)', border: '#06ffd2' };
  };

  return (
    <div
      className={`avatar-uploader ${className}`}
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {/* Outer glow ring */}
      <motion.div
        animate={{
          boxShadow: [
            `0 0 15px rgba(0, 212, 255, 0.2)`,
            `0 0 25px rgba(168, 85, 247, 0.3)`,
            `0 0 15px rgba(0, 212, 255, 0.2)`,
          ],
        }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          border: `2px solid ${borderColor}`,
          pointerEvents: 'none',
        }}
      />

      {/* Avatar container */}
      <motion.div
        onHoverStart={() => editable && setHovering(true)}
        onHoverEnd={() => editable && setHovering(false)}
        onClick={() => editable && inputRef.current?.click()}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          cursor: editable ? 'pointer' : 'default',
          position: 'relative',
          background: 'rgba(15, 15, 46, 0.8)',
          border: `2px solid rgba(255, 255, 255, 0.1)`,
        }}
        whileHover={editable ? { scale: 1.05 } : {}}
        whileTap={editable ? { scale: 0.95 } : {}}
      >
        {/* Image */}
        {displayAvatar ? (
          <img
            src={displayAvatar}
            alt="Avatar"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(168,85,247,0.1))',
            }}
          >
            <svg
              width={size * 0.4}
              height={size * 0.4}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6a6a8a"
              strokeWidth="1.5"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovering && editable && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span
                style={{
                  fontSize: '10px',
                  color: '#00d4ff',
                  fontWeight: 600,
                  fontFamily: "'Vazirmatn', sans-serif",
                }}
              >
                تغییر تصویر
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Uploading overlay */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{
                  width: 28,
                  height: 28,
                  border: '3px solid rgba(0, 212, 255, 0.2)',
                  borderTopColor: '#00d4ff',
                  borderRadius: '50%',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Level badge */}
      {showLevel && level !== undefined && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.3 }}
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            minWidth: 28,
            height: 28,
            borderRadius: 14,
            background: getLevelColor(level).bg,
            border: `2px solid ${getLevelColor(level).border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 6px',
            boxShadow: `0 0 10px ${getLevelColor(level).border}40`,
            zIndex: 3,
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#fff',
              fontFamily: 'var(--font-mono, monospace)',
              lineHeight: 1,
            }}
          >
            {level}
          </span>
        </motion.div>
      )}

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default AvatarUploader;

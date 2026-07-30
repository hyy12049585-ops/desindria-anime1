// src/components/common/DownloadButton.tsx
import React, { useCallback } from 'react';
import { Download } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import type { DownloadItem } from '../../contexts/UserContext';

interface DownloadButtonProps {
  item: {
    id: string;
    title: string;
    image: string;
    type: 'anime' | 'movie' | 'series';
    episode?: string;
    quality?: string;
    size?: string;
  };
  size?: number;
  className?: string;
}

export default function DownloadButton({ item, size = 22, className = '' }: DownloadButtonProps) {
  const { downloads, addDownload } = useUser();
  const isDownloaded = downloads.some((d) => d.id === item.id);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isDownloaded) return;

    const downloadItem: DownloadItem = {
      ...item,
      downloadedAt: new Date().toISOString(),
      quality: item.quality || '1080p',
      size: item.size || 'Unknown',
      status: 'completed',
    };

    addDownload(downloadItem);
  }, [item, isDownloaded, addDownload]);

  return (
    <button
      onClick={handleClick}
      className={`transition-all duration-300 ${className}`}
      aria-label="Download"
    >
      <Download
        size={size}
        className={
          isDownloaded
            ? 'text-green-500 scale-110 transition-all duration-300'
            : 'text-gray-400 hover:text-green-400 transition-all duration-300'
        }
      />
    </button>
  );
}

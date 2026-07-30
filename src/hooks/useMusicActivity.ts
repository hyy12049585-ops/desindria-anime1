// hooks/useMusicActivity.ts
import { useEffect, useCallback } from 'react';

interface PlayHistory {
  trackId: number;
  playedAt: string;
  progress: number;
  timestamp: number;
}

export function useMusicActivity() {
  // ثبت پخش آهنگ
  const trackPlay = useCallback((trackId: number) => {
    const history: PlayHistory[] = JSON.parse(
      localStorage.getItem('music_play_history') || '[]'
    );

    // چک کنیم آیا همین آهنگ در ۵ دقیقه اخیر پخش شده؟
    const now = Date.now();
    const recentPlay = history.find(
      (h) => h.trackId === trackId && now - h.timestamp < 5 * 60 * 1000
    );

    if (!recentPlay) {
      const newEntry: PlayHistory = {
        trackId,
        playedAt: new Date().toLocaleDateString('fa-IR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        progress: 0,
        timestamp: now,
      };

      // اضافه کردن به اول لیست
      history.unshift(newEntry);

      // نگه‌داری فقط ۱۰۰ آهنگ آخر
      if (history.length > 100) {
        history.pop();
      }

      localStorage.setItem('music_play_history', JSON.stringify(history));

      // ارسال event برای آپدیت UI
      window.dispatchEvent(new Event('music-history-updated'));
    }
  }, []);

  // آپدیت پروگرس
  const updateProgress = useCallback((trackId: number, progress: number) => {
    const history: PlayHistory[] = JSON.parse(
      localStorage.getItem('music_play_history') || '[]'
    );

    const index = history.findIndex((h) => h.trackId === trackId);
    if (index !== -1) {
      history[index].progress = Math.round(progress);
      localStorage.setItem('music_play_history', JSON.stringify(history));
    }
  }, []);

  // افزایش شمارنده بازدید
  const incrementViews = useCallback((trackId: number) => {
    const views = JSON.parse(localStorage.getItem('music_views') || '{}');
    views[trackId] = (views[trackId] || 0) + 1;
    localStorage.setItem('music_views', JSON.stringify(views));
  }, []);

  return { trackPlay, updateProgress, incrementViews };
}

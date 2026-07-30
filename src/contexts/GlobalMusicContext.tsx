// contexts/GlobalMusicContext.tsx
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { MusicItem } from '../features/music/user/data/musicData';
import { useMusicActivity } from '../hooks/useMusicActivity';

interface GlobalMusicContextType {
  currentTrack: MusicItem | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (track: MusicItem) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  setVolume: (vol: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  playlist: MusicItem[];
  setPlaylist: (tracks: MusicItem[]) => void;
}

const GlobalMusicContext = createContext<GlobalMusicContextType | undefined>(undefined);

export function GlobalMusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<MusicItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [playlist, setPlaylist] = useState<MusicItem[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackRef = useRef<MusicItem | null>(null);
  const { trackPlay, updateProgress, incrementViews } = useMusicActivity();

  // sync ref with state
  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  const nextTrack = useCallback(() => {
    if (!currentTrackRef.current || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((t) => t.id === currentTrackRef.current!.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrackInternal(playlist[nextIndex]);
  }, [playlist]);

  const prevTrack = useCallback(() => {
    if (!currentTrackRef.current || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((t) => t.id === currentTrackRef.current!.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    playTrackInternal(playlist[prevIndex]);
  }, [playlist]);

  // ساخت audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (currentTrackRef.current && audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        updateProgress(Number(currentTrackRef.current.id), progress);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audio.src = '';
    };
  }, [nextTrack]);

  const playTrackInternal = (track: MusicItem) => {
    if (!audioRef.current) return;

    setCurrentTrack(track);
   audioRef.current.src = track.audioUrl ?? '';

    audioRef.current.play();
    setIsPlaying(true);

    trackPlay(Number(track.id));
    incrementViews(Number(track.id));
  };

  const playTrack = (track: MusicItem) => {
    playTrackInternal(track);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  return (
    <GlobalMusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        playTrack,
        togglePlay,
        seekTo,
        setVolume,
        nextTrack,
        prevTrack,
        playlist,
        setPlaylist,
      }}
    >
      {children}
    </GlobalMusicContext.Provider>
  );
}

export const useGlobalMusic = () => {
  const context = useContext(GlobalMusicContext);
  if (!context) throw new Error('useGlobalMusic must be used within GlobalMusicProvider');
  return context;
};

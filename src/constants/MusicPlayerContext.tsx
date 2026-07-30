import React, { createContext, useState, ReactNode, useCallback } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  duration?: number;
}

interface MusicPlayerContextProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  seek: (time: number, duration: number) => void;
  changeVolume: (volume: number) => void;
  toggleMute: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setTracks: (tracks: Track[]) => void;
}

export const MusicPlayerContext = createContext<MusicPlayerContextProps>({
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 70,
  isMuted: false,
  playTrack: () => {},
  togglePlayPause: () => {},
  seek: () => {},
  changeVolume: () => {},
  toggleMute: () => {},
  playNext: () => {},
  playPrevious: () => {},
  setTracks: () => {},
});

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const seek = useCallback((time: number, dur: number) => {
    setProgress(time);
    setDuration(dur);
  }, []);

  const changeVolume = useCallback((vol: number) => {
    setVolume(vol);
    if (vol > 0 && isMuted) setIsMuted(false);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const playNext = useCallback(() => {
    if (!currentTrack || playlistTracks.length === 0) return;
    const currentIndex = playlistTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlistTracks.length;
    playTrack(playlistTracks[nextIndex]);
  }, [currentTrack, playlistTracks, playTrack]);

  const playPrevious = useCallback(() => {
    if (!currentTrack || playlistTracks.length === 0) return;
    const currentIndex = playlistTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? playlistTracks.length - 1 : currentIndex - 1;
    playTrack(playlistTracks[prevIndex]);
  }, [currentTrack, playlistTracks, playTrack]);

  const setTracks = useCallback((tracks: Track[]) => {
    setPlaylistTracks(tracks);
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        isMuted,
        playTrack,
        togglePlayPause,
        seek,
        changeVolume,
        toggleMute,
        playNext,
        playPrevious,
        setTracks,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

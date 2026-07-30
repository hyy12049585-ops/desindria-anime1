// data/playlistData.ts
export interface Playlist {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  trackIds: number[];
  createdAt: string;
  isPublic: boolean;
}

// دریافت همه پلی‌لیست‌ها
export function getUserPlaylists(): Playlist[] {
  return JSON.parse(localStorage.getItem('user_playlists') || '[]');
}

// ساخت پلی‌لیست جدید
export function createPlaylist(name: string, description: string = ''): Playlist {
  const playlists = getUserPlaylists();
  
  const newPlaylist: Playlist = {
    id: Date.now(),
    name,
    description,
    coverImage: '/default-playlist-cover.jpg',
    trackIds: [],
    createdAt: new Date().toLocaleDateString('fa-IR'),
    isPublic: false,
  };

  playlists.push(newPlaylist);
  localStorage.setItem('user_playlists', JSON.stringify(playlists));
  
  window.dispatchEvent(new Event('playlists-updated'));
  return newPlaylist;
}

// افزودن آهنگ به پلی‌لیست
export function addTrackToPlaylist(playlistId: number, trackId: number): boolean {
  const playlists = getUserPlaylists();
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) return false;

  if (!playlist.trackIds.includes(trackId)) {
    playlist.trackIds.push(trackId);
    localStorage.setItem('user_playlists', JSON.stringify(playlists));
    window.dispatchEvent(new Event('playlists-updated'));
    return true;
  }

  return false;
}

// حذف آهنگ از پلی‌لیست
export function removeTrackFromPlaylist(playlistId: number, trackId: number): boolean {
  const playlists = getUserPlaylists();
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) return false;

  playlist.trackIds = playlist.trackIds.filter((id) => id !== trackId);
  localStorage.setItem('user_playlists', JSON.stringify(playlists));
  window.dispatchEvent(new Event('playlists-updated'));
  return true;
}

// حذف پلی‌لیست
export function deletePlaylist(playlistId: number): boolean {
  let playlists = getUserPlaylists();
  playlists = playlists.filter((p) => p.id !== playlistId);
  localStorage.setItem('user_playlists', JSON.stringify(playlists));
  window.dispatchEvent(new Event('playlists-updated'));
  return true;
}

// آپدیت پلی‌لیست
export function updatePlaylist(
  playlistId: number,
  updates: Partial<Omit<Playlist, 'id' | 'createdAt'>>
): boolean {
  const playlists = getUserPlaylists();
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) return false;

  Object.assign(playlist, updates);
  localStorage.setItem('user_playlists', JSON.stringify(playlists));
  window.dispatchEvent(new Event('playlists-updated'));
  return true;
}

// دریافت یک پلی‌لیست
export function getPlaylistById(id: number): Playlist | undefined {
  return getUserPlaylists().find((p) => p.id === id);
}
// مرتب‌سازی مجدد آهنگ‌های پلی‌لیست
export function reorderPlaylistTracks(
  playlistId: number,
  newTrackIds: number[]
): Playlist | null {
  const playlists = getUserPlaylists();
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) return null;

  playlist.trackIds = newTrackIds;
  localStorage.setItem('user_playlists', JSON.stringify(playlists));
  window.dispatchEvent(new Event('playlists-updated'));
  return playlist;
}

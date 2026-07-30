// src/components/characters/FollowButton.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import {
  isFollowingCharacter, followCharacter, unfollowCharacter,
} from '../../services/charactersService';

export default function FollowButton({
  characterId,
  size = 'md',
  onChange,
}: {
  characterId: string;
  size?: 'sm' | 'md';
  onChange?: (following: boolean) => void;
}) {
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    isFollowingCharacter(characterId)
      .then((f) => { if (mounted) setFollowing(f); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [characterId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      if (following) {
        await unfollowCharacter(characterId);
        setFollowing(false);
        onChange?.(false);
      } else {
        await followCharacter(characterId);
        setFollowing(true);
        onChange?.(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('وارد')) {
        if (confirm('برای دنبال‌کردن باید وارد حساب شوی. الان وارد شوی؟')) {
          navigate('/auth/login');
        }
      } else {
        alert('خطا: ' + (msg || 'نامشخص'));
      }
    } finally {
      setBusy(false);
    }
  }

  const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm';
  const icon = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  if (loading) {
    return (
      <span className={`inline-flex items-center gap-2 rounded-xl bg-surface-2 text-fg-muted ${pad}`}>
        <Loader2 className={`${icon} animate-spin`} />
      </span>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      style={following ? undefined : { color: '#fff' }}
      className={`inline-flex items-center gap-2 rounded-xl font-bold transition-all disabled:opacity-60 ${pad} ${
        following
          ? 'bg-surface-2 text-fg border border-border hover:border-accent'
          : 'bg-accent hover:opacity-90'
      }`}
    >
      {busy ? <Loader2 className={`${icon} animate-spin`} /> : <Heart className={icon} fill={following ? 'currentColor' : 'none'} />}
      {following ? 'دنبال می‌کنی' : 'دنبال کردن'}
    </button>
  );
}

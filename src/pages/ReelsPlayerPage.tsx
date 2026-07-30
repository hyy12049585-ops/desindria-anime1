// src/pages/ReelsPlayerPage.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimeReels, type AnimeReel } from '../services/reelsService';
import {
  getReelReactions, setReelReaction, isReelInWatchlist, toggleReelWatchlist,
  getReelComments, addReelComment, type ReelComment, type Reaction,
} from '../services/reelInteractionsService';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowRight, Heart, ThumbsDown, Bookmark, MessageCircle,
  Volume2, VolumeX, X, Send, Loader2, Play,
} from 'lucide-react';

export default function ReelsPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reels, setReels] = useState<AnimeReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [commentsFor, setCommentsFor] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    let mounted = true;
    getAnimeReels()
      .then((r) => { if (mounted) setReels(r); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  // اسکرول به ریل موردنظر (اگر id در آدرس باشد)
  useEffect(() => {
    if (!id || reels.length === 0) return;
    const el = itemRefs.current[Number(id)];
    if (el) el.scrollIntoView();
  }, [id, reels]);

  if (loading) {
    return <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: '#000', color: '#fff' }}><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }
  if (reels.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#000', color: '#fff' }}>
        هنوز ریلی نیست.
        <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>بازگشت</button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="fixed inset-0 z-50" style={{ backgroundColor: '#000' }}>
      {/* دکمهٔ بازگشت */}
      <button onClick={() => navigate(-1)} aria-label="بازگشت"
        className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)', color: '#fff' }}>
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* دکمهٔ صدا */}
      <button onClick={() => setMuted((m) => !m)} aria-label="صدا"
        className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)', color: '#fff' }}>
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <div ref={containerRef} className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {reels.map((reel) => (
          <ReelItem
            key={reel.id}
            reel={reel}
            muted={muted}
            setRef={(el) => { itemRefs.current[reel.id] = el; }}
            onOpenComments={() => setCommentsFor(reel.id)}
          />
        ))}
      </div>

      {/* شیت کامنت‌ها */}
      {commentsFor !== null && (
        <CommentSheet reelId={commentsFor} onClose={() => setCommentsFor(null)} />
      )}
    </div>
  );
}

// ═══════════════ یک ریل تمام‌صفحه ═══════════════
function ReelItem({ reel, muted, setRef, onOpenComments }: {
  reel: AnimeReel; muted: boolean; setRef: (el: HTMLDivElement | null) => void; onOpenComments: () => void;
}) {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [reactions, setReactions] = useState({ likes: reel.likes, dislikes: 0, mine: null as Reaction | null });
  const [saved, setSaved] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  // بارگذاری وضعیت واکنش/واچ‌لیست/کامنت
  useEffect(() => {
    let m = true;
    getReelReactions(reel.id).then((r) => { if (m) setReactions(r); });
    isReelInWatchlist(reel.id).then((s) => { if (m) setSaved(s); });
    getReelComments(reel.id).then((c) => { if (m) setCommentCount(c.length); });
    return () => { m = false; };
  }, [reel.id]);

  // پخش/توقف بر اساس دیده‌شدن
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.intersectionRatio > 0.6),
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) { v.currentTime = 0; v.play().catch(() => {}); }
    else v.pause();
  }, [active]);

  function requireLogin(): boolean {
    if (confirm('برای این کار باید وارد حساب شوی. الان وارد شوی؟')) navigate('/auth/login');
    return false;
  }

  async function react(kind: Reaction) {
    const prev = reactions;
    // خوش‌بینانه
    setReactions((r) => {
      const removing = r.mine === kind;
      const likes = r.likes + (kind === 'like' ? (removing ? -1 : r.mine === 'dislike' ? 0 : 1) : (r.mine === 'like' ? -1 : 0));
      const dislikes = r.dislikes + (kind === 'dislike' ? (removing ? -1 : r.mine === 'like' ? 0 : 1) : (r.mine === 'dislike' ? -1 : 0));
      return { likes, dislikes, mine: removing ? null : kind };
    });
    try {
      await setReelReaction(reel.id, kind);
      setReactions(await getReelReactions(reel.id));
    } catch (e) {
      setReactions(prev);
      if (e instanceof Error && e.message.includes('وارد')) requireLogin();
    }
  }

  async function toggleSave() {
    const prev = saved;
    setSaved(!prev);
    try {
      setSaved(await toggleReelWatchlist(reel.id));
    } catch (e) {
      setSaved(prev);
      if (e instanceof Error && e.message.includes('وارد')) requireLogin();
    }
  }

  return (
    <div ref={(el) => { sectionRef.current = el; setRef(el); }}
      className="relative h-full w-full snap-start flex items-center justify-center overflow-hidden">
      {/* ویدیو */}
      {reel.videoUrl ? (
        <video ref={videoRef} src={reel.videoUrl} poster={reel.thumbnail}
          className="absolute inset-0 w-full h-full object-cover"
          loop muted={muted} playsInline preload="metadata" />
      ) : (
        <img src={reel.thumbnail} alt={reel.title} className="absolute inset-0 w-full h-full object-cover" />
      )}

      {/* پوشش گرادینتی */}
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 40%, transparent 75%, rgba(0,0,0,0.35) 100%)' }} />

      {/* آیکون پخش وسط اگر متوقف */}
      {!active && reel.videoUrl && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Play className="w-16 h-16" style={{ color: 'rgba(255,255,255,0.85)' }} />
        </span>
      )}

      {/* نوار اکشن (سمت چپ) */}
      <div className="absolute left-3 bottom-24 z-20 flex flex-col items-center gap-5">
        <ActionBtn active={reactions.mine === 'like'} icon={<Heart className="w-6 h-6" fill={reactions.mine === 'like' ? 'currentColor' : 'none'} />} count={reactions.likes} onClick={() => react('like')} />
        <ActionBtn active={reactions.mine === 'dislike'} icon={<ThumbsDown className="w-6 h-6" fill={reactions.mine === 'dislike' ? 'currentColor' : 'none'} />} count={reactions.dislikes} onClick={() => react('dislike')} />
        <ActionBtn active={saved} icon={<Bookmark className="w-6 h-6" fill={saved ? 'currentColor' : 'none'} />} label="ذخیره" onClick={toggleSave} />
        <ActionBtn icon={<MessageCircle className="w-6 h-6" />} count={commentCount} onClick={onOpenComments} />
      </div>

      {/* اطلاعات (پایین راست) */}
      <div className="absolute right-4 bottom-8 z-20 max-w-[70%]" style={{ color: '#fff' }}>
        <h2 className="text-lg font-bold drop-shadow">{reel.title}</h2>
        {reel.duration && <p className="text-sm opacity-80 mt-1">{reel.duration}</p>}
      </div>
    </div>
  );
}

function ActionBtn({ icon, count, label, active, onClick }: {
  icon: React.ReactNode; count?: number; label?: string; active?: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1" style={{ color: active ? 'var(--accent, #a855f7)' : '#fff' }}>
      <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}>
        {icon}
      </span>
      <span className="text-xs font-medium drop-shadow">{typeof count === 'number' ? count.toLocaleString('fa-IR') : label}</span>
    </button>
  );
}

// ═══════════════ شیت کامنت‌ها ═══════════════
function CommentSheet({ reelId, onClose }: { reelId: number; onClose: () => void }) {
  const navigate = useNavigate();
  const auth = useAuth();
  const profile = auth.profile;
  const [comments, setComments] = useState<ReelComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getReelComments(reelId).then(setComments).finally(() => setLoading(false));
  }, [reelId]);

  useEffect(() => { load(); }, [load]);

  async function send() {
    const t = text.trim();
    if (!t) return;
    setSending(true);
    try {
      await addReelComment(reelId, t, profile?.displayName || 'کاربر', profile?.avatar || '');
      setText('');
      load();
    } catch (e) {
      if (e instanceof Error && e.message.includes('وارد')) {
        if (confirm('برای ثبت نظر باید وارد حساب شوی. الان وارد شوی؟')) navigate('/auth/login');
      } else {
        alert('خطا در ثبت نظر');
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div dir="rtl" className="absolute inset-0 z-40 flex flex-col justify-end" onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded-t-2xl bg-surface border-t border-border max-h-[70%] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* سربرگ */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold">نظرات {comments.length ? `(${comments.length.toLocaleString('fa-IR')})` : ''}</h3>
          <button onClick={onClose} aria-label="بستن" className="p-1.5 rounded-lg hover:bg-surface-2"><X className="w-5 h-5" /></button>
        </div>

        {/* لیست */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center text-fg-muted py-8">در حال بارگذاری…</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-fg-muted py-8">هنوز نظری نیست. اولین نفر باش!</div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <span className="w-9 h-9 rounded-full overflow-hidden bg-surface-2 shrink-0 flex items-center justify-center text-xs font-bold text-accent">
                  {c.userAvatar ? <img src={c.userAvatar} alt="" className="w-full h-full object-cover" /> : (c.userName[0] || 'ک')}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-bold">{c.userName}</div>
                  <div className="text-sm text-fg-muted leading-6 break-words">{c.content}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ورودی */}
        <div className="p-3 border-t border-border flex items-center gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            placeholder="نظرت را بنویس…"
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-2 border border-border outline-none focus:border-accent text-sm" />
          <button onClick={send} disabled={sending || !text.trim()} aria-label="ارسال" style={{ color: '#fff' }}
            className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center hover:opacity-90 disabled:opacity-50 shrink-0">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

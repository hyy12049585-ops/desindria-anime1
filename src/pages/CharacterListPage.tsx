// src/pages/CharacterListPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCharacters, getAllFollowerCounts, type Character } from '../services/charactersService';
import FollowButton from '../components/characters/FollowButton';
import { Users, Crown, Heart, Star, User } from 'lucide-react';

const accentGradient = { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))' };

const MEDALS: Record<number, { ring: string; chip: React.CSSProperties }> = {
  1: { ring: '#FFD700', chip: { backgroundImage: 'linear-gradient(135deg,#FFD700,#FFA500)', color: '#7a4f00' } },
  2: { ring: '#C0C6CF', chip: { backgroundImage: 'linear-gradient(135deg,#E2E8F0,#94A3B8)', color: '#334155' } },
  3: { ring: '#CD7F32', chip: { backgroundImage: 'linear-gradient(135deg,#F0B27A,#CD7F32)', color: '#5a3210' } },
};

export default function CharacterListPage() {
  const [chars, setChars] = useState<Character[]>([]);
  const [followers, setFollowers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getAllCharacters(), getAllFollowerCounts()])
      .then(([cs, fc]) => { if (mounted) { setChars(cs); setFollowers(fc); } })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  function bump(id: string, d: number) {
    setFollowers((f) => ({ ...f, [id]: Math.max(0, (f[id] ?? 0) + d) }));
  }

  const top3 = chars.slice(0, 3);
  const rest = chars.slice(3);
  // ترتیب نمایش سکو: دوم، اول، سوم (اول وسط)
  const podiumOrder = [top3[1], top3[0], top3[2]];

  return (
    <div dir="rtl" className="themed-page min-h-screen pb-16">
      {/* هدر گرادینتی */}
      <div className="relative overflow-hidden" style={accentGradient}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 0%, transparent 40%)' }} />
        <div className="relative max-w-4xl mx-auto px-4 py-10 flex items-center gap-4" style={{ color: '#fff' }}>
          <span className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Users className="w-7 h-7" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">محبوب‌ترین کاراکترها</h1>
            <p className="opacity-90 text-sm mt-1">
              {loading ? 'در حال بارگذاری…' : `${chars.length.toLocaleString('fa-IR')} کاراکتر بر اساس محبوبیت`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {loading ? (
          <div className="text-center text-fg-muted py-16">در حال بارگذاری…</div>
        ) : chars.length === 0 ? (
          <div className="text-center text-fg-muted py-16">هنوز کاراکتری ثبت نشده.</div>
        ) : (
          <>
            {/* ───── سکوی ۳ نفر برتر ───── */}
            {top3.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end -mt-2 mb-8">
                {podiumOrder.map((c) =>
                  c ? <PodiumCard key={c.id} char={c} rank={chars.indexOf(c) + 1} followers={followers[c.id] ?? 0} onBump={bump} /> : <div key={Math.random()} />
                )}
              </div>
            )}

            {/* ───── بقیه ───── */}
            {rest.length > 0 && (
              <div className="space-y-3">
                {rest.map((c) => {
                  const rank = chars.indexOf(c) + 1;
                  return (
                    <div key={c.id}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-border bg-surface hover:bg-surface-2 hover:border-accent transition-all">
                      <span className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-black bg-surface-2 text-fg-muted text-sm">
                        {rank.toLocaleString('fa-IR')}
                      </span>
                      <Link to={`/character/${c.id}`} className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <span className="w-14 sm:w-16 rounded-xl overflow-hidden bg-surface-2 shrink-0 flex items-center justify-center" style={{ aspectRatio: '3/4' }}>
                          {c.image
                            ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                            : <User className="w-6 h-6 text-fg-subtle" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-bold truncate">{c.name}</span>
                          <span className="block text-xs text-fg-muted truncate mt-0.5">{c.anime}</span>
                          <span className="flex items-center gap-3 text-xs text-fg-muted mt-1.5">
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-accent" />{(followers[c.id] ?? 0).toLocaleString('fa-IR')} دنبال‌کننده</span>
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-accent" />{c.votes.toLocaleString('fa-IR')}</span>
                          </span>
                        </span>
                      </Link>
                      <div className="shrink-0">
                        <FollowButton characterId={c.id} size="sm" onChange={(f) => bump(c.id, f ? 1 : -1)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ───── کارت سکو ─────
function PodiumCard({ char, rank, followers, onBump }: {
  char: Character; rank: number; followers: number; onBump: (id: string, d: number) => void;
}) {
  const isFirst = rank === 1;
  const medal = MEDALS[rank];
  return (
    <div className={`relative rounded-2xl border bg-surface text-center overflow-hidden transition-transform hover:-translate-y-1 ${isFirst ? 'border-2' : 'border'}`}
      style={{ borderColor: isFirst ? 'var(--accent)' : 'var(--border-color)', paddingTop: isFirst ? 0 : 0 }}>
      {/* نوار رتبه بالا */}
      <div className="py-1.5 flex items-center justify-center gap-1 text-xs font-black" style={{ ...medal.chip }}>
        {isFirst ? <Crown className="w-4 h-4" /> : <span>{rank.toLocaleString('fa-IR')}</span>}
        {isFirst && <span>قهرمان</span>}
      </div>

      <Link to={`/character/${char.id}`} className="block p-3 sm:p-4">
        <span className={`mx-auto rounded-2xl overflow-hidden bg-surface-2 flex items-center justify-center mb-3 ${isFirst ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-16 h-16 sm:w-20 sm:h-20'}`}
          style={{ boxShadow: `0 0 0 3px ${medal.ring}` }}>
          {char.image
            ? <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
            : <User className="w-8 h-8 text-fg-subtle" />}
        </span>
        <div className="font-bold truncate text-sm sm:text-base">{char.name}</div>
        <div className="text-[11px] text-fg-muted truncate">{char.anime}</div>
        <div className="flex items-center justify-center gap-3 text-[11px] text-fg-muted mt-2">
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-accent" />{char.votes.toLocaleString('fa-IR')}</span>
          <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-accent" />{followers.toLocaleString('fa-IR')}</span>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <FollowButton characterId={char.id} size="sm" onChange={(f) => onBump(char.id, f ? 1 : -1)} />
      </div>
    </div>
  );
}

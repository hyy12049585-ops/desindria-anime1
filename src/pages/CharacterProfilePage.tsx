// src/pages/CharacterProfilePage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCharacterById, getFollowerCount, type Character } from '../services/charactersService';
import FollowButton from '../components/characters/FollowButton';
import { ArrowRight, Heart, Star, Mic, Cake, Ruler, User, Film, Award } from 'lucide-react';

const accentGradient = { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))' };

export default function CharacterProfilePage() {
  const { id } = useParams();
  const [char, setChar] = useState<Character | null>(null);
  const [followers, setFollowers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    setLoading(true);
    Promise.all([getCharacterById(id), getFollowerCount(id)])
      .then(([c, fc]) => { if (mounted) { setChar(c); setFollowers(fc); } })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return <div dir="rtl" className="themed-page min-h-screen flex items-center justify-center text-fg-muted">در حال بارگذاری…</div>;
  }
  if (!char) {
    return (
      <div dir="rtl" className="themed-page min-h-screen flex flex-col items-center justify-center gap-4 text-fg-muted">
        کاراکتر پیدا نشد.
        <Link to="/characters" className="text-accent font-bold">بازگشت به لیست کاراکترها</Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="themed-page min-h-screen pb-16">
      {/* بنر */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden" style={!char.banner ? accentGradient : undefined}>
        {char.banner && <img src={char.banner} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, var(--bg-primary) 8%, transparent 75%)' }} />
        <Link to="/characters"
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', color: '#fff' }}>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* سربرگ: عکس + نام */}
        <div className="relative -mt-24 sm:-mt-28 flex flex-col sm:flex-row items-center sm:items-end gap-5">
          <div className="w-40 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden border-4 bg-surface-2 shrink-0 shadow-2xl flex items-center justify-center"
            style={{ borderColor: 'var(--bg-primary)' }}>
            {char.image
              ? <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
              : <User className="w-14 h-14 text-fg-subtle" />}
          </div>
          <div className="flex-1 text-center sm:text-right pb-2 min-w-0 w-full">
            {char.role && (
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-2" style={{ ...accentGradient, color: '#fff' }}>
                {char.role}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-black leading-tight">{char.name}</h1>
            {char.nameJapanese && <p className="text-fg-muted mt-1 text-lg">{char.nameJapanese}</p>}
            {char.anime && (
              <p className="flex items-center justify-center sm:justify-start gap-1.5 text-fg-muted mt-2">
                <Film className="w-4 h-4 text-accent" /> از {char.anime}
              </p>
            )}
            <div className="mt-4 flex justify-center sm:justify-start">
              <FollowButton characterId={char.id} size="md" onChange={(f) => setFollowers((n) => Math.max(0, n + (f ? 1 : -1)))} />
            </div>
          </div>
        </div>

        {/* آمار */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          <StatCard icon={<Heart className="w-5 h-5" />} value={followers} label="دنبال‌کننده" />
          <StatCard icon={<Star className="w-5 h-5" />} value={char.votes} label="رأی" />
          <StatCard icon={<Award className="w-5 h-5" />} value={Math.max(0, char.favorites)} label="علاقه‌مندی" />
        </div>

        {/* مشخصات + بیوگرافی */}
        <div className="grid lg:grid-cols-[260px_1fr] gap-5 mt-6">
          <aside className="rounded-2xl border border-border bg-surface p-5 h-fit">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-accent" /> مشخصات
            </h2>
            <div className="space-y-3">
              <DetailRow icon={<Film className="w-4 h-4" />} label="انیمه" value={char.anime} />
              <DetailRow icon={<Award className="w-4 h-4" />} label="نقش" value={char.role} />
              <DetailRow icon={<Mic className="w-4 h-4" />} label="صداپیشه" value={char.voiceActor} />
              <DetailRow icon={<Cake className="w-4 h-4" />} label="تاریخ تولد" value={char.birthday} />
              <DetailRow icon={<User className="w-4 h-4" />} label="سن" value={char.age} />
              <DetailRow icon={<Ruler className="w-4 h-4" />} label="قد" value={char.height} />
            </div>
          </aside>

          <main className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-accent" /> بیوگرافی
            </h2>
            {char.bio
              ? <p className="text-fg-muted leading-9 whitespace-pre-line">{char.bio}</p>
              : <p className="text-fg-subtle">برای این کاراکتر هنوز بیوگرافی ثبت نشده.</p>}
          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 text-center">
      <span className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
        style={{ backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))', color: '#fff' }}>
        {icon}
      </span>
      <div className="font-black text-xl">{value.toLocaleString('fa-IR')}</div>
      <div className="text-xs text-fg-muted mt-0.5">{label}</div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 h-8 rounded-lg bg-surface-2 text-accent flex items-center justify-center shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs text-fg-muted">{label}</div>
        <div className="font-bold text-sm truncate">{value}</div>
      </div>
    </div>
  );
}

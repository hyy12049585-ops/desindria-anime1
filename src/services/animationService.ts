// src/services/animationService.ts
import { supabase } from '../lib/supabaseClient';
import type { Animation, AnimationCharacter } from '../data/animationData';

const SELECT =
  'id,title,title_en,poster,banner,rating,year,duration,studio,director,country,genres,synopsis,characters,is_trending,is_new,view_count';

function mapRow(r: Record<string, unknown>): Animation {
  return {
    id: r.id as number,
    title: (r.title as string) || '',
    titleEn: (r.title_en as string) || '',
    poster: (r.poster as string) || '',
    banner: (r.banner as string) || '',
    rating: (r.rating as number) ?? 0,
    year: (r.year as number) ?? 0,
    duration: (r.duration as string) || '',
    studio: (r.studio as string) || '',
    director: (r.director as string) || '',
    country: (r.country as string) || '',
    genres: (r.genres as string[]) || [],
    synopsis: (r.synopsis as string) || '',
    characters: (r.characters as AnimationCharacter[]) || [],
    isTrending: !!r.is_trending,
    isNew: !!r.is_new,
  } as Animation;
}

export async function getAllAnimations(): Promise<Animation[]> {
  const { data, error } = await supabase.from('animations').select(SELECT).order('id', { ascending: true });
  if (error) { console.error('خواندن انیمیشن‌ها:', error.message); return []; }
  return (data || []).map(mapRow);
}

export async function getAnimationById(id: number | string): Promise<Animation | null> {
  const { data, error } = await supabase.from('animations').select(SELECT).eq('id', Number(id)).maybeSingle();
  if (error) { console.error('خواندن انیمیشن:', error.message); return null; }
  return data ? mapRow(data) : null;
}

export async function getSimilarAnimations(id: number | string, limit = 6): Promise<Animation[]> {
  const all = await getAllAnimations();
  const current = all.find((a) => String(a.id) === String(id));
  if (!current) return [];
  return all
    .filter((a) => String(a.id) !== String(id) && a.genres.some((g) => current.genres.includes(g)))
    .slice(0, limit);
}

export async function searchAnimations(query: string): Promise<Animation[]> {
  const q = query.trim();
  const all = await getAllAnimations();
  if (!q) return all;
  const lower = q.toLowerCase();
  return all.filter((a) => a.title.includes(q) || (a.titleEn || '').toLowerCase().includes(lower));
}

export async function getAllAnimationGenres(): Promise<string[]> {
  const all = await getAllAnimations();
  return Array.from(new Set(all.flatMap((a) => a.genres)));
}

// همهٔ کاراکترهای انیمیشن‌ها (با اطلاعات انیمیشن مادر)
export async function getAllAnimationCharacters(): Promise<(AnimationCharacter & { animationTitle: string; animationId: number })[]> {
  const all = await getAllAnimations();
  return all.flatMap((a) =>
    (a.characters || []).map((c) => ({ ...c, animationTitle: a.title, animationId: a.id }))
  );
}

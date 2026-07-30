// src/services/charactersService.ts
import { supabase } from '../lib/supabaseClient';

// ─── کاراکتر محبوب (برای کاروسل صفحهٔ خونه) ───
export interface PopularCharacter {
  id: string;
  name: string;
  anime: string;
  image: string;
  votes: number;
}

// ─── کاراکتر کامل (برای لیست و پروفایل) ───
export interface Character {
  id: string;
  name: string;
  nameJapanese: string;
  anime: string;
  image: string;
  banner: string;
  role: string;
  bio: string;
  voiceActor: string;
  birthday: string;
  age: string;
  height: string;
  votes: number;
  favorites: number;
}

function mapPopular(r: Record<string, unknown>): PopularCharacter {
  return {
    id: String(r.id),
    name: (r.name as string) || '',
    anime: (r.anime as string) || '',
    image: (r.image as string) || '',
    votes: (r.votes as number) ?? 0,
  };
}

function mapCharacter(r: Record<string, unknown>): Character {
  return {
    id: String(r.id),
    name: (r.name as string) || '',
    nameJapanese: (r.name_japanese as string) || '',
    anime: (r.anime as string) || '',
    image: (r.image as string) || '',
    banner: (r.banner as string) || '',
    role: (r.role as string) || '',
    bio: (r.bio as string) || '',
    voiceActor: (r.voice_actor as string) || '',
    birthday: (r.birthday as string) || '',
    age: (r.age as string) || '',
    height: (r.height as string) || '',
    votes: (r.votes as number) ?? 0,
    favorites: (r.favorites as number) ?? 0,
  };
}

const FULL_COLUMNS =
  'id, name, name_japanese, anime, image, banner, role, bio, voice_actor, birthday, age, height, votes, favorites';

// ─── کاراکترهای محبوب (کاروسل خونه) ───
export async function getPopularCharacters(): Promise<PopularCharacter[]> {
  const { data, error } = await supabase
    .from('characters')
    .select('id, name, anime, image, votes')
    .order('votes', { ascending: false });
  if (error) {
    console.error('خطا در خواندن کاراکترها:', error.message);
    return [];
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapPopular);
}

// ─── همهٔ کاراکترها، رتبه‌بندی‌شده بر اساس رأی ───
export async function getAllCharacters(): Promise<Character[]> {
  const { data, error } = await supabase
    .from('characters')
    .select(FULL_COLUMNS)
    .order('votes', { ascending: false });
  if (error) {
    console.error('خطا در خواندن کاراکترها:', error.message);
    return [];
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapCharacter);
}

// ─── یک کاراکتر با id ───
export async function getCharacterById(id: string | number): Promise<Character | null> {
  const { data, error } = await supabase
    .from('characters')
    .select(FULL_COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('خطا در خواندن کاراکتر:', error.message);
    return null;
  }
  return data ? mapCharacter(data as Record<string, unknown>) : null;
}

// ═══════════════ سیستم دنبال‌کردن ═══════════════

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// آیا کاربر فعلی این کاراکتر را دنبال می‌کند؟
export async function isFollowingCharacter(characterId: string): Promise<boolean> {
  const uid = await currentUserId();
  if (!uid) return false;
  const { data, error } = await supabase
    .from('character_follows')
    .select('character_id')
    .eq('user_id', uid)
    .eq('character_id', String(characterId))
    .maybeSingle();
  if (error) {
    console.error('خطا در بررسی دنبال‌کردن:', error.message);
    return false;
  }
  return !!data;
}

// دنبال‌کردن (اگر وارد نشده باشد خطا می‌دهد)
export async function followCharacter(characterId: string): Promise<void> {
  const uid = await currentUserId();
  if (!uid) throw new Error('برای دنبال‌کردن باید وارد حساب شوی');
  const { error } = await supabase
    .from('character_follows')
    .insert({ user_id: uid, character_id: String(characterId) });
  // 23505 = تکراری (قبلاً دنبال شده) → نادیده بگیر
  if (error && error.code !== '23505') {
    console.error('خطا در دنبال‌کردن:', error.message);
    throw error;
  }
}

// لغو دنبال‌کردن
export async function unfollowCharacter(characterId: string): Promise<void> {
  const uid = await currentUserId();
  if (!uid) return;
  const { error } = await supabase
    .from('character_follows')
    .delete()
    .eq('user_id', uid)
    .eq('character_id', String(characterId));
  if (error) {
    console.error('خطا در لغو دنبال‌کردن:', error.message);
    throw error;
  }
}

// تعداد دنبال‌کننده‌های یک کاراکتر
export async function getFollowerCount(characterId: string): Promise<number> {
  const { count, error } = await supabase
    .from('character_follows')
    .select('*', { count: 'exact', head: true })
    .eq('character_id', String(characterId));
  if (error) {
    console.error('خطا در شمارش دنبال‌کننده:', error.message);
    return 0;
  }
  return count ?? 0;
}

// تعداد دنبال‌کننده‌های همهٔ کاراکترها → { id: count }
export async function getAllFollowerCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('character_follows').select('character_id');
  if (error) {
    console.error('خطا در شمارش دنبال‌کننده‌ها:', error.message);
    return {};
  }
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { character_id: string }[]) {
    const id = String(row.character_id);
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

// کاراکترهایی که کاربر فعلی دنبال می‌کند (برای صفحهٔ پروفایل)
export async function getMyFollowedCharacters(): Promise<Character[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data: follows, error: fErr } = await supabase
    .from('character_follows')
    .select('character_id')
    .eq('user_id', uid);
  if (fErr) {
    console.error('خطا در خواندن دنبال‌شده‌ها:', fErr.message);
    return [];
  }
  const ids = (follows ?? []).map((r) => (r as { character_id: string }).character_id);
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from('characters')
    .select(FULL_COLUMNS)
    .in('id', ids)
    .order('votes', { ascending: false });
  if (error) {
    console.error('خطا در خواندن کاراکترهای دنبال‌شده:', error.message);
    return [];
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapCharacter);
}

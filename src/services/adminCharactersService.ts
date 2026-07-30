// src/services/adminCharactersService.ts
import { supabase } from '../lib/supabaseClient';

export interface AdminCharacter {
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

const COLUMNS =
  'id, name, name_japanese, anime, image, banner, role, bio, voice_actor, birthday, age, height, votes, favorites';

function mapRow(r: Record<string, unknown>): AdminCharacter {
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

function toRow(a: Omit<AdminCharacter, 'id'>) {
  return {
    name: a.name,
    name_japanese: a.nameJapanese || null,
    anime: a.anime || null,
    image: a.image,
    banner: a.banner || null,
    role: a.role || null,
    bio: a.bio || null,
    voice_actor: a.voiceActor || null,
    birthday: a.birthday || null,
    age: a.age || null,
    height: a.height || null,
    votes: a.votes,
    favorites: a.favorites,
  };
}

export async function listCharacters(): Promise<AdminCharacter[]> {
  const { data, error } = await supabase
    .from('characters')
    .select(COLUMNS)
    .order('votes', { ascending: false });
  if (error) {
    console.error('خطا در خواندن کاراکترها:', error.message);
    throw error;
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapRow);
}

export async function createCharacter(a: Omit<AdminCharacter, 'id'>): Promise<void> {
  const { data: idRows, error: idErr } = await supabase.from('characters').select('id');
  if (idErr) {
    console.error('خطا در خواندن idها:', idErr.message);
    throw idErr;
  }
  const ids = (idRows ?? []).map((r) => String((r as { id: unknown }).id));
  const allNumeric = ids.length > 0 && ids.every((s) => /^\d+$/.test(s));
  const newId: number | string = allNumeric ? Math.max(...ids.map(Number)) + 1 : Date.now().toString();

  const { error } = await supabase.from('characters').insert({ id: newId, ...toRow(a) });
  if (error) {
    console.error('خطا در افزودن کاراکتر:', error.message);
    throw error;
  }
}

export async function updateCharacter(id: string, a: Omit<AdminCharacter, 'id'>): Promise<void> {
  const { error } = await supabase.from('characters').update(toRow(a)).eq('id', id);
  if (error) {
    console.error('خطا در ویرایش کاراکتر:', error.message);
    throw error;
  }
}

export async function deleteCharacter(id: string): Promise<void> {
  const { error } = await supabase.from('characters').delete().eq('id', id);
  if (error) {
    console.error('خطا در حذف کاراکتر:', error.message);
    throw error;
  }
}

export async function uploadCharacterImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `characters/${Date.now()}-${rand}.${ext}`;

  const { error } = await supabase.storage
    .from('anime-images')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) {
    console.error('خطا در آپلود عکس:', error.message);
    throw error;
  }

  const { data } = supabase.storage.from('anime-images').getPublicUrl(path);
  return data.publicUrl;
}

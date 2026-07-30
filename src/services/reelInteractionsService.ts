// src/services/reelInteractionsService.ts
import { supabase } from '../lib/supabaseClient';

export type Reaction = 'like' | 'dislike';

export interface ReelComment {
  id: number;
  reelId: number;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

async function uid(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// ─── شمارش لایک/دیس‌لایک یک ریل + واکنش کاربر فعلی ───
export interface ReelReactionState {
  likes: number;
  dislikes: number;
  mine: Reaction | null;
}

export async function getReelReactions(reelId: number): Promise<ReelReactionState> {
  const { data, error } = await supabase
    .from('reel_reactions')
    .select('user_id, reaction')
    .eq('reel_id', reelId);
  if (error) {
    console.error('خطا در خواندن واکنش‌ها:', error.message);
    return { likes: 0, dislikes: 0, mine: null };
  }
  const me = await uid();
  let likes = 0, dislikes = 0, mine: Reaction | null = null;
  for (const r of (data ?? []) as { user_id: string; reaction: Reaction }[]) {
    if (r.reaction === 'like') likes++;
    else if (r.reaction === 'dislike') dislikes++;
    if (me && r.user_id === me) mine = r.reaction;
  }
  return { likes, dislikes, mine };
}

// ثبت/تغییر/حذف واکنش (زدن دوباره روی همون = حذف)
export async function setReelReaction(reelId: number, reaction: Reaction): Promise<void> {
  const me = await uid();
  if (!me) throw new Error('برای واکنش باید وارد حساب شوی');

  // واکنش فعلی چیست؟
  const { data: existing } = await supabase
    .from('reel_reactions')
    .select('reaction')
    .eq('user_id', me)
    .eq('reel_id', reelId)
    .maybeSingle();

  const current = (existing as { reaction: Reaction } | null)?.reaction ?? null;

  if (current === reaction) {
    // همون واکنش دوباره → حذف (toggle off)
    const { error } = await supabase.from('reel_reactions').delete().eq('user_id', me).eq('reel_id', reelId);
    if (error) throw error;
    return;
  }

  // درج یا به‌روزرسانی
  const { error } = await supabase
    .from('reel_reactions')
    .upsert({ user_id: me, reel_id: reelId, reaction }, { onConflict: 'user_id,reel_id' });
  if (error) throw error;
}

// ─── واچ‌لیست ───
export async function isReelInWatchlist(reelId: number): Promise<boolean> {
  const me = await uid();
  if (!me) return false;
  const { data } = await supabase
    .from('reel_watchlist')
    .select('reel_id')
    .eq('user_id', me)
    .eq('reel_id', reelId)
    .maybeSingle();
  return !!data;
}

export async function toggleReelWatchlist(reelId: number): Promise<boolean> {
  const me = await uid();
  if (!me) throw new Error('برای ذخیره باید وارد حساب شوی');
  const inList = await isReelInWatchlist(reelId);
  if (inList) {
    const { error } = await supabase.from('reel_watchlist').delete().eq('user_id', me).eq('reel_id', reelId);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase.from('reel_watchlist').insert({ user_id: me, reel_id: reelId });
    if (error && error.code !== '23505') throw error;
    return true;
  }
}

// ─── کامنت‌ها ───
function mapComment(r: Record<string, unknown>): ReelComment {
  return {
    id: r.id as number,
    reelId: r.reel_id as number,
    userId: (r.user_id as string) || '',
    userName: (r.user_name as string) || 'کاربر',
    userAvatar: (r.user_avatar as string) || '',
    content: (r.content as string) || '',
    createdAt: (r.created_at as string) || '',
  };
}

export async function getReelComments(reelId: number): Promise<ReelComment[]> {
  const { data, error } = await supabase
    .from('reel_comments')
    .select('id, reel_id, user_id, user_name, user_avatar, content, created_at')
    .eq('reel_id', reelId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('خطا در خواندن کامنت‌ها:', error.message);
    return [];
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapComment);
}

export async function addReelComment(
  reelId: number,
  content: string,
  userName: string,
  userAvatar: string,
): Promise<void> {
  const me = await uid();
  if (!me) throw new Error('برای ثبت نظر باید وارد حساب شوی');
  const { error } = await supabase.from('reel_comments').insert({
    reel_id: reelId,
    user_id: me,
    user_name: userName || 'کاربر',
    user_avatar: userAvatar || null,
    content: content.trim(),
  });
  if (error) throw error;
}

export async function deleteReelComment(commentId: number): Promise<void> {
  const { error } = await supabase.from('reel_comments').delete().eq('id', commentId);
  if (error) throw error;
}

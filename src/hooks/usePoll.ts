// src/hooks/usePoll.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export interface PollOption {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  baseVotes: number;
  votes: number; // baseVotes + رأی‌های واقعی
}

export interface PollComment {
  id: string;
  userId: string;
  username: string;
  text: string;
  parentId: string | null;
  createdAt: string;
  replies: PollComment[];
}

export interface PollData {
  id: string;
  question: string;
  endsAt: string | null;
}

export function usePoll(kind: 'weekly' | 'character') {
  const { profile } = useAuth();
  const userId = profile?.id || '';
  const isLoggedIn = !!profile?.isLoggedIn && !!userId;
  const displayName = profile?.displayName || profile?.username || 'کاربر';

  const [poll, setPoll] = useState<PollData | null>(null);
  const [options, setOptions] = useState<PollOption[]>([]);
  const [comments, setComments] = useState<PollComment[]>([]);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ── بارگذاری کامل نظرسنجی ──
  const loadPoll = useCallback(async () => {
    setLoading(true);
    // ۱. خود نظرسنجی فعال این نوع
    const { data: pollRow, error: pollErr } = await supabase
      .from('polls')
      .select('id, question, ends_at')
      .eq('kind', kind)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pollErr || !pollRow) {
      if (pollErr) console.error('خواندن نظرسنجی:', pollErr.message);
      setLoading(false);
      return;
    }
    const pollId = pollRow.id as string;
    setPoll({ id: pollId, question: pollRow.question as string, endsAt: pollRow.ends_at as string | null });

    // ۲. گزینه‌ها
    const { data: opts } = await supabase
      .from('poll_options')
      .select('id, title, subtitle, image, base_votes, sort_order')
      .eq('poll_id', pollId)
      .order('sort_order', { ascending: true });

    // ۳. شمارش رأی‌های واقعی هر گزینه
    const { data: votes } = await supabase
      .from('poll_votes')
      .select('option_id, user_id')
      .eq('poll_id', pollId);

    const voteCount: Record<string, number> = {};
    (votes || []).forEach((v) => {
      voteCount[v.option_id as string] = (voteCount[v.option_id as string] || 0) + 1;
    });

    // آیا این کاربر رأی داده؟
    const myVote = (votes || []).find((v) => String(v.user_id) === String(userId));
    setVotedOptionId(myVote ? (myVote.option_id as string) : null);

    setOptions(
      (opts || []).map((o) => {
        const base = (o.base_votes as number) || 0;
        return {
          id: o.id as string,
          title: o.title as string,
          subtitle: (o.subtitle as string) ?? null,
          image: (o.image as string) ?? null,
          baseVotes: base,
          votes: base + (voteCount[o.id as string] || 0),
        };
      })
    );

    // ۴. کامنت‌ها (تخت) → درختی
    const { data: cmts } = await supabase
      .from('poll_comments')
      .select('id, user_id, username, text, parent_id, created_at')
      .eq('poll_id', pollId)
      .order('created_at', { ascending: true });

    const flat: PollComment[] = (cmts || []).map((c) => ({
      id: c.id as string,
      userId: c.user_id as string,
      username: (c.username as string) || 'کاربر',
      text: c.text as string,
      parentId: (c.parent_id as string) ?? null,
      createdAt: c.created_at as string,
      replies: [],
    }));
    const byId: Record<string, PollComment> = {};
    flat.forEach((c) => (byId[c.id] = c));
    const roots: PollComment[] = [];
    flat.forEach((c) => {
      if (c.parentId && byId[c.parentId]) byId[c.parentId].replies.push(c);
      else roots.push(c);
    });
    // جدیدترین کامنت‌های ریشه بالا
    roots.reverse();
    setComments(roots);
    setLoading(false);
  }, [kind, userId]);

  useEffect(() => {
    loadPoll();
  }, [loadPoll]);

  const totalVotes = options.reduce((s, o) => s + o.votes, 0);
  const totalComments = comments.reduce((s, c) => s + 1 + c.replies.length, 0);
  const hasVoted = votedOptionId !== null;

  // ── ثبت رأی ──
  const vote = useCallback(async (optionId: string) => {
    if (!poll || hasVoted) return { ok: false, reason: 'done' as const };
    if (!isLoggedIn) return { ok: false, reason: 'auth' as const };

    // خوش‌بینانه: محلی به‌روزرسانی کن
    setVotedOptionId(optionId);
    setOptions((prev) => prev.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)));

    const { error } = await supabase
      .from('poll_votes')
      .insert({ poll_id: poll.id, option_id: optionId, user_id: userId });

    if (error) {
      console.error('ثبت رأی:', error.message);
      // برگرداندن در صورت خطا
      setVotedOptionId(null);
      setOptions((prev) => prev.map((o) => (o.id === optionId ? { ...o, votes: o.votes - 1 } : o)));
      return { ok: false, reason: 'error' as const };
    }
    return { ok: true as const };
  }, [poll, hasVoted, isLoggedIn, userId]);

  // ── افزودن کامنت / پاسخ ──
  const addComment = useCallback(async (text: string, parentId: string | null = null) => {
    if (!poll || !text.trim()) return { ok: false, reason: 'empty' as const };
    if (!isLoggedIn) return { ok: false, reason: 'auth' as const };

    const { data, error } = await supabase
      .from('poll_comments')
      .insert({ poll_id: poll.id, user_id: userId, username: displayName, text: text.trim(), parent_id: parentId })
      .select('id, user_id, username, text, parent_id, created_at')
      .single();

    if (error || !data) {
      console.error('افزودن کامنت:', error?.message);
      return { ok: false, reason: 'error' as const };
    }

    const newComment: PollComment = {
      id: data.id as string,
      userId: data.user_id as string,
      username: (data.username as string) || displayName,
      text: data.text as string,
      parentId: (data.parent_id as string) ?? null,
      createdAt: data.created_at as string,
      replies: [],
    };

    setComments((prev) => {
      if (!parentId) return [newComment, ...prev];
      return prev.map((c) => (c.id === parentId ? { ...c, replies: [...c.replies, newComment] } : c));
    });
    return { ok: true as const };
  }, [poll, isLoggedIn, userId, displayName]);

  return {
    poll, options, comments, votedOptionId, hasVoted, loading,
    totalVotes, totalComments, isLoggedIn,
    vote, addComment, reload: loadPoll,
  };
}

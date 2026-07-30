// src/components/polls/CharacterPoll.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, ChevronDown, ChevronUp, Reply, Send } from 'lucide-react';
import { usePoll } from '../../../hooks/usePoll';

const CharacterPoll: React.FC = () => {
  const {
    poll, options, comments, votedOptionId, hasVoted, loading,
    totalVotes, totalComments, isLoggedIn, vote, addComment,
  } = usePoll('character');

  const [selected, setSelected] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [notice, setNotice] = useState('');

  const sorted = [...options].sort((a, b) => b.votes - a.votes);

  const handleVote = async () => {
    if (!selected || hasVoted) return;
    const res = await vote(selected);
    if (!res.ok && res.reason === 'auth') setNotice('برای رأی دادن باید وارد حساب شوی');
  };
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const res = await addComment(newComment);
    if (res.ok) setNewComment('');
    else if (res.reason === 'auth') setNotice('برای ثبت نظر باید وارد حساب شوی');
  };
  const handleAddReply = async (parentId: string) => {
    if (!replyText.trim()) return;
    const res = await addComment(replyText, parentId);
    if (res.ok) { setReplyText(''); setReplyingTo(null); }
    else if (res.reason === 'auth') setNotice('برای پاسخ دادن باید وارد حساب شوی');
  };

  if (loading) {
    return (
      <div dir="rtl" className="rounded-3xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-44 rounded" style={{ background: 'var(--bg-hover)' }} />
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 rounded-2xl" style={{ background: 'var(--bg-hover)' }} />)}
        </div>
      </div>
    );
  }
  if (!poll) {
    return (
      <div dir="rtl" className="rounded-3xl p-6 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
        نظرسنجی فعالی موجود نیست
      </div>
    );
  }

  return (
    <div dir="rtl" className="rounded-3xl p-6 relative overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 12px 40px rgba(0,0,0,0.16), 0 0 50px color-mix(in srgb, var(--accent) 12%, transparent)' }}>

      <div className="absolute top-0 inset-x-0 h-1" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))' }} />
      <div className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full blur-[90px] opacity-20" style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }} />

      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full"
          style={{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
          <Sparkles size={12} /> نظرسنجی کاراکتر
        </span>
      </div>
      <h3 className="text-base font-extrabold mb-5" style={{ color: 'var(--text-primary)' }}>{poll.question}</h3>

      <div className="space-y-3 mb-5">
        {sorted.map((opt, i) => {
          const pct = Math.round((opt.votes / (totalVotes || 1)) * 100);
          const isSel = selected === opt.id;
          const isVoted = votedOptionId === opt.id;
          const isWinner = hasVoted && i === 0;
          return (
            <motion.div key={opt.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => !hasVoted && setSelected(opt.id)}
              className="relative rounded-2xl overflow-hidden cursor-pointer transition-all"
              style={{
                background: (isSel && !hasVoted) ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--bg-hover)',
                border: (isSel || isVoted) ? '1.5px solid var(--accent)' : isWinner ? '1.5px solid color-mix(in srgb, var(--accent) 55%, transparent)' : '1px solid var(--border-color)',
                boxShadow: (isVoted || isWinner) ? '0 6px 22px color-mix(in srgb, var(--accent) 25%, transparent)' : 'none',
              }}>
              {hasVoted && (
                <motion.div className="absolute inset-y-0 right-0" initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--accent) 22%, transparent), color-mix(in srgb, var(--accent) 6%, transparent))' }} />
              )}
              <div className="flex items-center gap-3 px-3.5 py-3 relative z-10">
                <span className="w-8 h-8 rounded-xl grid place-items-center text-xs font-black flex-shrink-0"
                  style={{ color: (isVoted || isWinner) ? '#fff' : 'var(--accent)', background: (isVoted || isWinner) ? 'linear-gradient(135deg, var(--accent), var(--accent-secondary))' : 'color-mix(in srgb, var(--accent) 14%, transparent)', boxShadow: (isVoted || isWinner) ? '0 4px 14px var(--accent-glow)' : 'none' }}>{i + 1}</span>
                {opt.image && (
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2" style={{ borderColor: 'var(--accent)', boxShadow: (isVoted || isWinner) ? '0 0 12px var(--accent-glow)' : 'none' }}>
                    <img src={opt.image} alt={opt.title} className="w-full h-full object-cover"
                      onError={e => ((e.target as HTMLImageElement).src = `https://placehold.co/80x80/1a1a2e/ffffff?text=${opt.title[0]}`)} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold truncate flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                    {opt.title}
                    {isWinner && <Sparkles size={12} style={{ color: 'var(--accent)' }} />}
                  </p>
                </div>
                <div className="flex-shrink-0 min-w-[42px] text-left">
                  {hasVoted
                    ? <span className="text-base font-black" style={{ color: 'var(--accent)' }}>{pct}%</span>
                    : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{opt.votes.toLocaleString('fa-IR')}</span>}
                </div>
                {isSel && !hasVoted && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full grid place-items-center flex-shrink-0" style={{ background: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)' }}>
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {!hasVoted ? (
        <motion.button whileTap={{ scale: 0.97 }} disabled={!selected} onClick={handleVote}
          className="w-full py-3 rounded-2xl text-sm font-bold transition-all"
          style={{
            background: selected ? 'linear-gradient(90deg, var(--accent), var(--accent-secondary))' : 'var(--bg-hover)',
            color: selected ? 'white' : 'var(--text-muted)',
            boxShadow: selected ? '0 8px 24px var(--accent-glow)' : 'none',
            cursor: selected ? 'pointer' : 'not-allowed',
          }}>ثبت رأی</motion.button>
      ) : (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs font-bold" style={{ color: 'var(--accent)' }}>✓ رأی شما ثبت شد</motion.p>
      )}

      {notice && <p className="text-center text-xs mt-2" style={{ color: '#f87171' }}>{notice}</p>}
      <p className="text-center text-[11px] mt-3" style={{ color: 'var(--text-muted)' }}>{totalVotes.toLocaleString('fa-IR')} رأی کل</p>

      <button onClick={() => setShowComments(!showComments)}
        className="w-full mt-4 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold"
        style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
        <MessageCircle size={16} style={{ color: 'var(--accent)' }} />
        <span>بحث و گفتگو</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({totalComments} نظر)</span>
        {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="mt-4 space-y-4 overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--accent)' }}>ش</div>
              <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                placeholder={isLoggedIn ? 'نظرت رو بنویس...' : 'برای نظر دادن وارد شو'} disabled={!isLoggedIn}
                className="flex-1 py-2 px-3 rounded-xl text-sm outline-none disabled:opacity-60"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
              <button onClick={handleAddComment} disabled={!isLoggedIn} className="p-2 rounded-full disabled:opacity-50" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))' }}>
                <Send size={14} className="text-white" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {comments.length === 0 && (
                <p className="text-center text-xs py-4" style={{ color: 'var(--text-muted)' }}>هنوز نظری ثبت نشده — اولین نفر باش!</p>
              )}
              {comments.map(c => (
                <div key={c.id} className="rounded-xl p-3" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-color)' }}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--accent)' }}>{c.username[0]}</div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>{c.username}</span>
                      <p className="text-xs leading-relaxed mb-2 mt-1" style={{ color: 'var(--text-secondary)' }}>{c.text}</p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)} className="flex items-center gap-1 outline-none" style={{ color: 'var(--text-muted)' }}>
                          <Reply size={13} /><span className="text-[10px]">پاسخ</span>
                        </button>
                        {c.replies.length > 0 && <span className="text-[10px] font-bold" style={{ color: 'var(--accent)' }}>{c.replies.length} پاسخ</span>}
                      </div>

                      <AnimatePresence>
                        {replyingTo === c.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 flex items-center gap-2">
                            <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddReply(c.id)}
                              placeholder="پاسخت رو بنویس..." className="flex-1 py-1.5 px-2.5 rounded-lg text-xs outline-none"
                              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                            <button onClick={() => handleAddReply(c.id)} className="p-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))' }}>
                              <Send size={12} className="text-white" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {c.replies.length > 0 && (
                        <div className="mt-3 mr-4 space-y-2 pr-3" style={{ borderRight: '2px solid color-mix(in srgb, var(--accent) 25%, transparent)' }}>
                          {c.replies.map(r => (
                            <div key={r.id} className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-full grid place-items-center text-[9px] font-bold text-white shrink-0" style={{ background: 'var(--accent)' }}>{r.username[0]}</div>
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-[10px]" style={{ color: 'var(--text-primary)' }}>{r.username}</span>
                                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CharacterPoll;

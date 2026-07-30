import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // وقتی کاربر روی لینک ایمیل کلیک می‌کند، یک نشست بازیابی ساخته می‌شود
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    if (password !== confirm) {
      setError('تکرار رمز عبور مطابقت ندارد');
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        console.error('update password error:', err.message);
        setError('لینک منقضی شده یا نامعتبر است. دوباره درخواست بازیابی بده');
        return;
      }
      setDone(true);
      // خروج از نشست بازیابی و هدایت به ورود
      await supabase.auth.signOut();
      setTimeout(() => navigate('/auth/login', { replace: true }), 2000);
    } catch {
      setError('خطا در تغییر رمز عبور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-30 blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-100 to-purple-200 rounded-full opacity-25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className={`relative z-10 w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-100/50 border border-white/60 p-8 sm:p-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-300/50 rotate-3">
              <span className="text-white text-3xl font-extrabold tracking-tight">S</span>
            </div>
          </div>

          {done ? (
            <div className="text-center">
              <ShieldCheck size={56} className="text-green-500 mx-auto mb-4" />
              <h1 className="text-xl font-extrabold text-gray-800 mb-2">رمز عبور تغییر کرد</h1>
              <p className="text-gray-500 text-sm">در حال انتقال به صفحهٔ ورود...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-gray-800 mb-2">تنظیم رمز عبور جدید</h1>
                <p className="text-gray-400 text-sm">
                  {ready ? 'رمز عبور جدیدت رو وارد کن' : 'در حال بررسی لینک بازیابی...'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 text-center">{error}</div>
                )}

                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors z-10">
                    <Lock size={18} />
                  </div>
                  <input
                    type={show ? 'text' : 'password'}
                    placeholder="رمز عبور جدید"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-gray-50/80 border border-gray-200 rounded-2xl pr-12 pl-12 text-gray-800 placeholder-gray-400 text-base outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors">
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors z-10">
                    <ShieldCheck size={18} />
                  </div>
                  <input
                    type={show ? 'text' : 'password'}
                    placeholder="تکرار رمز عبور"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full h-14 bg-gray-50/80 border border-gray-200 rounded-2xl pr-12 pl-4 text-gray-800 placeholder-gray-400 text-base outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                  />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full h-14 bg-gradient-to-l from-purple-600 via-purple-500 to-purple-400 text-white font-bold text-base rounded-2xl shadow-lg shadow-purple-300/40 hover:shadow-purple-400/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>در حال ذخیره...</span>
                    </div>
                  ) : 'تغییر رمز عبور'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

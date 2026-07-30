import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('ایمیل واردشده معتبر نیست');
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (err) {
        console.error('reset email error:', err.message);
        setError('خطا در ارسال ایمیل. دوباره تلاش کن');
        return;
      }
      setSent(true);
    } catch {
      setError('خطا در ارسال ایمیل. دوباره تلاش کن');
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

          {sent ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 size={56} className="text-green-500" />
              </div>
              <h1 className="text-xl font-extrabold text-gray-800 mb-2">ایمیل ارسال شد</h1>
              <p className="text-gray-500 text-sm leading-7">
                یه لینک بازیابی رمز به <span className="font-bold text-purple-600" dir="ltr">{email}</span> فرستادیم.
                صندوق ورودی (و پوشهٔ اسپم) رو چک کن و روی لینک بزن.
              </p>
              <Link to="/auth/login" className="mt-6 inline-flex items-center justify-center gap-2 w-full h-12 bg-gradient-to-l from-purple-600 to-purple-400 text-white font-bold rounded-2xl shadow-lg shadow-purple-300/40 hover:scale-[1.01] transition-all">
                بازگشت به ورود
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-gray-800 mb-2">فراموشی رمز عبور</h1>
                <p className="text-gray-400 text-sm">ایمیل حسابت رو بنویس تا لینک بازیابی برات بفرستیم</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 text-center">{error}</div>
                )}

                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors z-10">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="ایمیل"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                    className="w-full h-14 bg-gray-50/80 border border-gray-200 rounded-2xl pr-12 pl-4 text-left text-gray-800 placeholder-gray-400 text-base outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                  />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full h-14 bg-gradient-to-l from-purple-600 via-purple-500 to-purple-400 text-white font-bold text-base rounded-2xl shadow-lg shadow-purple-300/40 hover:shadow-purple-400/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>در حال ارسال...</span>
                    </div>
                  ) : 'ارسال لینک بازیابی'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <Link to="/auth/login" className="inline-flex items-center gap-1.5 text-sm text-purple-600 font-bold hover:text-purple-800 transition-colors">
                  <ArrowLeft size={16} />
                  بازگشت به ورود
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

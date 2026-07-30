import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading: authLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const getPasswordStrength = (): { label: string; color: string; width: string } => {
    if (password.length === 0) return { label: '', color: '', width: '0%' };
    if (password.length < 6) return { label: 'ضعیف', color: 'bg-red-400', width: '25%' };
    if (password.length < 8) return { label: 'متوسط', color: 'bg-yellow-400', width: '50%' };
    if (password.length < 10) return { label: 'خوب', color: 'bg-blue-400', width: '75%' };
    return { label: 'قوی', color: 'bg-green-500', width: '100%' };
  };
  const passwordStrength = getPasswordStrength();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('لطفاً تمام فیلدها را پر کنید');
      return;
    }
    if (fullName.trim().length < 3) {
      setError('نام باید حداقل ۳ کاراکتر باشد');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('ایمیل واردشده معتبر نیست');
      return;
    }
    if (password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }

    setLoading(true);
    try {
      const ok = await register(fullName.trim(), email.trim(), password);
      if (ok) {
        navigate('/', { replace: true });
      } else {
        setError('خطا در ثبت‌نام — ممکن است این ایمیل قبلاً ثبت شده باشد');
      }
    } catch {
      setError('خطا در ثبت‌نام. دوباره تلاش کنید');
    } finally {
      setLoading(false);
    }
  };

  const isSubmitting = loading || authLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-hidden flex items-center justify-center px-4 py-8">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-30 blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-100 to-purple-200 rounded-full opacity-25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className={`relative z-10 w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-100/50 border border-white/60 p-8 sm:p-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-300/50 rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-white text-3xl font-extrabold tracking-tight">S</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-300 rounded-lg opacity-60 blur-sm" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-gray-800 mb-2">ثبت‌نام در سیندریا</h1>
            <p className="text-gray-400 text-sm">برای ایجاد حساب کاربری، اطلاعات زیر را وارد کنید</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 text-center">{error}</div>
            )}

            {/* نام */}
            <div className="relative group">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors z-10">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="نام و نام خانوادگی"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-14 bg-gray-50/80 border border-gray-200 rounded-2xl pr-12 pl-4 text-gray-800 placeholder-gray-400 text-base outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all duration-200"
              />
            </div>

            {/* ایمیل */}
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

            {/* رمز عبور */}
            <div>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors z-10">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="رمز عبور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-gray-50/80 border border-gray-200 rounded-2xl pr-12 pl-12 text-gray-800 placeholder-gray-400 text-base outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 px-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">قدرت رمز عبور:</span>
                    <span className="text-xs font-medium text-gray-500">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`} style={{ width: passwordStrength.width }} />
                  </div>
                </div>
              )}
            </div>

            {/* تکرار رمز */}
            <div className="relative group">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors z-10">
                <ShieldCheck size={18} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="تکرار رمز عبور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full h-14 bg-gray-50/80 border rounded-2xl pr-12 pl-12 text-gray-800 placeholder-gray-400 text-base outline-none focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all duration-200 ${
                  confirmPassword.length > 0 && confirmPassword !== password
                    ? 'border-red-300 focus:border-red-400'
                    : confirmPassword.length > 0 && confirmPassword === password
                    ? 'border-green-300 focus:border-green-400'
                    : 'border-gray-200 focus:border-purple-400'
                }`}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword.length > 0 && confirmPassword !== password && (
              <p className="text-xs text-red-400 -mt-3 pr-2">رمز عبور مطابقت ندارد</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full h-14 bg-gradient-to-l from-purple-600 via-purple-500 to-purple-400 text-white font-bold text-base rounded-2xl shadow-lg shadow-purple-300/40 hover:shadow-purple-400/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>در حال ثبت‌نام...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>ایجاد حساب کاربری</span>
                  <ArrowLeft size={18} />
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link to="/auth/login" className="text-purple-600 font-bold hover:text-purple-800 transition-colors">وارد شوید</Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5 leading-5">
            ثبت‌نام شما به معنای پذیرش{' '}
            <Link to="/auth/terms" className="text-purple-500 hover:underline font-medium">قوانین و مقررات</Link>{' '}
            سیندریا است.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

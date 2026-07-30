import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const OTP_LENGTH = 4;
const RESEND_TIMER = 120;

const toEnglishDigits = (str: string): string => {
  return str
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
};

const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp, isLoading } = useAuth();

  const phone = (location.state as { phone?: string })?.phone || '';
  const otpType = (location.state as { type?: string })?.type || 'login';
  const initialOtpCode = (location.state as { otpCode?: string })?.otpCode || '';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(RESEND_TIMER);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [displayCode, setDisplayCode] = useState(initialOtpCode);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone) navigate('/auth/login', { replace: true });
  }, [phone, navigate]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, rawValue: string) => {
    const value = toEnglishDigits(rawValue);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const raw = e.clipboardData.getData('text');
    const pasted = toEnglishDigits(raw).replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      setOtp(pasted.split(''));
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleSubmit = useCallback(async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) {
      setError('لطفاً کد ۴ رقمی را کامل وارد کنید');
      return;
    }

    try {
      const res = await verifyOtp({ phone, code });

      // ✅ چک کردن success — چون AuthContext throw نمی‌کنه
      if (res.success) {
        if (otpType === 'forgot') {
          navigate('/auth/reset-password', { state: { phone }, replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        // ✅ پیام خطا رو از response بخون
        setError(res.message || 'خطا در تأیید کد');
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطا در تأیید کد';
      setError(msg);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  }, [otp, phone, otpType, verifyOtp, navigate]);

  useEffect(() => {
    if (otp.every((d) => d !== '') && otp.join('').length === OTP_LENGTH) {
      handleSubmit();
    }
  }, [otp, handleSubmit]);

  const handleResend = async () => {
    if (!canResend || isLoading) return;

    setError('');
    setOtp(Array(OTP_LENGTH).fill(''));
    setCanResend(false);

    try {
      const res = await resendOtp(phone);
      if (res.success) {
        const newCode = (res as any).data?.otpCode || '';
        setDisplayCode(newCode);
        setTimer(RESEND_TIMER);
        setResendCount((prev) => prev + 1);
        inputRefs.current[0]?.focus();
      } else {
        setError(res.message || 'خطا در ارسال مجدد');
        setCanResend(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطا در ارسال مجدد کد';
      setError(msg);
      setCanResend(true);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const typeLabels: Record<string, string> = {
    login: 'ورود',
    register: 'ثبت‌نام',
    forgot: 'بازیابی رمز عبور',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f5f3ff 100%)',
        padding: '1rem',
        fontFamily: 'Vazirmatn, sans-serif',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e5e7eb',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(124, 58, 237, 0.08)',
          }}
        >
          {/* نمایش کد OTP (فقط در development) */}
          {displayCode && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '1px solid #bbf7d0',
                borderRadius: '14px',
                textAlign: 'center',
              }}
            >
              <p style={{ color: '#16a34a', fontSize: '12px', marginBottom: '10px', fontWeight: 500 }}>
                🔐 کد تأیید شما (حالت توسعه)
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', direction: 'ltr' }}>
                {displayCode.split('').map((digit, i) => (
                  <span
                    key={i}
                    style={{
                      width: '42px',
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#dcfce7',
                      border: '1.5px solid #86efac',
                      borderRadius: '10px',
                      color: '#15803d',
                      fontSize: '20px',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                    }}
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>
              تأیید {typeLabels[otpType] || 'هویت'}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: 1.8 }}>
              کد ۴ رقمی ارسال شده به{' '}
              <span style={{ color: '#7c3aed', fontWeight: 600, direction: 'ltr', display: 'inline-block' }}>
                {phone}
              </span>{' '}
              را وارد کنید
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '12px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                color: '#dc2626',
                fontSize: '13px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* OTP Inputs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '2rem', direction: 'ltr' }}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined}
                disabled={isLoading}
                aria-label={`رقم ${idx + 1} کد تأیید`}
                style={{
                  width: '56px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 700,
                  borderRadius: '14px',
                  border: digit ? '2px solid #7c3aed' : '2px solid #e5e7eb',
                  background: digit ? '#faf5ff' : '#f9fafb',
                  color: '#1e1b4b',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: digit ? '0 0 0 3px rgba(124, 58, 237, 0.1)' : 'none',
                  fontFamily: 'monospace',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#a855f7';
                  e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = digit ? '#7c3aed' : '#e5e7eb';
                  e.target.style.boxShadow = digit ? '0 0 0 3px rgba(124, 58, 237, 0.1)' : 'none';
                }}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || otp.join('').length !== OTP_LENGTH}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              fontWeight: 600,
              fontSize: '15px',
              color: '#ffffff',
              background:
                isLoading || otp.join('').length !== OTP_LENGTH
                  ? '#c4b5fd'
                  : 'linear-gradient(135deg, #7c3aed, #a855f7)',
              border: 'none',
              cursor: isLoading || otp.join('').length !== OTP_LENGTH ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '1.5rem',
              fontFamily: 'Vazirmatn, sans-serif',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)',
            }}
          >
            {isLoading ? 'در حال بررسی...' : 'تأیید کد'}
          </button>

          {/* Resend */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleResend}
              disabled={!canResend || isLoading}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: canResend ? '#7c3aed' : '#9ca3af',
                background: 'none',
                border: 'none',
                cursor: canResend ? 'pointer' : 'not-allowed',
                fontFamily: 'Vazirmatn, sans-serif',
                transition: 'color 0.2s',
              }}
            >
              {canResend ? 'ارسال مجدد کد' : `ارسال مجدد تا ${formatTime(timer)} دیگر`}
            </button>
            {resendCount > 0 && (
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px' }}>
                {resendCount} بار ارسال مجدد شده
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;

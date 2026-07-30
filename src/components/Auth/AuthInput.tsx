import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// تبدیل اعداد فارسی/عربی به انگلیسی
const toEnglishDigits = (str: string): string => {
  return str
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
};

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  isPassword?: boolean;
  prefix?: string;
}

export function AuthInput({ label, icon, isPassword, prefix, type, style, onChange, ...rest }: Props) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // اگر input عددی هست (tel یا number)، اعداد فارسی/عربی رو تبدیل کن
    if (type === 'tel' || type === 'number' || rest.inputMode === 'numeric') {
      const converted = toEnglishDigits(e.target.value);
      // فقط اعداد رو نگه‌دار برای فیلد تلفن
      if (type === 'tel') {
        const digitsOnly = converted.replace(/\D/g, '');
        e.target.value = digitsOnly;
      } else {
        e.target.value = converted;
      }
    }
    onChange?.(e);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: '#4a4a5a',
          marginBottom: '8px',
          fontFamily: 'Vazirmatn, sans-serif',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a0a0b0',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </span>
        )}

        {prefix && (
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#7c3aed',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
              pointerEvents: 'none',
              borderRight: '1px solid #e5e5ea',
              paddingRight: '12px',
              height: '60%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {prefix}
          </span>
        )}

        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '14px 16px',
            paddingRight: icon ? '44px' : '16px',
            paddingLeft: prefix ? '70px' : isPassword ? '44px' : '16px',
            fontSize: '14px',
            fontFamily: 'Vazirmatn, sans-serif',
            color: '#1a1a2e',
            backgroundColor: focused ? '#ffffff' : '#f8f7fc',
            border: focused
              ? '2px solid #a855f7'
              : '1.5px solid #e5e5ea',
            borderRadius: '12px',
            outline: 'none',
            transition: 'all 0.25s ease',
            boxShadow: focused
              ? '0 0 0 4px rgba(168, 85, 247, 0.08)'
              : 'none',
            direction: 'ltr',
            ...style,
          }}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a0a0b0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#7c3aed')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a0b0')}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default AuthInput;

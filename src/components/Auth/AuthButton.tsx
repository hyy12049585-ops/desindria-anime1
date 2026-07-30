import { type ButtonHTMLAttributes, type MouseEvent as ReactMouseEvent } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'outline';
}

export function AuthButton({ children, loading, variant = 'primary', onClick, disabled, style, ...rest }: Props) {
  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    // افکت ریپل
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255,255,255,0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple-anim 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onClick?.(e);
  };

  const isPrimary = variant === 'primary';

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        padding: '14px 24px',
        fontSize: '15px',
        fontWeight: 700,
        fontFamily: 'Vazirmatn, sans-serif',
        border: isPrimary ? 'none' : '2px solid #a855f7',
        borderRadius: '12px',
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        color: isPrimary ? '#ffffff' : '#7c3aed',
        background: isPrimary
          ? (loading || disabled)
            ? 'linear-gradient(135deg, #c4b5d8, #a89bc2)'
            : 'linear-gradient(135deg, #a855f7, #7c3aed, #6d28d9)'
          : 'transparent',
        boxShadow: isPrimary && !(loading || disabled)
          ? '0 8px 24px rgba(168, 85, 247, 0.3), 0 2px 8px rgba(124, 58, 237, 0.2)'
          : 'none',
        opacity: (loading || disabled) ? 0.7 : 1,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!loading && !disabled) {
          if (isPrimary) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(168, 85, 247, 0.4), 0 4px 12px rgba(124, 58, 237, 0.3)';
          } else {
            e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.05)';
          }
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        if (isPrimary) {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(168, 85, 247, 0.3), 0 2px 8px rgba(124, 58, 237, 0.2)';
        } else {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      {...rest}
    >
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid #ffffff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span>لطفاً صبر کنید...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default AuthButton;

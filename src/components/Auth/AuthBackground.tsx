import { useRef } from 'react';

export default function AuthBackground({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        /* پس‌زمینه گرادیانت ملایم بنفش-سفید */
        background: 'linear-gradient(135deg, #f5f0ff 0%, #ede4ff 30%, #e0d4fc 60%, #f0eaff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* دایره‌های تزئینی پس‌زمینه */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-120px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '60%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* الگوی نقطه‌ای ظریف (dot pattern) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />

      {/* محتوای اصلی */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem 1rem',
          width: '100%',
        }}
      >
        <div
          className="auth-card"
          style={{
            width: '100%',
            maxWidth: '440px',
            background: '#ffffff',
            border: '1px solid rgba(168, 85, 247, 0.1)',
            borderRadius: '1.5rem',
            padding: '2.5rem 2rem',
            boxShadow:
              '0 20px 60px rgba(168, 85, 247, 0.08), 0 8px 24px rgba(0,0,0,0.04)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

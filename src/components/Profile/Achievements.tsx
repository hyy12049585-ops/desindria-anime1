import { Trophy } from 'lucide-react';

const achievements = [
  { icon: '\uD83C\uDF0D', name: '\u06A9\u0627\u0648\u0634\u06AF\u0631 \u0627\u0646\u06CC\u0645\u0647', desc: '50 \u0627\u0646\u06CC\u0645\u0647 \u062A\u0645\u0627\u0634\u0627 \u06A9\u0646', progress: 100, unlocked: true },
  { icon: '\uD83D\uDD25', name: 'Binge Master', desc: '10 \u0642\u0633\u0645\u062A \u062F\u0631 \u06CC\u06A9 \u0631\u0648\u0632', progress: 100, unlocked: true },
  { icon: '\uD83C\uDFC6', name: 'Legendary Otaku', desc: '200 \u0627\u0646\u06CC\u0645\u0647 \u062A\u06A9\u0645\u06CC\u0644 \u06A9\u0646', progress: 64, unlocked: false },
  { icon: '\u2B50', name: '\u0645\u0646\u062A\u0642\u062F \u062D\u0631\u0641\u0647\u200C\u0627\u06CC', desc: '100 \u0627\u0645\u062A\u06CC\u0627\u0632 \u062B\u0628\u062A \u06A9\u0646', progress: 45, unlocked: false },
  { icon: '\uD83D\uDC8E', name: '\u06A9\u0644\u06A9\u0633\u06CC\u0648\u0646\u0631', desc: '500 \u0633\u0627\u0639\u062A \u062A\u0645\u0627\u0634\u0627', progress: 68, unlocked: false },
  { icon: '\uD83C\uDF1F', name: '\u0633\u062A\u0627\u0631\u0647 \u0646\u0648\u0631\u0648\u0632', desc: '\u0648\u0631\u0648\u062F \u062F\u0631 \u0639\u06CC\u062F', progress: 100, unlocked: true },
];

export function Achievements() {
  return (
    <div className="fade-in fade-in-delay-4">
      <div className="section-title">
        <h3>
          <Trophy size={18} />
          {'\u062F\u0633\u062A\u0627\u0648\u0631\u062F\u0647\u0627'}
        </h3>
      </div>

      <div className="achievements-grid">
        {achievements.map((a, i) => (
          <div key={i} className={`glass-card achievement-card ${!a.unlocked ? 'locked' : ''}`}>
            <span className="achievement-icon">{a.icon}</span>
            <div className="achievement-name">{a.name}</div>
            <div className="achievement-desc">{a.desc}</div>
            <div className="achievement-progress">
              <div className="achievement-progress-fill" style={{ width: `${a.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

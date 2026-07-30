import { Activity } from 'lucide-react';

const activities = [
  {
    icon: '\u25B6\uFE0F',
    text: '\u062A\u0645\u0627\u0634\u0627\u06CC Attack on Titan \u0631\u0627 \u0634\u0631\u0648\u0639 \u06A9\u0631\u062F',
    time: '2 \u062F\u0642\u06CC\u0642\u0647 \u067E\u06CC\u0634',
  },
  {
    icon: '\u2705',
    text: '\u0642\u0633\u0645\u062A 20 \u0627\u0632 Demon Slayer \u0631\u0627 \u062A\u06A9\u0645\u06CC\u0644 \u06A9\u0631\u062F',
    time: '1 \u0633\u0627\u0639\u062A \u067E\u06CC\u0634',
  },
  {
    icon: '\u2764\uFE0F',
    text: 'Jujutsu Kaisen \u0631\u0627 \u0628\u0647 \u0639\u0644\u0627\u0642\u0647\u200C\u0645\u0646\u062F\u06CC\u200C\u0647\u0627 \u0627\u0641\u0632\u0648\u062F',
    time: '3 \u0633\u0627\u0639\u062A \u067E\u06CC\u0634',
  },
  {
    icon: '\u2B50',
    text: '\u0628\u0647 One Piece \u0627\u0645\u062A\u06CC\u0627\u0632 9.5 \u062F\u0627\u062F',
    time: '5 \u0633\u0627\u0639\u062A \u067E\u06CC\u0634',
  },
  {
    icon: '\uD83C\uDFC6',
    text: '\u062F\u0633\u062A\u0627\u0648\u0631\u062F "\u06A9\u0627\u0648\u0634\u06AF\u0631 \u0627\u0646\u06CC\u0645\u0647" \u0631\u0627 \u06A9\u0633\u0628 \u06A9\u0631\u062F',
    time: '\u062F\u06CC\u0631\u0648\u0632',
  },
  {
    icon: '\uD83D\uDCE5',
    text: 'Spy x Family \u0631\u0627 \u0628\u0647 \u0644\u06CC\u0633\u062A \u062A\u0645\u0627\u0634\u0627 \u0627\u0636\u0627\u0641\u0647 \u06A9\u0631\u062F',
    time: '\u062F\u06CC\u0631\u0648\u0632',
  },
  {
    icon: '\u25B6\uFE0F',
    text: '\u062A\u0645\u0627\u0634\u0627\u06CC Chainsaw Man \u0631\u0627 \u0634\u0631\u0648\u0639 \u06A9\u0631\u062F',
    time: '2 \u0631\u0648\u0632 \u067E\u06CC\u0634',
  },
];

export function ActivityFeed() {
  return (
    <div className="glass-card activity-panel fade-in fade-in-delay-5">
      <div className="section-title" style={{ padding: 0, marginBottom: 12 }}>
        <h3>
          <Activity size={18} />
          {'\u0641\u0639\u0627\u0644\u06CC\u062A\u200C\u0647\u0627\u06CC \u0627\u062E\u06CC\u0631'}
        </h3>
      </div>

      <div className="activity-list">
        {activities.map((a, i) => (
          <div key={i} className="activity-item">
            <span className="activity-icon">{a.icon}</span>
            <div>
              <div className="activity-text">{a.text}</div>
              <div className="activity-time">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

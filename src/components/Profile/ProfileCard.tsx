export function ProfileCard() {
  const xp = 780;
  const maxXp = 1000;
  const percent = (xp / maxXp) * 100;

  const genres = [
    '\u0627\u06A9\u0634\u0646',
    '\u0641\u0627\u0646\u062A\u0632\u06CC',
    '\u0634\u0648\u0646\u0646',
    '\u0631\u0648\u0645\u0627\u0646\u0633',
    '\u0645\u0627\u062C\u0631\u0627\u062C\u0648\u06CC\u06CC',
  ];

  return (
    <div className="glass-card glass-card-glow profile-card fade-in">
      <div className="profile-avatar-wrapper">
        <img
          src="https://api.dicebear.com/7.x/adventurer/svg?seed=Senzira"
          alt="avatar"
          className="profile-avatar"
        />
        <span className="profile-avatar-level">LVL 12</span>
      </div>

      <div className="profile-info">
        <h2 className="profile-name">SenziraUser</h2>
        <p className="profile-title">Otaku Level 12</p>

        <div className="profile-xp-section">
          <div className="profile-xp-header">
            <span>XP</span>
            <span>{xp} / {maxXp}</span>
          </div>
          <div className="profile-xp-bar">
            <div className="profile-xp-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <p className="profile-member-date">
          {'\u0639\u0636\u0648\u06CC\u062A \u0627\u0632 \u0633\u0627\u0644 \u06F2\u06F0\u06F2\u06F6'}
        </p>

        <div className="profile-genres">
          {genres.map((g) => (
            <span key={g} className="profile-genre-tag">{g}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

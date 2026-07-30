import React from "react";
import WeeklyPoll from "./WeeklyPoll";
import CharacterPoll from "./CharacterPoll";

const PollsSection: React.FC = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-6">
          <h2 className="text-2xl font-extrabold border-b-2 border-purple-500 pb-1"
            style={{ color: 'var(--text-primary)' }}>
            نظرسنجی‌ها
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <WeeklyPoll key="weekly-poll-unique" />
          <CharacterPoll key="character-poll-unique" />
        </div>
      </div>
    </section>
  );
};

export default PollsSection;

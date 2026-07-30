import React from 'react';
import WeeklyPoll from '../components/polls/WeeklyPoll';
import CharacterPoll from '../components/polls/CharacterPoll';
import { weeklyPollAnimes } from '../data/mockData';

const PollsSection: React.FC = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-6">
          <h2 className="text-2xl font-extrabold text-white border-b-2 border-purple-500 pb-1">
            نظرسنجی‌ها
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeeklyPoll
            title="نظرسنجی هفته"
            subtitle="بهترین انیمه هفته رو انتخاب کن"
            initialOptions={weeklyPollAnimes}
          />
          <CharacterPoll />
        </div>
      </div>
    </section>
  );
};

export default PollsSection;

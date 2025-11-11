import { useState } from 'react';
import { createOrUpdateProfile, updateSkills, addPortfolioItem } from '@/api/freelancer';
import { SkillInput, PortfolioItemInput } from '@/api/freelancer';

// A super–lightweight wizard component – replace with your favourite UI lib later
const steps = ['Basic Info', 'Skills', 'Portfolio', 'Review & Submit'] as const;

type Step = (typeof steps)[number];

interface BasicInfoState {
  title: string;
  bio: string;
  hourlyRate: number;
  availability: {
    status: 'Available' | 'Partially Available' | 'Not Available';
    hoursPerWeek?: number;
    timezone?: string;
  };
}

export default function FreelancerOnboarding() {
  const [activeStepIdx, setIdx] = useState(0);

  // individual slice states ─ keep simple for now
  const [basicInfo, setBasicInfo] = useState<BasicInfoState>({
    title: '',
    bio: '',
    hourlyRate: 0,
    availability: { status: 'Available' },
  });

  const [skills, setSkills] = useState<SkillInput[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItemInput[]>([]);
  const step = steps[activeStepIdx];

  const next = () => setIdx((i) => Math.min(i + 1, steps.length - 1));
  const back = () => setIdx((i) => Math.max(i - 1, 0));

  const handleSubmit = async () => {
    try {
      // 1️⃣ create / update profile core
      await createOrUpdateProfile({ ...basicInfo });
      // 2️⃣ nested arrays
      if (skills.length) await updateSkills(skills);
      for (const item of portfolio) await addPortfolioItem(item);
      alert('Profile created!');
    } catch (err) {
      console.error(err);
      alert('Error creating profile');
    }
  };

  return (
    <div className="min-h-screen pt-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Freelancer Onboarding</h1>

      {/* Step indicators */}
      <div className="flex justify-center gap-4 mb-8">
        {steps.map((label, i) => (
          <span
            key={label}
            className={`px-3 py-1 rounded-full text-sm ${
              i === activeStepIdx ? 'bg-code-green text-black' : 'bg-gray-700'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Render current step */}
      {step === 'Basic Info' && (
        <div className="max-w-xl mx-auto space-y-4">
          <label className="block">
            <span className="text-gray-400">Title</span>
            <input
              className="mt-1 w-full bg-gray-800 p-2 rounded"
              value={basicInfo.title}
              onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-gray-400">Bio</span>
            <textarea
              className="mt-1 w-full bg-gray-800 p-2 rounded"
              rows={4}
              value={basicInfo.bio}
              onChange={(e) => setBasicInfo({ ...basicInfo, bio: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-gray-400">Hourly rate ($)</span>
            <input
              type="number"
              className="mt-1 w-full bg-gray-800 p-2 rounded"
              value={basicInfo.hourlyRate}
              onChange={(e) => setBasicInfo({ ...basicInfo, hourlyRate: Number(e.target.value) })}
            />
          </label>
        </div>
      )}

      {step === 'Skills' && (
        <div className="max-w-xl mx-auto space-y-4">
          <button
            onClick={() =>
              setSkills((prev) => [
                ...prev,
                { skill: '', experienceLevel: 'Beginner' },
              ])
            }
            className="bg-code-green text-black px-3 py-1 rounded"
          >
            + Add Skill
          </button>
          {skills.map((s, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                className="flex-1 bg-gray-800 p-2 rounded"
                placeholder="Skill ObjectId"
                value={s.skill}
                onChange={(e) => {
                  const copy = [...skills];
                  copy[idx].skill = e.target.value;
                  setSkills(copy);
                }}
              />
              <select
                className="bg-gray-800 p-2 rounded"
                value={s.experienceLevel}
                onChange={(e) => {
                  const copy = [...skills];
                  copy[idx].experienceLevel = e.target.value as any;
                  setSkills(copy);
                }}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {step === 'Portfolio' && (
        <div className="max-w-xl mx-auto space-y-4">
          <button
            onClick={() =>
              setPortfolio((prev) => [
                ...prev,
                { title: '', description: '' },
              ])
            }
            className="bg-code-green text-black px-3 py-1 rounded"
          >
            + Add Portfolio Item
          </button>
          {portfolio.map((p, idx) => (
            <div key={idx} className="space-y-2 border-b border-gray-700 pb-4">
              <input
                className="w-full bg-gray-800 p-2 rounded"
                placeholder="Project title"
                value={p.title}
                onChange={(e) => {
                  const copy = [...portfolio];
                  copy[idx].title = e.target.value;
                  setPortfolio(copy);
                }}
              />
              <textarea
                className="w-full bg-gray-800 p-2 rounded"
                placeholder="Description"
                rows={3}
                value={p.description}
                onChange={(e) => {
                  const copy = [...portfolio];
                  copy[idx].description = e.target.value;
                  setPortfolio(copy);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {step === 'Review & Submit' && (
        <div className="max-w-xl mx-auto space-y-4 bg-gray-800 p-4 rounded">
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify({ basicInfo, skills, portfolio }, null, 2)}
          </pre>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between max-w-xl mx-auto mt-10">
        <button
          onClick={back}
          disabled={activeStepIdx === 0}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Back
        </button>
        {activeStepIdx < steps.length - 1 ? (
          <button onClick={next} className="px-4 py-2 bg-code-green text-black rounded">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-4 py-2 bg-code-green text-black rounded">
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

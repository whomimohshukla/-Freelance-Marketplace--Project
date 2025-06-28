import React, { useEffect, useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import freelancerApi from '../../api/freelancerApi';

interface Skill {
  skill: string;
  experienceLevel: string;
  yearsOfExperience: number;
}

const levels = ['Beginner', 'Intermediate', 'Expert'];

const SkillsSettings: React.FC = () => {
  const role = useRole();
  if (role && role !== 'freelancer') return <Navigate to="/" replace />;
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<Skill>({ skill: '', experienceLevel: 'Beginner', yearsOfExperience: 1 });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data } = await freelancerApi.getMyProfile();
      setSkills(data.data.skills || []);
    } catch (_) {}
  };

  useEffect(() => { load(); }, []);

  const addSkill = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.skill.trim()) return;
    const updated = [...skills, form];
    setLoading(true);
    try {
      await freelancerApi.updateSkills(updated);
      setForm({ skill: '', experienceLevel: 'Beginner', yearsOfExperience: 1 });
      await load();
    } finally { setLoading(false); }
  };

  const remove = async (idx: number) => {
    const updated = skills.filter((_, i) => i !== idx);
    await freelancerApi.updateSkills(updated);
    setSkills(updated);
  };

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-semibold text-white">Skills</h1>

      <form onSubmit={addSkill} className="flex gap-2 flex-wrap items-end">
        <input
          value={form.skill}
          onChange={(e) => setForm({ ...form, skill: e.target.value })}
          placeholder="Skill name"
          className="px-3 py-2 rounded-lg bg-gray-800 text-white flex-1 min-w-[120px]"
          required
        />
        <select
          value={form.experienceLevel}
          onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
          className="px-3 py-2 rounded-lg bg-gray-800 text-white"
        >
          {levels.map((l) => <option key={l}>{l}</option>)}
        </select>
        <input
          type="number"
          min={0}
          value={form.yearsOfExperience}
          onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })}
          className="w-20 px-3 py-2 rounded-lg bg-gray-800 text-white"
        />
        <button disabled={loading} className="px-4 py-2 bg-code-green text-black rounded-lg disabled:opacity-50">
          {loading ? 'Saving…' : 'Add'}
        </button>
      </form>

      <ul className="space-y-2">
        {skills.map((s, idx) => (
          <li key={idx} className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
            <span className="flex-1 text-white">{s.skill}</span>
            <span className="text-gray-400 text-sm">{s.experienceLevel} • {s.yearsOfExperience} yrs</span>
            <button onClick={() => remove(idx)} className="text-red-400 hover:text-red-300">✕</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SkillsSettings;

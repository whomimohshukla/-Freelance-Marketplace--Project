import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import clientApi from '../../api/clientApi';
import { getClientProfileFromCache, setClientProfileCache } from '../../utils/clientProfileCache';

interface SocialForm {
  website: string;
  github: string;
  linkedin: string;
}

const SocialSettings: React.FC = () => {
  const role = useRole();
  if (role && role !== 'client') return <Navigate to="/" replace />;

  const [form, setForm] = useState<SocialForm>({ website: '', github: '', linkedin: '' });
  const [initial, setInitial] = useState<SocialForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => {
    try {
      const { data } = await clientApi.getMyProfile();
      const p = data.data;
      const next: SocialForm = {
        website: p?.socialProfiles?.website || '',
        github: p?.socialProfiles?.github || '',
        linkedin: p?.socialProfiles?.linkedin || '',
      };
      setForm(next);
      setInitial(next);
      if (data?.data) {
        const remember = !!localStorage.getItem('user');
        setClientProfileCache(data.data, remember);
      }
    } catch (_) {}
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const cached = getClientProfileFromCache();
    if (cached?.socialProfiles) {
      const next: SocialForm = {
        website: cached.socialProfiles.website || '',
        github: cached.socialProfiles.github || '',
        linkedin: cached.socialProfiles.linkedin || '',
      };
      setForm(next);
      setInitial((prev) => prev ?? next);
    }
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      await clientApi.updateSocialProfiles(form);
      await load();
      setToast({ type: 'success', text: 'Social links saved' });
    } catch (err: any) {
      setToast({ type: 'error', text: err?.response?.data?.error || 'Failed to save social links' });
    } finally { setLoading(false); }
  };

  const isDirty = !!initial && JSON.stringify(initial) !== JSON.stringify(form);

  return (
    <section className="w-full bg-primary text-white pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-semibold">Social Profiles</h1>

        {toast && (
          <div className={`px-4 py-2 rounded-lg text-sm ${toast.type === 'success' ? 'bg-green-600/20 text-green-300 border border-green-700/50' : 'bg-red-600/20 text-red-300 border border-red-700/50'}`}>{toast.text}</div>
        )}

        <form onSubmit={save} className="space-y-4 bg-gray-900/60 border border-gray-800 p-6 rounded-xl">
          <div>
            <label className="block text-sm mb-1">Website</label>
            <input name="website" value={form.website} onChange={onChange} placeholder="https://example.com" className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700" />
          </div>
          <div>
            <label className="block text-sm mb-1">GitHub</label>
            <input name="github" value={form.github} onChange={onChange} placeholder="https://github.com/username" className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700" />
          </div>
          <div>
            <label className="block text-sm mb-1">LinkedIn</label>
            <input name="linkedin" value={form.linkedin} onChange={onChange} placeholder="https://linkedin.com/in/username" className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700" />
          </div>

          <button disabled={loading || !isDirty} className="px-4 py-2 bg-code-green text-black rounded-lg disabled:opacity-50">{loading ? 'Saving…' : 'Save Social Links'}</button>
        </form>
      </div>
    </section>
  );
};

export default SocialSettings;

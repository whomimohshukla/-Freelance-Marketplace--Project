import React, { useEffect, useState } from 'react';
import clientApi from '../../api/clientApi';
import { getClientProfileFromCache, setClientProfileCache } from '../../utils/clientProfileCache';

interface PreferencesForm {
  language: string;
  timezone: string;
  currency: string;
}

const PreferencesSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [prefs, setPrefs] = useState<PreferencesForm>({
    language: 'English',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    currency: 'USD',
  });
  const [initialPrefs, setInitialPrefs] = useState<PreferencesForm | null>(null);

  const load = async () => {
    try {
      const { data } = await clientApi.getMyProfile();
      const p = data.data?.preferences;
      if (p) {
        const next = {
        language: p.language || 'English',
        timezone: p.timezone || (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'),
        currency: p.currency || 'USD',
        };
        setPrefs(next);
        setInitialPrefs(next);
      }
      if (data?.data) {
        const remember = !!localStorage.getItem('user');
        setClientProfileCache(data.data, remember);
      }
    } catch (_) { /* ignore */ }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const cached = getClientProfileFromCache();
    if (cached?.preferences) {
      const next = {
        language: cached.preferences.language || 'English',
        timezone: cached.preferences.timezone || (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'),
        currency: cached.preferences.currency || 'USD',
      };
      setPrefs(next);
      setInitialPrefs((prev) => prev ?? next);
    }
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      await clientApi.updatePreferences({ language: prefs.language, timezone: prefs.timezone, currency: prefs.currency });
      await load();
      setToast({ type: 'success', text: 'Preferences saved' });
    } catch (e: any) {
      setToast({ type: 'error', text: e?.response?.data?.error || 'Failed to save preferences' });
    } finally { setLoading(false); }
  };

  return (
    <section className="w-full bg-primary text-white pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-6">Preferences</h1>

        {toast && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${toast.type === 'success' ? 'bg-green-600/20 text-green-300 border border-green-700/50' : 'bg-red-600/20 text-red-300 border border-red-700/50'}`}>
            {toast.text}
          </div>
        )}

        <form onSubmit={save} className="space-y-6 bg-gray-900/60 border border-gray-800 p-6 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Language</label>
              <select value={prefs.language} onChange={(e) => setPrefs({ ...prefs, language: e.target.value })} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Arabic">Arabic</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Timezone</label>
              <select value={prefs.timezone} onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                <option value="UTC">UTC</option>
                <option value="Asia/Calcutta">Asia/Calcutta (IST)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (ET)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PT)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Europe/Berlin">Europe/Berlin (CET/CEST)</option>
                <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                <option value="Australia/Sydney">Australia/Sydney (AEST/AEDT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Currency</label>
              <select value={prefs.currency} onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          {(() => {
            const isDirty = !!initialPrefs && (initialPrefs.language !== prefs.language || initialPrefs.timezone !== prefs.timezone || initialPrefs.currency !== prefs.currency);
            return (
              <button disabled={loading || !isDirty} className="px-4 py-2 bg-code-green text-black rounded-lg disabled:opacity-50">{loading ? 'Saving…' : 'Save Preferences'}</button>
            );
          })()}
        </form>
      </div>
    </section>
  );
};

export default PreferencesSettings;

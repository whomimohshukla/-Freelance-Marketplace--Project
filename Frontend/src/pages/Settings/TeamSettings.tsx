import React, { useEffect, useMemo, useState } from 'react';
import { FiTrash2, FiUserPlus, FiUsers } from 'react-icons/fi';
import clientApi from '../../api/clientApi';
import { getClientProfileFromCache, setClientProfileCache } from '../../utils/clientProfileCache';

interface TeamMemberForm {
  user: string; // userId of the member
  role: string;
}

const TeamSettings: React.FC = () => {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TeamMemberForm>({ user: '', role: 'Member' });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const load = async () => {
    setToast(null);
    try {
      const { data } = await clientApi.getMyProfile();
      setTeam(data.data?.team || []);
      if (data?.data) {
        const remember = !!localStorage.getItem('user');
        setClientProfileCache(data.data, remember);
      }
    } catch (e: any) {
      setToast({ type: 'error', text: e?.response?.data?.error || 'Failed to load team' });
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const cached = getClientProfileFromCache();
    if (cached?.team) setTeam(cached.team || []);
  }, []);

  // Debounced search
  const debouncedQuery = useMemo(() => query.trim(), [query]);
  useEffect(() => {
    let active = true;
    const run = async () => {
      if (debouncedQuery.length < 2) { setResults([]); return; }
      setSearching(true);
      try {
        const { data } = await clientApi.searchTeamUsers(debouncedQuery);
        if (active) setResults(data.data || []);
      } finally { if (active) setSearching(false); }
    };
    const t = setTimeout(run, 250);
    return () => { active = false; clearTimeout(t); };
  }, [debouncedQuery]);

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user.trim()) return;
    setLoading(true);
    setToast(null);
    try {
      await clientApi.addTeamMember({ user: form.user.trim(), role: form.role });
      await load();
      setForm({ user: '', role: 'Member' });
      setToast({ type: 'success', text: 'Member added' });
    } catch (e: any) {
      setToast({ type: 'error', text: e?.response?.data?.error || 'Failed to add member' });
    } finally { setLoading(false); }
  };

  const remove = async (memberId: string) => {
    setLoading(true);
    setToast(null);
    try {
      await clientApi.removeTeamMember(memberId);
      await load();
      setToast({ type: 'success', text: 'Member removed' });
    } catch (e: any) {
      setToast({ type: 'error', text: e?.response?.data?.error || 'Failed to remove member' });
    } finally { setLoading(false); }
  };

  return (
    <section className="w-full bg-primary text-white pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 text-accent ring-1 ring-accent/30">
            <FiUsers />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Team Settings</h1>
        </div>

        {toast && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${toast.type === 'success' ? 'bg-green-600/20 text-green-300 border border-green-700/50' : 'bg-red-600/20 text-red-300 border border-red-700/50'}`}>{toast.text}</div>
        )}

        <form onSubmit={addMember} className="flex flex-wrap items-end gap-4 mb-8 bg-gray-900/60 border border-gray-800 p-5 rounded-xl">
          <div className="flex-1 min-w-[260px] relative">
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Search user</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-800 text-white px-3 py-2.5 rounded-lg border border-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/60"
              placeholder="Type email or name (min 2 chars)"
            />
            {!!results.length && (
              <ul className="absolute z-10 w-full bg-gray-900 border border-gray-800 rounded-lg mt-1 max-h-56 overflow-auto shadow-xl">
                {results.map((u) => (
                  <li key={u._id}>
                    <button type="button" onClick={() => { setForm({ ...form, user: u._id }); setQuery(`${u.firstName || ''} ${u.lastName || ''} <${u.email}>`.trim()); setResults([]); }} className="w-full text-left px-3 py-2 hover:bg-gray-800 flex items-center gap-3">
                      <img src={u.avatar || ''} className="w-7 h-7 rounded-full bg-gray-700" />
                      <div className="flex-1">
                        <span className="block text-sm text-white leading-tight">{u.firstName} {u.lastName}</span>
                        <span className="block text-[11px] text-gray-400">{u.email}</span>
                      </div>
                    </button>
                  </li>
                ))}
                {!results.length && !searching && <li className="px-3 py-2 text-sm text-gray-400">No results</li>}
              </ul>
            )}
            {form.user && <p className="text-xs text-gray-500 mt-1">Selected: <span className="text-gray-300">{query}</span></p>}
          </div>
          <div className="w-56">
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="bg-gray-800 text-white px-3 py-2.5 rounded-lg border border-gray-700"
            >
              <option value="Member">Member</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading || searching || !form.user}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-code-green text-black rounded-lg disabled:opacity-50 hover:opacity-90 transition self-end h-[42px]"
            aria-disabled={loading || searching || !form.user}
          >
            {loading ? (
              'Saving…'
            ) : (
              <>
                <FiUserPlus />
                {`Add ${form.role || 'Member'}`}
              </>
            )}
          </button>
        </form>

        <ul className="space-y-2 bg-gray-900/60 border border-gray-800 p-4 rounded-xl">
          {team.map((m) => (
            <li key={m._id} className="flex items-center gap-4 bg-gray-900 px-4 py-3 rounded-lg border border-gray-800">
              <img src={m.user?.avatar || ''} alt="avatar" className="w-9 h-9 rounded-full bg-gray-700" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm leading-tight truncate">{m.user?.firstName} {m.user?.lastName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-gray-800 text-gray-300 border border-gray-700">{m.role}</span>
                  {m.user?.email && <span className="text-[11px] text-gray-500 truncate">{m.user.email}</span>}
                </div>
              </div>
              <button onClick={() => remove(m._id)} className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 text-sm">
                <FiTrash2 />
                Remove
              </button>
            </li>
          ))}
          {!team.length && <p className="text-gray-400">No team members yet.</p>}
        </ul>
      </div>
    </section>
  );
}
;

export default TeamSettings;

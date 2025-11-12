import React, { useEffect, useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import clientApi from '../../api/clientApi';
import { getClientProfileFromCache, setClientProfileCache } from '../../utils/clientProfileCache';

interface Company {
  name: string;
  website: string;
  size: string;
  founded: string;
  description: string;
  logo: string;
}

const CompanySettings: React.FC = () => {
  const role = useRole();
  if (role && role !== 'client') return <Navigate to="/" replace />;
  const [company, setCompany] = useState<Company>({
    name: '',
    website: '',
    size: '',
    founded: '',
    description: '',
    logo: '',
  });
  const [initialCompany, setInitialCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await clientApi.getMyProfile();
        const next = data.data.company || {};
        setCompany(next);
        setInitialCompany(next);
        if (data?.data) {
          const remember = !!localStorage.getItem('user');
          setClientProfileCache(data.data, remember);
        }
      } catch (_) {}
    })();
  }, []);

  useEffect(() => {
    const cached = getClientProfileFromCache();
    if (cached?.company) {
      setCompany(cached.company || {});
      setInitialCompany((prev) => prev ?? (cached.company || {}));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      await clientApi.updateCompany(company);
      setToast({ type: 'success', text: 'Company details saved' });
      // reload canonical data from server
      const { data } = await clientApi.getMyProfile();
      const next = data.data.company || {};
      setCompany(next);
      setInitialCompany(next);
      if (data?.data) {
        const remember = !!localStorage.getItem('user');
        setClientProfileCache(data.data, remember);
      }
    } finally { setLoading(false); }
  };

  return (
    <section className="w-full bg-primary text-white pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-semibold">Company Details</h1>

        {toast && (
          <div className={`px-4 py-2 rounded-lg text-sm ${toast.type === 'success' ? 'bg-green-600/20 text-green-300 border border-green-700/50' : 'bg-red-600/20 text-red-300 border border-red-700/50'}`}>
            {toast.text}
          </div>
        )}

        <form onSubmit={save} className="space-y-4 bg-gray-900/60 border border-gray-800 p-6 rounded-xl">
          <div>
            <label className="block text-sm mb-1">Company Name</label>
            <input name="name" value={company.name} onChange={handleChange} placeholder="Company Name" className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" />
          </div>
          <div>
            <label className="block text-sm mb-1">Website</label>
            <input name="website" value={company.website} onChange={handleChange} placeholder="https://example.com" className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Company Size</label>
              <input name="size" value={company.size} onChange={handleChange} placeholder="1-10 / 11-50 / ..." className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" />
            </div>
            <div>
              <label className="block text-sm mb-1">Founded</label>
              <input type="date" name="founded" value={company.founded ? company.founded.substring(0,10) : ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea name="description" value={company.description} onChange={handleChange} placeholder="Describe your company..." className="w-full h-24 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" />
          </div>
          <div>
            <label className="block text-sm mb-1">Logo URL</label>
            <input name="logo" value={company.logo} onChange={handleChange} placeholder="https://..." className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" />
          </div>
          {(() => {
            const isDirty = !!initialCompany && JSON.stringify(initialCompany) !== JSON.stringify(company);
            return (
              <button disabled={loading || !isDirty} className="px-4 py-2 bg-code-green text-black rounded-lg disabled:opacity-50">
                {loading ? 'Saving…' : 'Save'}
              </button>
            );
          })()}
        </form>
      </div>
    </section>
  );
};

export default CompanySettings;

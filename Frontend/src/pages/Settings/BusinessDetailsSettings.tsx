import React, { useEffect, useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import clientApi from '../../api/clientApi';
import { getClientProfileFromCache, setClientProfileCache } from '../../utils/clientProfileCache';

interface BD {
  type: string;
  registrationNumber: string;
  taxId: string;
}

const BusinessDetailsSettings: React.FC = () => {
  const role = useRole();
  if (role && role !== 'client') return <Navigate to="/" replace />;
  const [details, setDetails] = useState<BD>({ type: '', registrationNumber: '', taxId: '' });
  const [initialDetails, setInitialDetails] = useState<BD | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await clientApi.getMyProfile();
        const next = data.data.businessDetails || {};
        setDetails(next);
        setInitialDetails(next);
        if (data?.data) {
          const remember = !!localStorage.getItem('user');
          setClientProfileCache(data.data, remember);
        }
      } catch (_) {}
    })();
  }, []);

  useEffect(() => {
    const cached = getClientProfileFromCache();
    if (cached?.businessDetails) {
      const next = cached.businessDetails || { type: '', registrationNumber: '', taxId: '' };
      setDetails(next);
      setInitialDetails((prev) => prev ?? next);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      await clientApi.updateBusinessDetails(details);
      // Reload canonical server state into the form
      const { data } = await clientApi.getMyProfile();
      const next = data.data.businessDetails || { type: '', registrationNumber: '', taxId: '' };
      setDetails(next);
      setInitialDetails(next);
      if (data?.data) {
        const remember = !!localStorage.getItem('user');
        setClientProfileCache(data.data, remember);
      }
      setToast({ type: 'success', text: 'Business details saved' });
    } finally { setLoading(false); }
  };

  return (
    <section className="w-full bg-primary text-white pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-semibold">Business Details</h1>

        {toast && (
          <div className={`px-4 py-2 rounded-lg text-sm ${toast.type === 'success' ? 'bg-green-600/20 text-green-300 border border-green-700/50' : 'bg-red-600/20 text-red-300 border border-red-700/50'}`}>
            {toast.text}
          </div>
        )}

        <form onSubmit={save} className="space-y-4 bg-gray-900/60 border border-gray-800 p-6 rounded-xl">
          <div>
            <label className="block text-sm mb-1">Business Type</label>
            <input name="type" value={details.type} onChange={handleChange} placeholder="LLC / Sole Proprietor / ..." className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" />
          </div>
          <div>
            <label className="block text-sm mb-1">Registration Number</label>
            <input name="registrationNumber" value={details.registrationNumber} onChange={handleChange} placeholder="Registration Number" className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" />
          </div>
          <div>
            <label className="block text-sm mb-1">Tax ID</label>
            <input name="taxId" value={details.taxId} onChange={handleChange} placeholder="TIN / VAT" className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" />
          </div>
          {(() => {
            const isDirty = !!initialDetails && JSON.stringify(initialDetails) !== JSON.stringify(details);
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

export default BusinessDetailsSettings;

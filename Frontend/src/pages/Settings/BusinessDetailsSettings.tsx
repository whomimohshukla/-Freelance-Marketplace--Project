import React, { useEffect, useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import clientApi from '../../api/clientApi';

interface BD {
  type: string;
  registrationNumber: string;
  taxId: string;
}

const BusinessDetailsSettings: React.FC = () => {
  const role = useRole();
  if (role && role !== 'client') return <Navigate to="/" replace />;
  const [details, setDetails] = useState<BD>({ type: '', registrationNumber: '', taxId: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await clientApi.getMyProfile();
        setDetails(data.data.businessDetails || {});
      } catch (_) {}
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientApi.updateBusinessDetails(details);
    } finally { setLoading(false); }
  };

  return (
    <section className="space-y-8 max-w-xl">
      <h1 className="text-2xl font-semibold text-white">Business Details</h1>

      <form onSubmit={save} className="space-y-4">
        <input name="type" value={details.type} onChange={handleChange} placeholder="Business Type" className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white" />
        <input name="registrationNumber" value={details.registrationNumber} onChange={handleChange} placeholder="Registration Number" className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white" />
        <input name="taxId" value={details.taxId} onChange={handleChange} placeholder="Tax ID" className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white" />
        <button disabled={loading} className="px-4 py-2 bg-code-green text-black rounded-lg disabled:opacity-50">
          {loading ? 'Saving…' : 'Save'}
        </button>
      </form>
    </section>
  );
};

export default BusinessDetailsSettings;

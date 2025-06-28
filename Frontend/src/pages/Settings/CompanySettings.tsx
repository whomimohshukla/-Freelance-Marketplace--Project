import React, { useEffect, useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import clientApi from '../../api/clientApi';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await clientApi.getMyProfile();
        setCompany(data.data.company || {});
      } catch (_) {}
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientApi.updateCompany(company);
    } finally { setLoading(false); }
  };

  return (
    <section className="space-y-8 max-w-xl">
      <h1 className="text-2xl font-semibold text-white">Company Details</h1>

      <form onSubmit={save} className="space-y-4">
        <input name="name" value={company.name} onChange={handleChange} placeholder="Company Name" className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white" />
        <input name="website" value={company.website} onChange={handleChange} placeholder="Website" className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white" />
        <input name="size" value={company.size} onChange={handleChange} placeholder="Company Size" className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white" />
        <input type="date" name="founded" value={company.founded?.substring(0,10)} onChange={handleChange} className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white" />
        <textarea name="description" value={company.description} onChange={handleChange} placeholder="Description" className="w-full h-24 px-3 py-2 rounded-lg bg-gray-800 text-white" />
        <input name="logo" value={company.logo} onChange={handleChange} placeholder="Logo URL" className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white" />
        <button disabled={loading} className="px-4 py-2 bg-code-green text-black rounded-lg disabled:opacity-50">
          {loading ? 'Saving…' : 'Save'}
        </button>
      </form>
    </section>
  );
};

export default CompanySettings;

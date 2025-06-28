import React, { useEffect, useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import freelancerApi from '../../api/freelancerApi';

interface PortfolioItem {
  _id?: string;
  title: string;
  description: string;
  projectUrl: string;
  technologies: string[];
  images: { url: string; caption?: string }[];
}

const initialItem: PortfolioItem = {
  title: '',
  description: '',
  projectUrl: '',
  technologies: [],
  images: [],
};

const PortfolioSettings: React.FC = () => {
  const role = useRole();
  if (role && role !== 'freelancer') return <Navigate to="/" replace />;
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [form, setForm] = useState(initialItem);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data } = await freelancerApi.getMyProfile();
      setItems(data.data.portfolio || []);
    } catch (_) {
      // ignore
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await freelancerApi.addPortfolioItem({
        ...form,
        technologies: form.technologies,
        images: form.images,
      });
      setForm(initialItem);
      await load();
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id?: string) => {
    if (!id) return;
    await freelancerApi.deletePortfolioItem(id);
    setItems((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-semibold text-white">Portfolio</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full h-24 px-3 py-2 rounded-lg bg-gray-800 text-white"
        />
        <input
          name="projectUrl"
          placeholder="Project URL"
          value={form.projectUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white"
        />
        <input
          name="technologies"
          placeholder="Technologies (comma separated)"
          value={form.technologies.join(',')}
          onChange={(e) => setForm({ ...form, technologies: e.target.value.split(',').map((t) => t.trim()) })}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white"
        />
        <input
          name="image"
          placeholder="Cover image URL"
          value={form.images[0]?.url || ''}
          onChange={(e) => setForm({ ...form, images: [{ url: e.target.value }] })}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white"
        />
        <button
          disabled={loading}
          className="px-4 py-2 bg-code-green text-black rounded-lg disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Add Item'}
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p._id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 relative">
            <button
              onClick={() => remove(p._id)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-300"
            >
              ✕
            </button>
            {p.images[0]?.url && (
              <img src={p.images[0].url} alt={p.title} className="h-32 w-full object-cover rounded-lg mb-2" />
            )}
            <h3 className="text-lg font-semibold text-white">{p.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-3">{p.description}</p>
            <a href={p.projectUrl} className="text-code-green text-xs" target="_blank" rel="noreferrer">
              {p.projectUrl}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioSettings;

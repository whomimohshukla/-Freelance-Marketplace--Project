import React, { useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import freelancerApi from '../../api/freelancerApi';
import clientApi from '../../api/clientApi';
import { useRole } from '../../hooks/useRole';
import http from '../../api/http';
import { useAuth } from '../../context/AuthContext';
import { getClientProfileFromCache, setClientProfileCache } from '../../utils/clientProfileCache';

interface FreelancerForm {
  fullName: string;
  title: string;
  bio: string;
  hourlyRate: string;
}

interface ClientForm {
  contactName: string;
  companyName: string;
  website: string;
  description: string;
}

const ProfileSettings: React.FC = () => {
  const role = useRole();
  const { user: authUser, token, setAuth } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [freelancerForm, setFreelancerForm] = useState<FreelancerForm>({
    fullName: '',
    title: '',
    bio: '',
    hourlyRate: '',
  });

  const [clientForm, setClientForm] = useState<ClientForm>({
    contactName: '',
    companyName: '',
    website: '',
    description: '',
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (role === 'freelancer') {
          const res = await freelancerApi.getMyProfile();
          const p = res.data.data;
          if (p) {
            setFreelancerForm({
              fullName: `${p.user?.firstName || ''} ${p.user?.lastName || ''}`.trim(),
              title: p.title || '',
              bio: p.bio || '',
              hourlyRate: p.hourlyRate || '',
            });
            if (p.user?.avatar) setAvatarPreview(p.user.avatar);
          }
        } else if (role === 'client') {
          const res = await clientApi.getMyProfile();
          const p = res.data.data;
          if (p) {
            setClientForm({
              contactName: p.contactName || '',
              companyName: p.company?.name || '',
              website: p.company?.website || '',
              description: p.company?.description || '',
            });
            if (p.user?.avatar) setAvatarPreview(p.user.avatar);
            const remember = !!localStorage.getItem('user');
            setClientProfileCache(p, remember);
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [role]);

  useEffect(() => {
    const cached = getClientProfileFromCache();
    if (!cached) return;
    if (role === 'client') {
      setClientForm({
        contactName: cached.contactName || '',
        companyName: cached.company?.name || '',
        website: cached.company?.website || '',
        description: cached.company?.description || '',
      });
      if (cached.user?.avatar) setAvatarPreview(cached.user.avatar);
    } else if (role === 'freelancer' && cached.user) {
      setFreelancerForm((prev) => ({
        ...prev,
        fullName: `${cached.user.firstName || ''} ${cached.user.lastName || ''}`.trim() || prev.fullName,
      }));
      if (cached.user?.avatar) setAvatarPreview(cached.user.avatar);
    }
  }, [role]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const handleChangeFreelancer = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFreelancerForm({ ...freelancerForm, [e.target.name]: e.target.value });
  };

  const handleChangeClient = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setClientForm({ ...clientForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setToast(null);
      let avatarUrl: string | undefined;
      if (avatarFile) {
        const toDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const dataUrl = await toDataUrl(avatarFile);
        const uploadRes = await http.post('/uploads', { file: dataUrl, folder: 'avatars', resource_type: 'image' });
        avatarUrl = uploadRes.data?.url;
      }
      if (role === 'freelancer') {
        const name = freelancerForm.fullName.trim();
        const [firstName, ...rest] = name.split(' ');
        const lastName = rest.join(' ').trim();
        const userPayload: any = {};
        if (firstName) userPayload.firstName = firstName;
        if (lastName) userPayload.lastName = lastName;
        if (avatarUrl) userPayload.avatar = avatarUrl;
        if (Object.keys(userPayload).length) {
          const res = await http.put('/users/profile', userPayload);
          const updated = res.data?.data;
          if (updated) {
            const useLocal = !!localStorage.getItem('user');
            const storage = useLocal ? localStorage : sessionStorage;
            const nextUser = {
              ...(JSON.parse(storage.getItem('user') || '{}')),
              ...authUser,
              firstName: updated.firstName,
              lastName: updated.lastName,
              avatar: updated.avatar,
            } as any;
            storage.setItem('user', JSON.stringify(nextUser));
            if (token) setAuth(nextUser, token, useLocal);
          }
        }
      } else if (role === 'client') {
        const name = clientForm.contactName.trim();
        const [firstName, ...rest] = name.split(' ');
        const lastName = rest.join(' ').trim();
        const userPayload: any = {};
        if (firstName) userPayload.firstName = firstName;
        if (lastName) userPayload.lastName = lastName;
        if (avatarUrl) userPayload.avatar = avatarUrl;
        if (Object.keys(userPayload).length) {
          const res = await http.put('/users/profile', userPayload);
          const updated = res.data?.data;
          if (updated) {
            const useLocal = !!localStorage.getItem('user');
            const storage = useLocal ? localStorage : sessionStorage;
            const nextUser = {
              ...(JSON.parse(storage.getItem('user') || '{}')),
              ...authUser,
              firstName: updated.firstName,
              lastName: updated.lastName,
              avatar: updated.avatar,
            } as any;
            storage.setItem('user', JSON.stringify(nextUser));
            if (token) setAuth(nextUser, token, useLocal);
          }
        }
      }
      if (role === 'freelancer') {
        const payload: any = {};
        if (freelancerForm.title.trim()) payload.title = freelancerForm.title.trim();
        if (freelancerForm.bio.trim()) payload.bio = freelancerForm.bio.trim();
        if (freelancerForm.hourlyRate) payload.hourlyRate = freelancerForm.hourlyRate;
        if (Object.keys(payload).length) {
          await freelancerApi.updateProfile(payload);
        }
      } else if (role === 'client') {
        const payload: any = {};
        if (clientForm.contactName.trim()) payload.contactName = clientForm.contactName.trim();
        const company: any = {};
        if (clientForm.companyName.trim()) company.name = clientForm.companyName.trim();
        if (clientForm.website.trim()) company.website = clientForm.website.trim();
        if (clientForm.description.trim()) company.description = clientForm.description.trim();
        if (Object.keys(company).length) {
          await clientApi.updateCompany(company);
        }
        if (payload.contactName) {
          await clientApi.updateProfile({ contactName: payload.contactName });
        }
      }
      // reload canonical profile into the form
      if (role === 'freelancer') {
        try {
          const res = await freelancerApi.getMyProfile();
          const p = res.data.data;
          if (p) {
            setFreelancerForm({
              fullName: `${p.user?.firstName || ''} ${p.user?.lastName || ''}`.trim(),
              title: p.title || '',
              bio: p.bio || '',
              hourlyRate: p.hourlyRate || '',
            });
            if (p.user?.avatar) setAvatarPreview(p.user.avatar);
          }
        } catch (_) {}
      } else if (role === 'client') {
        try {
          const res = await clientApi.getMyProfile();
          const p = res.data.data;
          if (p) {
            setClientForm({
              contactName: p.contactName || '',
              companyName: p.company?.name || '',
              website: p.company?.website || '',
              description: p.company?.description || '',
            });
            if (p.user?.avatar) setAvatarPreview(p.user.avatar);
            const remember = !!localStorage.getItem('user');
            setClientProfileCache(p, remember);
          }
        } catch (_) {}
      }
      setToast({ type: 'success', text: 'Profile saved successfully' });
    } catch (err: any) {
      setToast({ type: 'error', text: err?.response?.data?.error || 'Failed to save profile' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;

  return (
    <section className="w-full bg-primary text-white pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-6">Profile Settings</h1>
        {toast && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${toast.type === 'success' ? 'bg-green-600/20 text-green-300 border border-green-700/50' : 'bg-red-600/20 text-red-300 border border-red-700/50'}`}>
            {toast.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-2">Avatar</label>
            <div className="flex items-center gap-6">
              {avatarPreview && (
                <img src={avatarPreview} alt="preview" className="w-24 h-24 rounded-full border-4 border-accent object-cover" />
              )}
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="text-sm" />
            </div>
          </div>

          {role === 'freelancer' && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  value={freelancerForm.fullName}
                  onChange={handleChangeFreelancer}
                  placeholder="John Doe"
                  className="w-full bg-light-blue border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="title">Professional Title</label>
                <input
                  id="title"
                  name="title"
                  value={freelancerForm.title}
                  onChange={handleChangeFreelancer}
                  placeholder="Full-Stack Developer"
                  className="w-full bg-light-blue border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={freelancerForm.bio}
                  onChange={handleChangeFreelancer}
                  rows={5}
                  placeholder="Tell clients about yourself..."
                  className="w-full bg-light-blue border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="hourlyRate">Hourly Rate ($)</label>
                <input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  value={freelancerForm.hourlyRate}
                  onChange={handleChangeFreelancer}
                  placeholder="40"
                  className="w-full bg-light-blue border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
            </>
          )}

          {role === 'client' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="contactName">Contact Name</label>
                <input
                  id="contactName"
                  name="contactName"
                  value={clientForm.contactName}
                  onChange={handleChangeClient}
                  placeholder="Jane Smith"
                  className="w-full bg-light-blue border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="companyName">Company Name</label>
                <input
                  id="companyName"
                  name="companyName"
                  value={clientForm.companyName}
                  onChange={handleChangeClient}
                  placeholder="Acme Inc."
                  className="w-full bg-light-blue border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  value={clientForm.website}
                  onChange={handleChangeClient}
                  placeholder="https://acme.com"
                  className="w-full bg-light-blue border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="description">Company Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={clientForm.description}
                  onChange={handleChangeClient}
                  rows={4}
                  placeholder="Describe your company..."
                  className="w-full bg-light-blue border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="flex items-center gap-2 bg-accent text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-accent-hover transition-transform disabled:opacity-70">
              <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProfileSettings;

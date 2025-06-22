import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSave } from 'react-icons/fi';

/**
 * Profile Settings page where logged-in users can update their avatar, bio, skills etc.
 * Route: /settings/profile
 */
const ProfileSettings: React.FC = () => {
  const [avatarPreview, setAvatarPreview] = useState<string>('https://ui-avatars.com/api/?name=JD&background=00F5C4&color=0A1828');
  const [form, setForm] = useState({
    fullName: '',
    title: '',
    bio: '',
    hourlyRate: '',
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
      // TODO: upload file to server on save
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call save API with form + avatar
    console.log('Saving profile...', form);
  };

  return (
    <section className="w-full bg-primary text-white pb-20 pt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-6">Profile Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-2">Avatar</label>
            <div className="flex items-center gap-6">
              <img src={avatarPreview} alt="preview" className="w-24 h-24 rounded-full border-4 border-accent object-cover" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="text-sm" />
            </div>
          </div>

          {/* Full name */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-light-blue border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="title">
              Professional Title
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Full-Stack Developer"
              className="w-full bg-light-blue border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={5}
              placeholder="Tell clients about yourself..."
              className="w-full bg-light-blue border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="hourlyRate">
              Hourly Rate ($)
            </label>
            <input
              id="hourlyRate"
              name="hourlyRate"
              type="number"
              value={form.hourlyRate}
              onChange={handleChange}
              placeholder="40"
              className="w-full bg-light-blue border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-accent text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-accent-hover transition-transform"
            >
              <FiSave /> Save Changes
            </button>
          </div>
        </form>

        {/* Back */}
        <div className="mt-8">
          <Link to="/" className="text-text-secondary hover:text-white text-sm">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProfileSettings;

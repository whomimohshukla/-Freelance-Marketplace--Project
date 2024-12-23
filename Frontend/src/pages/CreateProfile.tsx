import React, { useState } from 'react';

function CreateProfile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Profile Created:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center mt-12">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Create Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-code-green"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-code-green"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-code-green"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-code-green"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-code-green text-gray-900 font-bold rounded-lg hover:bg-code-green/90 transition-colors"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProfile;

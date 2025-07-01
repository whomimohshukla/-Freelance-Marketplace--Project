import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProfile } from '@/api/freelancer';
import { FiStar, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';

/**
 * Public freelancer profile page inspired by Fiverr but using the project's dark theme colours.
 * Route: /profile/:username
 */
const tabs = ['Overview', 'Portfolio', 'Reviews'];

const ProfileView: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived data helpers
  const fullName = profile ? `${profile.user.firstName} ${profile.user.lastName}` : '';
  const avatar = profile ? (profile.user.avatar || `https://ui-avatars.com/api/?name=${profile.user.firstName}&background=00F5C4&color=0A1828`) : '';
  const ratingValue = profile?.rating?.average || 0;
  const reviewCount = profile?.rating?.count || 0;

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await getProfile(userId);
        setProfile(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) return <div className="text-center text-white py-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;
  if (!profile) return null;

  return (
    <section className="w-full bg-primary text-white pb-20 pt-4">
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <Link to="/" className="flex items-center text-text-secondary hover:text-white text-sm">
          <FiArrowLeft className="mr-2" /> Back to home
        </Link>
      </div>

      {/* Header */}
      <header className="relative bg-light-blue/50 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center md:items-start">
          <img
            src={avatar}
            alt={fullName}
            className="w-32 h-32 rounded-full border-4 border-accent shadow-glow object-cover"
          />
          <div className="mt-6 md:mt-0 md:ml-8 flex-1">
            <h1 className="text-3xl font-semibold mb-1">{fullName}</h1>
            <p className="text-text-secondary mb-2">{profile.title}</p>
            {/* Rating */}
            <div className="flex items-center mb-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <FiStar
                  key={idx}
                  className={`w-5 h-5 ${idx < Math.round(ratingValue) ? 'text-accent' : 'text-gray-600'}`}
                />
              ))}
              <span className="ml-2 text-sm text-text-secondary">
                {ratingValue} ({reviewCount} reviews)
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="bg-accent text-gray-900 px-5 py-2 rounded-lg font-medium hover:bg-accent-hover transition-transform">
                Hire Me
              </button>
              <button className="flex items-center gap-2 border border-accent px-5 py-2 rounded-lg text-accent hover:bg-accent/10 transition-colors">
                <FiMessageSquare /> Contact
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 whitespace-nowrap text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content (placeholder) */}
        {activeTab === 'Overview' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">About {fullName.split(' ')[0]}</h2>
            <p className="leading-relaxed text-text-secondary max-w-4xl">
              {profile.bio}
            </p>
          </div>
        )}
        {activeTab === 'Portfolio' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Portfolio placeholders */}
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 bg-light-blue rounded-lg border border-gray-700 flex items-center justify-center text-text-secondary"
              >
                Coming Soon
              </div>
            ))}
          </div>
        )}
        {activeTab === 'Reviews' && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="border border-gray-700 rounded-lg p-5 bg-light-blue/50">
                <div className="flex items-center mb-2">
                  <span className="font-medium mr-2">Happy Client</span>
                  {Array.from({ length: 5 }).map((__, i) => (
                    <FiStar key={i} className="w-4 h-4 text-accent" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm">
                  "Great work! Highly recommend working with {fullName.split(' ')[0]}."
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileView;

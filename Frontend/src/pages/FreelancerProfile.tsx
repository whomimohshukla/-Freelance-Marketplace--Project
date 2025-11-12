import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiStar, FiMapPin, FiDollarSign, FiBriefcase, FiAward, 
  FiGlobe, FiGithub, FiLinkedin, FiArrowLeft, FiCalendar,
  FiCheckCircle, FiClock
} from 'react-icons/fi';
import HireFreelancerModal from '../components/modals/HireFreelancerModal';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

interface FreelancerProfile {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    location?: {
      current?: {
        city?: string;
        country?: string;
      };
    };
    createdAt: string;
  };
  title: string;
  bio: string;
  hourlyRate: number;
  skills: Array<{
    skill: {
      _id: string;
      name: string;
      category?: string;
    };
    experienceLevel: string;
    yearsOfExperience?: number;
  }>;
  rating: {
    average: number;
    count: number;
  };
  stats: {
    completedProjects: number;
    ongoingProjects: number;
    successRate: number;
    totalEarnings?: number;
  };
  availability: {
    status: string;
    hoursPerWeek?: number;
    timezone?: string;
  };
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  portfolio?: Array<{
    _id: string;
    title: string;
    description?: string;
    projectUrl?: string;
    images: Array<{ url: string; caption?: string }>;
    technologies?: string[];
    completionDate?: string;
  }>;
  workExperience?: Array<{
    company: string;
    position: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
  }>;
  education?: Array<{
    institution: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
  }>;
  certifications?: Array<{
    name: string;
    issuer?: string;
    issueDate?: string;
    credentialUrl?: string;
  }>;
  socialProfiles?: {
    github?: string;
    linkedin?: string;
    website?: string;
    stackoverflow?: string;
  };
  reviews?: Review[];
  ratingBreakdown?: Record<string, number>;
  averageAttributes?: {
    communication: string | null;
    quality: string | null;
    expertise: string | null;
    professionalism: string | null;
  };
  reviewCount?: number;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  project?: {
    title: string;
  };
  attributes?: {
    communication?: number;
    quality?: number;
    expertise?: number;
    professionalism?: number;
    hireAgain?: boolean;
  };
}

const FreelancerProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');
  const [showHireModal, setShowHireModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/freelancers/${userId}/detailed`);
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error: any) {
      console.error('Fetch profile error:', error);
      toast.error(error.response?.data?.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-code-green text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Profile not found</div>
      </div>
    );
  }

  const fullName = `${profile.user?.firstName || ''} ${profile.user?.lastName || ''}`.trim();
  const locationString = profile.user?.location?.current
    ? [profile.user.location.current.city, profile.user.location.current.country].filter(Boolean).join(', ')
    : '';

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/features/find-talent')}
          className="flex items-center gap-2 text-code-green hover:text-code-green/80 mb-6 transition-colors"
        >
          <FiArrowLeft /> Back to Search
        </button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={profile.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`}
                alt={fullName}
                className="w-32 h-32 rounded-full border-4 border-code-green"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{fullName}</h1>
                  <p className="text-xl text-gray-300 mb-3">{String(profile.title || '')}</p>
                  <div className="flex flex-wrap gap-4 text-gray-400">
                    {locationString && (
                      <div className="flex items-center gap-1">
                        <FiMapPin />
                        <span>{locationString}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <FiDollarSign />
                      <span>${Number(profile.hourlyRate) || 0}/hr</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock />
                      <span className="px-2 py-1 bg-code-green/10 text-code-green rounded-full text-xs">
                        {String(profile.availability?.status || 'Available')}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowHireModal(true)}
                  className="px-6 py-3 bg-code-green text-gray-900 rounded-xl hover:bg-code-green/90 transition-colors font-semibold"
                >
                  Hire Now
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-500 mb-1">
                    <FiStar className="fill-current" />
                    <span className="text-2xl font-bold text-white">
                      {typeof profile.rating?.average === 'number' ? profile.rating.average.toFixed(1) : '0.0'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{Number(profile.rating?.count) || 0} reviews</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-code-green mb-1">
                    <FiBriefcase />
                    <span className="text-2xl font-bold text-white">{Number(profile.stats?.completedProjects) || 0}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Completed</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-500 mb-1">
                    <FiAward />
                    <span className="text-2xl font-bold text-white">{Number(profile.stats?.successRate) || 0}%</span>
                  </div>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-purple-500 mb-1">
                    <FiClock />
                    <span className="text-2xl font-bold text-white">{Number(profile.stats?.ongoingProjects) || 0}</span>
                  </div>
                  <p className="text-gray-400 text-sm">Ongoing</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          {(['overview', 'portfolio', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-code-green border-b-2 border-code-green'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* About */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                >
                  <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                  <p className="text-gray-300 leading-relaxed">{String(profile.bio || '')}</p>
                </motion.div>

                {/* Skills */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                >
                  <h2 className="text-2xl font-bold text-white mb-4">Skills & Expertise</h2>
                  <div className="flex flex-wrap gap-3">
                    {Array.isArray(profile.skills) && profile.skills.map((skillItem, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600/50"
                      >
                        <div className="text-white font-medium">{String(skillItem?.skill?.name || 'Skill')}</div>
                        <div className="text-xs text-gray-400">
                          {String(skillItem?.experienceLevel || '')}
                          {skillItem?.yearsOfExperience && ` • ${skillItem.yearsOfExperience} yrs`}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Work Experience */}
                {Array.isArray(profile.workExperience) && profile.workExperience.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                  >
                    <h2 className="text-2xl font-bold text-white mb-4">Work Experience</h2>
                    <div className="space-y-4">
                      {profile.workExperience.map((exp, idx) => (
                        <div key={idx} className="border-l-2 border-code-green pl-4">
                          <h3 className="text-white font-semibold">{String(exp.position)}</h3>
                          <p className="text-gray-400">{String(exp.company)}</p>
                          {exp.description && <p className="text-gray-300 mt-2">{String(exp.description)}</p>}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Education */}
                {Array.isArray(profile.education) && profile.education.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                  >
                    <h2 className="text-2xl font-bold text-white mb-4">Education</h2>
                    <div className="space-y-4">
                      {profile.education.map((edu, idx) => (
                        <div key={idx} className="border-l-2 border-blue-500 pl-4">
                          <h3 className="text-white font-semibold">{String(edu.degree || edu.institution)}</h3>
                          <p className="text-gray-400">{String(edu.institution)}</p>
                          {edu.field && <p className="text-gray-300 text-sm">{String(edu.field)}</p>}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {Array.isArray(profile.portfolio) && profile.portfolio.length > 0 ? (
                  profile.portfolio.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                    >
                      <h3 className="text-xl font-bold text-white mb-3">{String(item.title)}</h3>
                      {item.description && <p className="text-gray-300 mb-4">{String(item.description)}</p>}
                      {Array.isArray(item.images) && item.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {item.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.url}
                              alt={String(img.caption || item.title)}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                      {Array.isArray(item.technologies) && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.technologies.map((tech, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                              {String(tech)}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-12">No portfolio items yet</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Summary */}
                {profile.ratingBreakdown && (
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-4">Rating Breakdown</h3>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-4">
                          <div className="flex items-center gap-1 w-16">
                            <span className="text-white">{star}</span>
                            <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                          </div>
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-code-green rounded-full h-2"
                              style={{
                                width: `${((profile.ratingBreakdown[star] || 0) / (profile.reviewCount || 1)) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-gray-400 w-12 text-right">{profile.ratingBreakdown[star] || 0}</span>
                        </div>
                      ))}
                    </div>

                    {profile.averageAttributes && (
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        {Object.entries(profile.averageAttributes).map(([key, value]) => 
                          value ? (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-400 capitalize">{key}:</span>
                              <span className="text-code-green font-semibold">{value}/5</span>
                            </div>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews List */}
                {Array.isArray(profile.reviews) && profile.reviews.length > 0 ? (
                  profile.reviews.map((review) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={review.reviewer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewer?.firstName}`}
                          alt={`${review.reviewer?.firstName} ${review.reviewer?.lastName}`}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold">
                              {String(review.reviewer?.firstName)} {String(review.reviewer?.lastName)}
                            </h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.project?.title && (
                            <p className="text-gray-400 text-sm mb-2">
                              Project: {String(review.project.title)}
                            </p>
                          )}
                          <p className="text-gray-300">{String(review.comment)}</p>
                          <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                            <FiCalendar className="w-4 h-4" />
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            {review.attributes?.hireAgain && (
                              <span className="flex items-center gap-1 text-code-green">
                                <FiCheckCircle className="w-4 h-4" />
                                Would hire again
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-12">No reviews yet</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Languages */}
            {Array.isArray(profile.languages) && profile.languages.length > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Languages</h3>
                <div className="space-y-2">
                  {profile.languages.map((lang, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-gray-300">{String(lang.language)}</span>
                      <span className="text-gray-400 text-sm">{String(lang.proficiency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {profile.socialProfiles && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Connect</h3>
                <div className="space-y-3">
                  {profile.socialProfiles.website && (
                    <a
                      href={profile.socialProfiles.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-300 hover:text-code-green transition-colors"
                    >
                      <FiGlobe className="w-5 h-5" />
                      <span>Website</span>
                    </a>
                  )}
                  {profile.socialProfiles.github && (
                    <a
                      href={`https://github.com/${profile.socialProfiles.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-300 hover:text-code-green transition-colors"
                    >
                      <FiGithub className="w-5 h-5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile.socialProfiles.linkedin && (
                    <a
                      href={profile.socialProfiles.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-300 hover:text-code-green transition-colors"
                    >
                      <FiLinkedin className="w-5 h-5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Certifications */}
            {Array.isArray(profile.certifications) && profile.certifications.length > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Certifications</h3>
                <div className="space-y-3">
                  {profile.certifications.map((cert, idx) => (
                    <div key={idx} className="border-l-2 border-code-green pl-3">
                      <h4 className="text-white font-medium">{String(cert.name)}</h4>
                      {cert.issuer && <p className="text-gray-400 text-sm">{String(cert.issuer)}</p>}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-code-green text-sm hover:underline"
                        >
                          View Credential
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hire Modal */}
      <HireFreelancerModal
        isOpen={showHireModal}
        onClose={() => setShowHireModal(false)}
        freelancerId={userId || ''}
        freelancerName={fullName}
        hourlyRate={profile?.hourlyRate}
      />
    </div>
  );
};

export default FreelancerProfile;

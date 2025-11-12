import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiStar, FiMapPin, FiDollarSign, FiAward, FiSliders, FiBriefcase, FiCheck, FiHeart, FiMessageSquare, FiLoader } from 'react-icons/fi';
import { useSearchParams, useNavigate } from 'react-router-dom';
import freelancerApi from '../../api/freelancerApi';
import { listSkills, listPopularSkills } from '../../api/skills';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';

interface Talent {
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
    successRate: number;
  };
  availability: {
    status: string;
    hoursPerWeek?: number;
  };
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  portfolio?: Array<{
    title: string;
    images: Array<{ url: string; caption?: string }>;
  }>;
}

interface Skill {
  _id: string;
  name: string;
  category: string;
}

interface FilterState {
  hourlyRate: [number, number];
  skills: string[];
  availability: string[];
  rating: number;
  location: string[];
  languages: string[];
  category: string;
}

const FindTalent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    hourlyRate: [0, 150],
    skills: [],
    availability: [],
    rating: 0,
    location: [],
    languages: [],
    category: ''
  });

  const [activeCategory, setActiveCategory] = useState<string>('');
  const [freelancers, setFreelancers] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [, setAvailableSkills] = useState<Skill[]>([]);
  const [, setPopularSkills] = useState<Skill[]>([]);
  const isMountedRef = useRef(false);

  // Fetch popular skills on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const [popularRes, allRes] = await Promise.all([
          listPopularSkills(20),
          listSkills({ limit: 100 })
        ]);
        if (popularRes.data.success) setPopularSkills(popularRes.data.data);
        if (allRes.data.success) setAvailableSkills(allRes.data.data);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      }
    };
    fetchSkills();
  }, []);


  // Create stable debounced search function
  const debouncedSearchRef = useRef(
    debounce((params: any) => {
      setLoading(true);
      freelancerApi.searchFreelancers(params)
        .then(response => {
          if (response.data.success) {
            setFreelancers(response.data.data);
            setPagination(response.data.pagination);
          }
        })
        .catch((error: any) => {
          console.error('Search error:', error);
          toast.error(error.response?.data?.error || 'Failed to search freelancers');
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300)
  );

  // Trigger search when filters change
  useEffect(() => {
    // Skip on initial mount
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    const params: any = {
      page: pagination.page,
      limit: pagination.limit
    };
    if (searchQuery) params.q = searchQuery;
    if (selectedSkills.length > 0) params.skills = selectedSkills.join(',');
    if (filters.hourlyRate[0] > 0) params.minRate = filters.hourlyRate[0];
    if (filters.hourlyRate[1] < 150) params.maxRate = filters.hourlyRate[1];
    if (filters.availability.length > 0) params.availability = filters.availability[0];
    if (filters.location.length > 0) params.location = filters.location[0];
    if (filters.languages.length > 0) params.languages = filters.languages.join(',');
    if (filters.rating > 0) params.minRating = filters.rating;

    // Update URL params
    const urlParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) urlParams.set(key, params[key].toString());
    });
    setSearchParams(urlParams);

    debouncedSearchRef.current(params);

    // Cleanup debounce on unmount
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, [searchQuery, selectedSkills, filters, pagination.page, setSearchParams]);


  const availabilityOptions = ['Full-time', 'Part-time', 'Hourly', 'As Needed'];
  const languageOptions = ['English', 'Spanish', 'Mandarin', 'Hindi', 'Arabic'];
  const locationOptions = ['North America', 'Europe', 'Asia', 'South America', 'Africa'];

  const skillCategories: Record<string, string[]> = {
    'Frontend Development': [
      'React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 
      'HTML/CSS', 'Tailwind CSS', 'Material UI', 'JavaScript',
      'Responsive Design', 'Web Animation', 'Frontend Testing'
    ],
    'Backend Development': [
      'Node.js', 'Python', 'Java', 'C#', 'PHP',
      'Ruby', 'Go', 'REST APIs', 'GraphQL',
      'Database Design', 'Microservices', 'DevOps'
    ],
    'Mobile Development': [
      'React Native', 'Flutter', 'iOS/Swift',
      'Android/Kotlin', 'Mobile UI/UX', 'App Testing',
      'Cross-Platform Development', 'Mobile Security'
    ],
    'UI/UX Design': [
      'Figma', 'Adobe XD', 'Sketch', 'User Research',
      'Wireframing', 'Prototyping', 'Design Systems',
      'Visual Design', 'Interaction Design'
    ],
    'Data Science': [
      'Python', 'R', 'Machine Learning', 'Data Analysis',
      'Data Visualization', 'Deep Learning', 'NLP',
      'Statistical Analysis', 'Big Data'
    ],
    'DevOps': [
      'Docker', 'Kubernetes', 'AWS', 'CI/CD',
      'Jenkins', 'Git', 'Linux', 'Cloud Architecture',
      'Infrastructure as Code'
    ]
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  // Use real data from backend
  const filteredTalent = freelancers;

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Find Expert Freelancers</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connect with talented professionals ready to bring your projects to life
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by skill, title, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700/50 focus:border-code-green focus:ring-1 focus:ring-code-green focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
            >
              <FiSliders className="w-5 h-5" />
              Advanced Filters
            </button>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-6 bg-gray-800/50 rounded-xl border border-gray-700/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Hourly Rate */}
                  <div>
                    <label className="block text-white mb-2">Hourly Rate</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="0"
                        max={filters.hourlyRate[1]}
                        value={filters.hourlyRate[0]}
                        onChange={(e) => handleFilterChange('hourlyRate', [parseInt(e.target.value), filters.hourlyRate[1]])}
                        className="w-24 px-3 py-2 bg-gray-700/50 text-white rounded-lg"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="number"
                        min={filters.hourlyRate[0]}
                        value={filters.hourlyRate[1]}
                        onChange={(e) => handleFilterChange('hourlyRate', [filters.hourlyRate[0], parseInt(e.target.value)])}
                        className="w-24 px-3 py-2 bg-gray-700/50 text-white rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-white mb-2">Availability</label>
                    <div className="flex flex-wrap gap-2">
                      {availabilityOptions.map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            const newAvailability = filters.availability.includes(option)
                              ? filters.availability.filter(a => a !== option)
                              : [...filters.availability, option];
                            handleFilterChange('availability', newAvailability);
                          }}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filters.availability.includes(option)
                              ? 'bg-code-green text-gray-900'
                              : 'bg-gray-700/50 text-white'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-white mb-2">Languages</label>
                    <div className="flex flex-wrap gap-2">
                      {languageOptions.map(lang => (
                        <button
                          key={lang}
                          onClick={() => {
                            const newLanguages = filters.languages.includes(lang)
                              ? filters.languages.filter(l => l !== lang)
                              : [...filters.languages, lang];
                            handleFilterChange('languages', newLanguages);
                          }}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filters.languages.includes(lang)
                              ? 'bg-code-green text-gray-900'
                              : 'bg-gray-700/50 text-white'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 sticky top-24 space-y-8">
              <div>
                <h3 className="text-white font-medium mb-4">Skills Categories</h3>
                <div className="space-y-2">
                  {Object.keys(skillCategories).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(activeCategory === category ? '' : category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeCategory === category
                          ? 'bg-code-green text-gray-900'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {activeCategory && (
                <div>
                  <h4 className="text-white font-medium mb-3">Popular {String(activeCategory)} Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillCategories[activeCategory].map((skill: string) => (
                      <button
                        key={String(skill)}
                        onClick={() => handleSkillSelect(skill)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedSkills.includes(skill)
                            ? 'bg-code-green text-gray-900'
                            : 'bg-gray-700/50 text-white hover:bg-gray-600/50'
                        }`}
                      >
                        {String(skill)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Skills */}
              {selectedSkills.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-3">Selected Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <span
                        key={String(skill)}
                        className="px-3 py-1 bg-code-green text-gray-900 rounded-full text-sm flex items-center gap-1"
                      >
                        {String(skill)}
                        <button
                          onClick={() => handleSkillSelect(skill)}
                          className="hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-white mb-2">Minimum Rating</label>
                <div className="flex items-center gap-2">
                  {[4, 4.5, 4.8].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('rating', rating)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        filters.rating === rating
                          ? 'bg-code-green text-gray-900'
                          : 'bg-gray-700/50 text-white'
                      }`}
                    >
                      <FiStar className={filters.rating === rating ? 'text-gray-900' : 'text-yellow-500'} />
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-white mb-2">Location</label>
                <div className="space-y-2">
                  {locationOptions.map(loc => (
                    <button
                      key={loc}
                      onClick={() => {
                        const newLocations = filters.location.includes(loc)
                          ? filters.location.filter(l => l !== loc)
                          : [...filters.location, loc];
                        handleFilterChange('location', newLocations);
                      }}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm ${
                        filters.location.includes(loc)
                          ? 'bg-code-green text-gray-900'
                          : 'bg-gray-700/50 text-white'
                      }`}
                    >
                      <FiMapPin className="w-4 h-4" />
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Talent List */}
          <div className="lg:col-span-3">
            {/* Results Summary */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-medium">
                  {loading ? 'Searching...' : `${Number(pagination.total) || 0} Freelancers Found`}
                  {selectedSkills.length > 0 && (
                    <span className="text-gray-400 text-sm">
                      {' '}matching your selected skills
                    </span>
                  )}
                </h3>
                {pagination.pages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                      disabled={pagination.page === 1 || loading}
                      className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-gray-400 text-sm">Page {Number(pagination.page)} of {Number(pagination.pages)}</span>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, pagination.pages) }))}
                      disabled={pagination.page === pagination.pages || loading}
                      className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <FiLoader className="w-8 h-8 text-code-green animate-spin" />
              </div>
            )}

            {!loading && filteredTalent.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No freelancers found matching your criteria.</p>
              </div>
            )}

            <div className="space-y-6">
              {!loading && filteredTalent.map((talent) => (
                <motion.div
                  key={talent._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 hover:border-code-green/40 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Info */}
                    <div className="flex gap-4 md:w-2/3">
                      <div className="relative">
                        <img
                          src={talent.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${talent.user?.firstName}`}
                          alt={`${talent.user?.firstName} ${talent.user?.lastName}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="absolute -top-2 -right-2 bg-code-green text-gray-900 rounded-full p-1">
                          <FiCheck className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-medium">{talent.user?.firstName} {talent.user?.lastName}</h3>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-code-green transition-colors">
                              <FiHeart className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-code-green transition-colors">
                              <FiMessageSquare className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{talent.title}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <FiStar className="text-yellow-500" />
                            <span>{
                              typeof talent.rating?.average === 'number'
                                ? talent.rating.average.toFixed(1)
                                : '0.0'
                            } ({Number(talent.rating?.count) || 0})</span>
                          </div>
                          {talent.user?.location?.current?.city && (
                            <div className="flex items-center gap-1">
                              <FiMapPin className="text-gray-500" />
                              <span>
                                {[talent.user.location.current.city, talent.user.location.current.country]
                                  .filter(Boolean)
                                  .join(', ')}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <FiDollarSign className="text-gray-500" />
                            <span>${Number(talent.hourlyRate) || 0}/hr</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="md:w-1/3">
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <div className="flex items-center gap-1 text-gray-400">
                          <FiBriefcase />
                          <span>{Number(talent.stats?.completedProjects) || 0} projects</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <FiAward />
                          <span>{Number(talent.stats?.successRate) || 0}% success</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-code-green/10 text-code-green rounded-full text-xs">
                          {String(talent.availability?.status || 'Available')}
                        </span>
                        {Array.isArray(talent.languages) && talent.languages.slice(0, 2).map((lang: any, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs"
                          >
                            {String(lang?.language || '')}
                          </span>
                        ))}
                      </div>
                      <button 
                        onClick={() => navigate(`/freelancer/${talent.user?._id}`)}
                        className="w-full px-4 py-2 bg-code-green text-gray-900 rounded-xl hover:bg-code-green/90 transition-colors font-semibold"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-400 text-sm mb-4">{String(talent.bio || '')}</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(talent.skills) && talent.skills.slice(0, 6).map((skillItem: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                        >
                          {String(skillItem?.skill?.name || 'Skill')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Preview */}
                  {Array.isArray(talent.portfolio) && talent.portfolio.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-white text-sm font-medium mb-3">Recent Work</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {talent.portfolio.slice(0, 2).map((item: any, index: number) => (
                          <div key={index} className="relative group">
                            <img
                              src={item.images?.[0]?.url || 'https://picsum.photos/seed/portfolio/300/200'}
                              alt={String(item?.title || 'Portfolio')}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-gray-900/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm">{String(item?.title || '')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTalent;

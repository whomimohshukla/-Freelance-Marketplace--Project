import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiStar, FiMapPin, FiDollarSign, FiClock, FiAward } from 'react-icons/fi';

interface Talent {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  hourlyRate: number;
  location: string;
  skills: string[];
  description: string;
  completedProjects: number;
  successRate: number;
}

const FindTalent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const mockTalent: Talent[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      title: 'Full Stack Developer',
      rating: 4.9,
      hourlyRate: 45,
      location: 'San Francisco, USA',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      description: 'Experienced full-stack developer specializing in React and Node.js. Strong focus on clean code and scalable architecture.',
      completedProjects: 87,
      successRate: 98
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      title: 'UI/UX Designer',
      rating: 4.8,
      hourlyRate: 55,
      location: 'London, UK',
      skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research'],
      description: 'Creative UI/UX designer with a passion for creating intuitive and beautiful user experiences.',
      completedProjects: 64,
      successRate: 96
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      title: 'Mobile Developer',
      rating: 4.7,
      hourlyRate: 50,
      location: 'Berlin, Germany',
      skills: ['React Native', 'iOS', 'Android', 'Flutter'],
      description: 'Mobile development expert with extensive experience in cross-platform development.',
      completedProjects: 52,
      successRate: 94
    }
  ];

  const skillCategories = [
    'Development',
    'Design',
    'Marketing',
    'Writing',
    'Admin Support',
    'Customer Service',
    'Consulting'
  ];

  const popularSkills = [
    'React',
    'Node.js',
    'Python',
    'UI/UX',
    'WordPress',
    'SEO',
    'Content Writing',
    'Digital Marketing'
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for skilled freelancers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700/50 focus:border-code-green focus:ring-1 focus:ring-code-green focus:outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
              <FiFilter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Popular Skills */}
        <div className="mb-8">
          <h3 className="text-white text-lg font-medium mb-4">Popular Skills</h3>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkills([...selectedSkills, skill])}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedSkills.includes(skill)
                    ? 'bg-code-green text-gray-900'
                    : 'bg-gray-800/50 text-white hover:bg-gray-700/50'
                } transition-colors`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-white font-medium mb-4">Categories</h3>
              <div className="space-y-2">
                {skillCategories.map((category) => (
                  <button
                    key={category}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Talent List */}
          <div className="lg:col-span-3 space-y-6">
            {mockTalent.map((talent) => (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Info */}
                  <div className="flex gap-4 md:w-2/3">
                    <img
                      src={talent.avatar}
                      alt={talent.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-white font-medium">{talent.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{talent.title}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <FiStar className="text-yellow-500" />
                          <span>{talent.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiMapPin className="text-gray-500" />
                          <span>{talent.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiDollarSign className="text-gray-500" />
                          <span>${talent.hourlyRate}/hr</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="md:w-1/3 flex flex-col justify-between">
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-400">
                        <FiClock />
                        <span>{talent.completedProjects} projects</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <FiAward />
                        <span>{talent.successRate}% success</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 px-6 py-2 bg-code-green text-gray-900 rounded-xl hover:bg-code-green/90 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-400 text-sm mb-4">{talent.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {talent.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTalent;

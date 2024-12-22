import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiDollarSign, FiClock, FiTag } from 'react-icons/fi';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  skills: string[];
  postedDate: string;
  clientRating: number;
  proposals: number;
}

const SearchProjects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Modern E-commerce Website Development',
      description: 'Looking for a skilled developer to build a modern e-commerce website with React and Node.js. Must have experience with payment integration and responsive design.',
      budget: 3000,
      skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      postedDate: '2 hours ago',
      clientRating: 4.8,
      proposals: 5
    },
    {
      id: '2',
      title: 'Mobile App UI/UX Design',
      description: 'Need a talented UI/UX designer for our fitness tracking mobile app. The design should be modern, clean, and user-friendly.',
      budget: 2500,
      skills: ['UI/UX Design', 'Figma', 'Mobile Design', 'iOS'],
      postedDate: '4 hours ago',
      clientRating: 4.9,
      proposals: 8
    }
  ]);

  const availableSkills = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
    'UI/UX Design', 'Mobile Development', 'DevOps', 'Data Science',
    'Angular', 'Vue.js', 'AWS', 'Docker', 'Kubernetes'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual API call
    console.log('Searching for:', { searchQuery, selectedSkills });
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your Perfect Project
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Browse through thousands of projects posted by clients worldwide. 
              Use our advanced search to find the perfect match for your skills.
            </p>
          </div>
          
          {/* Search Form */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects by keyword..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 text-white rounded-xl border border-gray-700 focus:border-code-green focus:ring-1 focus:ring-code-green focus:outline-none transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="inline-flex items-center px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  <FiFilter className="mr-2" />
                  Filters
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-code-green text-gray-900 font-medium rounded-xl hover:bg-code-green/90 transition-colors"
                >
                  Search
                </button>
              </div>

              {/* Expandable Filters */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-gray-700">
                      <h3 className="text-white font-medium mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {availableSkills.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                              selectedSkills.includes(skill)
                                ? 'bg-code-green text-gray-900'
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group relative bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 hover:border-code-green/50 transition-colors"
                >
                  {/* Project Header */}
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-white group-hover:text-code-green transition-colors">
                        {project.title}
                      </h3>
                      <span className="flex items-center px-3 py-1 bg-code-green/10 text-code-green rounded-full text-sm">
                        <FiDollarSign className="mr-1" />
                        ${project.budget}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <FiClock className="mr-1" />
                        {project.postedDate}
                      </span>
                      <span>⭐ {project.clientRating}</span>
                      <span>{project.proposals} proposals</span>
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="text-gray-300 mb-4">
                    {project.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                      >
                        <FiTag className="inline mr-1" />
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors">
                    View Details
                  </button>

                  {/* Hover Effect Gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-code-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="w-24 h-24 mb-4 text-gray-600">
                  <FiSearch className="w-full h-full" />
                </div>
                <p className="text-gray-400 text-lg mb-2">No projects found</p>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchProjects;

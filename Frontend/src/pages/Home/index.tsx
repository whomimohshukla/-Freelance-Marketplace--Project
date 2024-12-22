import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleFindTalent = () => {
    navigate("/features/find-talent");
  };

  const handleBecomeFreelancer = () => {
    navigate("/become-freelancer");
  };

  return (
    <div className="min-h-screen bg-dark-blue relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(0,245,196,0.03),rgba(0,245,196,0)_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,245,196,0.1),transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,245,196,0.08),transparent_50%)] pointer-events-none"></div>

      {/* Animated Dots Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(0,245,196,0.1) 2px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-16">
        {/* Hero Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-code-green/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-code-green/5 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-code-green/5 rounded-full blur-[80px] -z-10 animate-pulse-slow delay-1000"></div>

        <div className="container mx-auto px-4 pt-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block animate-float">
              <span className="inline-flex items-center rounded-full px-4 py-1 text-xs font-medium bg-code-green/10 text-code-green ring-1 ring-inset ring-code-green/20 mb-6">
                <svg
                  className="w-3 h-3 mr-1"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <circle cx="6" cy="6" r="3" className="animate-pulse" />
                </svg>
                Powered by AI
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-400 text-transparent bg-clip-text"
            >
              Find the Perfect Freelance Services for Your Business
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              Connect with talented freelancers, collaborate on projects, and
              grow your business with our AI-powered platform
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={handleFindTalent}
                className="group w-full sm:w-auto bg-code-green hover:bg-accent-hover text-dark-blue px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,245,196,0.3)] relative overflow-hidden"
              >
                <span className="relative z-10">Find Talent</span>
                <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></div>
              </button>
              <button
                onClick={handleBecomeFreelancer}
                className="group w-full sm:w-auto border border-code-green/20 hover:border-code-green/40 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-code-green/5 relative overflow-hidden"
              >
                <span className="relative z-10">Become a Freelancer</span>
                <div className="absolute inset-0 h-full w-0 bg-code-green/5 transition-all duration-300 group-hover:w-full"></div>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20 relative">
        {/* Features Background Effects */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-code-green/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-code-green/5 rounded-full blur-[80px] -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose SkillBridge?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our AI-powered platform makes it easy to find the perfect match for
            your project
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
              title: "Secure Authentication",
              description:
                "Robust user authentication system with role-based access control for clients and freelancers.",
            },
            {
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              title: "Project Management",
              description:
                "Create, track, and manage projects with milestone tracking and progress monitoring.",
            },
            {
              icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
              title: "Proposal System",
              description:
                "Submit and review detailed proposals with custom requirements and pricing options.",
            },
            {
              icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
              title: "Real-time Chat",
              description:
                "Instant messaging system with file sharing and notification support.",
            },
            {
              icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
              title: "Secure Payments",
              description:
                "Integrated payment system with escrow protection and milestone-based releases.",
            },
            {
              icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
              title: "Advanced Search",
              description:
                "Powerful search with filters for skills, budget, location, and project categories.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              className="group relative bg-gradient-to-b from-light-blue/50 to-dark-blue p-6 rounded-xl border border-code-green/20 hover:border-code-green/40 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-xl bg-code-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-code-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-code-green/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-code-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-20 relative">
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-code-green/5 rounded-full blur-[80px] -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How SkillBridge Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get your project done in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Post Project",
              description: "Share your project details and requirements",
            },
            {
              step: "02",
              title: "Get Proposals",
              description: "Receive proposals from skilled freelancers",
            },
            {
              step: "03",
              title: "Choose & Hire",
              description: "Select the best freelancer for your project",
            },
            {
              step: "04",
              title: "Complete Project",
              description: "Work together and get your project done",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="relative group"
            >
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-code-green/20 to-code-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6 rounded-lg border border-code-green/20">
                <div className="text-4xl font-bold text-code-green mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popular Categories Section */}
      <div className="container mx-auto px-4 py-20 relative">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-code-green/5 rounded-full blur-[100px] -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Popular Categories
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our most sought-after service categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Web Development", count: "2,156 Freelancers" },
            { title: "Mobile Apps", count: "1,843 Freelancers" },
            { title: "UI/UX Design", count: "1,650 Freelancers" },
            { title: "Digital Marketing", count: "1,465 Freelancers" },
            { title: "Content Writing", count: "1,294 Freelancers" },
            { title: "Data Science", count: "1,182 Freelancers" },
            { title: "Video Editing", count: "976 Freelancers" },
            { title: "AI Development", count: "865 Freelancers" },
          ].map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group cursor-pointer"
            >
              <div className="p-6 rounded-lg border border-code-green/20 hover:border-code-green/40 transition-all duration-300 bg-gradient-to-b from-light-blue/50 to-dark-blue relative overflow-hidden">
                <div className="absolute inset-0 bg-code-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-400">{category.count}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-20 relative">
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-code-green/5 rounded-full blur-[80px] -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Read success stories from our community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Project Manager",
              company: "Tech Solutions Inc",
              image: "https://randomuser.me/api/portraits/women/1.jpg",
              quote:
                "SkillBridge made it incredibly easy to find talented developers. The quality of work exceeded our expectations.",
            },
            {
              name: "Michael Chen",
              role: "Freelance Designer",
              company: "Independent",
              image: "https://randomuser.me/api/portraits/men/2.jpg",
              quote:
                "As a freelancer, I've found amazing opportunities through SkillBridge. The platform is intuitive and client communication is seamless.",
            },
            {
              name: "Emily Davis",
              role: "Startup Founder",
              company: "InnovateTech",
              image: "https://randomuser.me/api/portraits/women/3.jpg",
              quote:
                "The proposal system and project management tools helped us scale our development team efficiently.",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              className="relative group"
            >
              <div className="p-6 rounded-lg border border-code-green/20 hover:border-code-green/40 transition-all duration-300 bg-gradient-to-b from-light-blue/50 to-dark-blue">
                <div className="absolute inset-0 bg-code-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="text-white font-semibold">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        {/* CTA Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,245,196,0.1),transparent_70%)] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-code-green/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-code-green/5 rounded-full blur-[80px] -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-20 relative"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-300 mb-8">
              Join thousands of businesses who have found success with our
              freelance talent.
            </p>
            <button className="group bg-code-green hover:bg-accent-hover text-dark-blue px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,245,196,0.3)] relative overflow-hidden">
              <span className="relative z-10">Get Started Now</span>
              <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

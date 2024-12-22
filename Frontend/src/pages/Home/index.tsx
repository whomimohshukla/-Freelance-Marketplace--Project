import React from 'react'
import { motion } from 'framer-motion'

const Home = () => {
  return (
    <div className="min-h-screen bg-dark-blue relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(0,245,196,0.03),rgba(0,245,196,0)_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,245,196,0.1),transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,245,196,0.08),transparent_50%)] pointer-events-none"></div>
      
      {/* Animated Dots Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at center, rgba(0,245,196,0.1) 2px, transparent 2px)`,
          backgroundSize: '40px 40px',
        }}></div>
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
                <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="currentColor">
                  <circle cx="6" cy="6" r="3" className="animate-pulse"/>
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
              Connect with talented freelancers, collaborate on projects, and grow your business with our AI-powered platform
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button className="group w-full sm:w-auto bg-code-green hover:bg-accent-hover text-dark-blue px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,245,196,0.3)] relative overflow-hidden">
                <span className="relative z-10">Find Talent</span>
                <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></div>
              </button>
              <button className="group w-full sm:w-auto border border-code-green/20 hover:border-code-green/40 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-code-green/5 relative overflow-hidden">
                <span className="relative z-10">Become a Freelancer</span>
                <div className="absolute inset-0 h-full w-0 bg-code-green/5 transition-all duration-300 group-hover:w-full"></div>
              </button>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: '1M+', label: 'Active Freelancers' },
              { number: '50K+', label: 'Completed Projects' },
              { number: '95%', label: 'Client Satisfaction' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="text-center relative group"
              >
                <div className="absolute inset-0 bg-code-green/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
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
            Our AI-powered platform makes it easy to find the perfect match for your project
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              title: "Fast Matching",
              description: "Our AI-powered matching system connects you with the perfect freelancers for your project in minutes."
            },
            {
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              title: "Secure Payments",
              description: "Enjoy peace of mind with our secure payment system and milestone-based releases."
            },
            {
              icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z",
              title: "24/7 Support",
              description: "Get help whenever you need it with our round-the-clock customer support team."
            }
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
                  <svg className="w-6 h-6 text-code-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
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
              Join thousands of businesses who have found success with our freelance talent.
            </p>
            <button className="group bg-code-green hover:bg-accent-hover text-dark-blue px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,245,196,0.3)] relative overflow-hidden">
              <span className="relative z-10">Get Started Now</span>
              <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home

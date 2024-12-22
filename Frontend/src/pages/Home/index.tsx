import React from 'react'

const Home = () => {
  return (
    <div className="min-h-screen bg-dark-blue">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-code-green/10 via-dark-blue to-dark-blue"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_70%)]"></div>
        
        <div className="container mx-auto px-4 pt-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block">
              <span className="inline-flex items-center rounded-full px-4 py-1 text-xs font-medium bg-code-green/10 text-code-green ring-1 ring-inset ring-code-green/20 mb-6">
                Powered by AI
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
              Find the Perfect Freelance Services for Your Business
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Connect with talented freelancers, collaborate on projects, and grow your business with our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="w-full sm:w-auto bg-code-green hover:bg-accent-hover text-dark-blue px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,245,196,0.3)]">
                Find Talent
              </button>
              <button className="w-full sm:w-auto border border-code-green/20 hover:border-code-green/40 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-code-green/5">
                Become a Freelancer
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1M+</div>
              <div className="text-sm text-gray-400">Active Freelancers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-sm text-gray-400">Completed Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-sm text-gray-400">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose FreelanceHub?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our AI-powered platform makes it easy to find the perfect match for your project
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative bg-gradient-to-b from-light-blue to-dark-blue p-6 rounded-xl border border-code-green/20 hover:border-code-green/40 transition-all duration-300">
            <div className="absolute inset-0 rounded-xl bg-code-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-code-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-code-green/20 transition-colors">
                <svg className="w-6 h-6 text-code-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Matching</h3>
              <p className="text-gray-400">
                Our AI-powered matching system connects you with the perfect freelancers for your project in minutes.
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-b from-light-blue to-dark-blue p-6 rounded-xl border border-code-green/20 hover:border-code-green/40 transition-all duration-300">
            <div className="absolute inset-0 rounded-xl bg-code-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-code-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-code-green/20 transition-colors">
                <svg className="w-6 h-6 text-code-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure Payments</h3>
              <p className="text-gray-400">
                Enjoy peace of mind with our secure payment system and milestone-based releases.
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-b from-light-blue to-dark-blue p-6 rounded-xl border border-code-green/20 hover:border-code-green/40 transition-all duration-300">
            <div className="absolute inset-0 rounded-xl bg-code-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-code-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-code-green/20 transition-colors">
                <svg className="w-6 h-6 text-code-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
              <p className="text-gray-400">
                Get help whenever you need it with our round-the-clock customer support team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-code-green/10 via-dark-blue to-dark-blue"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-300 mb-8">
              Join thousands of businesses who have found success with our freelance talent.
            </p>
            <button className="bg-code-green hover:bg-accent-hover text-dark-blue px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,245,196,0.3)]">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

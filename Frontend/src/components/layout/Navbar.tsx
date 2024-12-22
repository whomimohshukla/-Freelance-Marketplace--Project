import React, { useState } from 'react'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 backdrop-blur-md bg-dark-blue/80 border-b border-code-green/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-code-green to-[#80FFF2] text-transparent bg-clip-text">
              FreelanceHub
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm text-gray-300 hover:text-code-green transition-colors">
              Find Talent
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-code-green transition-colors">
              Find Work
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-code-green transition-colors">
              Why Us
            </a>
            <div className="ml-6 flex items-center space-x-3">
              <button className="text-sm bg-transparent text-gray-300 hover:text-code-green px-4 py-2 rounded-lg transition-colors">
                Sign In
              </button>
              <button className="text-sm bg-code-green hover:bg-accent-hover text-dark-blue px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,245,196,0.3)]">
                Sign Up Free
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300 hover:text-code-green"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-code-green/10">
            <a href="#" className="block text-sm text-gray-300 hover:text-code-green transition-colors">
              Find Talent
            </a>
            <a href="#" className="block text-sm text-gray-300 hover:text-code-green transition-colors">
              Find Work
            </a>
            <a href="#" className="block text-sm text-gray-300 hover:text-code-green transition-colors">
              Why Us
            </a>
            <div className="space-y-2 pt-2 border-t border-code-green/10">
              <button className="w-full text-sm text-gray-300 hover:text-code-green px-4 py-2 rounded-lg transition-colors">
                Sign In
              </button>
              <button className="w-full text-sm bg-code-green hover:bg-accent-hover text-dark-blue px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,245,196,0.3)]">
                Sign Up Free
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
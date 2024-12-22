import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronDown } from 'react-icons/fi'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">SkillBridge</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                <span>Features</span>
                <FiChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-xl bg-gray-900 border border-gray-800 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                <div className="py-2 px-3">
                  <Link to="/features/search" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                    Search Projects
                  </Link>
                  <Link to="/features/messaging" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                    Messaging
                  </Link>
                  <Link to="/features/payments" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                    Secure Payments
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                <span>Resources</span>
                <FiChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-xl bg-gray-900 border border-gray-800 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                <div className="py-2 px-3">
                  <Link to="/resources/blog" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                    Blog
                  </Link>
                  <Link to="/resources/guides" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                    Guides
                  </Link>
                  <Link to="/resources/help" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                    Help Center
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/pricing" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Pricing
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-code-green hover:bg-code-green/90 text-gray-900 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-code-green"
            >
              <span className="sr-only">Open main menu</span>
              <div className="h-6 w-6 flex flex-col justify-between">
                <span className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 border-t border-gray-800">
          <Link
            to="/features"
            className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Features
          </Link>
          <Link
            to="/resources"
            className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Resources
          </Link>
          <Link
            to="/pricing"
            className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/login"
            className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="block px-3 py-2 text-base font-medium text-white bg-code-green hover:bg-code-green/90 rounded-lg transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar